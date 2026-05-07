"use client";

import { useState } from "react";
import axios from "axios";

type Message = {
  user: string;
  bot: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    // add user message immediately
    setChat((prev) => [...prev, { user: userMsg, bot: "" }]);

    setLoading(true);

    try {
      const res = await axios.get(
  `https://hospital-ai-system-vh79.onrender.com/chat?message=${userMsg}`
);

      // update last message with bot reply
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = res.data;
        return updated;
      });
    } catch (error) {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot =
          "❌ Error connecting to server";
        return updated;
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h2 style={{ textAlign: "center" }}>🏥 Hospital AI Chat</h2>

        <div style={styles.messages}>
          {chat.map((c, i) => (
            <div key={i}>
              <div style={styles.userBubble}>
                {c.user}
              </div>

              {c.bot && (
                <div style={styles.botBubble}>
                  {c.bot}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={styles.typing}>
              Bot is typing...
            </div>
          )}
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
    height: "100vh",
  },
  chatBox: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    height: 400,
    padding: 10,
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    margin: "5px 0",
    alignSelf: "flex-end",
    textAlign: "right",
    maxWidth: "80%",
    marginLeft: "auto",
  },
  botBubble: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    margin: "5px 0",
    maxWidth: "80%",
  },
  typing: {
    fontStyle: "italic",
    color: "gray",
    marginTop: 10,
  },
  inputBox: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};