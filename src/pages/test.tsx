import { useState } from "react";
import { api } from "../utils/api";

export default function TestPage() {
  const [isTyping, setIsTyping] = useState(false);

  api.isTyping.useSubscription(undefined, {
    onData: (_isTyping) => {
      setIsTyping(_isTyping);
    },
  });

  return isTyping && <p className="text-gray-400">Someone is typing...</p>;
}
