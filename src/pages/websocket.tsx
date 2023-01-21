import { useState } from "react";
import { api } from "../../src/utils/api";

export default function WebSocketPage() {
  api.ws.useSubscription(undefined, {
    onData: (data) => {
      console.log("data", data);
    },
  });

  const { mutate } = api.add.useMutation();

  const [state, setState] = useState("");

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <h1 className="font-mono text-3xl">WebSocket</h1>
      <input
        className="rounded-md border-2 border-gray-300 p-2"
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <button
        onClick={() => mutate({ text: state })}
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        Add
      </button>
    </div>
  );
}
