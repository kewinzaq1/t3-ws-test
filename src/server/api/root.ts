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
    return observable<any>((emit) => {
      const onAdd = (data: any) => {
        emit.next(data);
      };

      ee.on("add", onAdd);

      return () => {
        ee.off("add", onAdd);
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
