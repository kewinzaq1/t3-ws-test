import { createTRPCRouter, publicProcedure } from "./trpc";
import { exampleRouter } from "./routers/example";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

const ee = new EventEmitter();

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  ws: publicProcedure.subscription(() => {
    return observable<{
      text: string;
      isTyping: boolean;
    }>((emit) => {
      const onAdd = (data: { text: string }) => {
        emit.next({
          text: data.text,
          isTyping: false,
        });
      };

      ee.on("add", onAdd);

      return () => {
        ee.off("add", onAdd);
      };
    });
  }),

  isTyping: publicProcedure.subscription(() => {
    return observable<boolean>((emit) => {
      const onTyping = (data: boolean) => {
        emit.next(data);
      };

      ee.on("typing", onTyping);

      return () => {
        ee.off("typing", onTyping);
      };
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(({ input }) => {
      ee.emit("add", input);
      return {
        success: true,
      };
    }),
  typing: publicProcedure.input(z.boolean()).mutation(({ input }) => {
    ee.emit("typing", input);
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
