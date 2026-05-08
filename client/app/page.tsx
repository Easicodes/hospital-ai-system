"use client";

import { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

type Message = {
  user: string;
  bot: string;
};

export default function Home() {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState<Message[]>(
    []
  );

  const [loading, setLoading] =
    useState(false);

  const [step, setStep] = useState("");

  const [patientName, setPatientName] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [availableDates, setAvailableDates] =
  useState<any[]>([]);

  // WELCOME MESSAGE
  useEffect(() => {
    setChat([
      {
        user: "",
        bot: "👋 Welcome to Hospital AI.\nHow can we help you today?",
      },
    ]);
  }, []);

  // RANDOM DATE GENERATOR
  const generateDates = () => {
  const dates = [];

  const today = new Date();

  for (let i = 1; i <= 3; i++) {
    const randomDays =
      Math.floor(Math.random() * 10) + i;

    const futureDate = new Date();
    futureDate.setDate(
      today.getDate() + randomDays
    );

    dates.push({
      label: futureDate.toDateString(),
      value: futureDate.toISOString(),
    });
  }

  return dates;
};

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    setChat((prev) => [
      ...prev,
      {
        user: userMsg,
        bot: "",
      },
    ]);

    setMessage("");

    setLoading(true);
    const thinkingTime =
  Math.floor(Math.random() * 2000) + 1000;

await new Promise((resolve) =>
  setTimeout(resolve, thinkingTime)
);
    let botReply = "";

    // START APPOINTMENT FLOW
    if (
      userMsg.toLowerCase() ===
        "appointment" &&
      step === ""
    ) {
      botReply =
        "Sure 😊 What is your full name?";

      setStep("askName");
    }

    // SAVE NAME
    else if (step === "askName") {
  setPatientName(userMsg);

  const generatedDates = generateDates();

  setAvailableDates(generatedDates);

  botReply = `Nice to meet you ${userMsg} 😊

Please choose an appointment date by replying with a number:

1. ${generatedDates[0].label}
2. ${generatedDates[1].label}
3. ${generatedDates[2].label}`;

  setStep("askDate");
}

    // SAVE DATE + FIREBASE
    else if (step === "askDate") {
  const index = parseInt(userMsg) - 1;

  if (
    isNaN(index) ||
    index < 0 ||
    index > 2
  ) {
    botReply =
      "❌ Please reply with 1, 2 or 3 only.";
  } else {
    const chosen =
      availableDates[index];

    try {
      await addDoc(
        collection(db, "appointments"),
        {
          name: patientName,
          appointmentDate:
            chosen.label,
          createdAt:
            serverTimestamp(),
        }
      );

      botReply = `✅ Appointment booked successfully!

Patient Name: ${patientName}
Appointment Date: ${chosen.label}

Thank you for choosing Hospital AI 🏥`;

      setStep("");
      setPatientName("");
      setAvailableDates([]);
    } catch (error) {
      botReply =
        "❌ Failed to save appointment.";
    }
  }
}

    // GENERAL GREETING
    else if (
      userMsg
        .toLowerCase()
        .includes("hello")
    ) {
      botReply =
        "Hello 👋 How can we help you today?";
    }

    else {
      botReply =
        "Please type 'appointment' to book an appointment.";
    }

    setChat((prev) => {
      const updated = [...prev];

      updated[
        updated.length - 1
      ].bot = botReply;

      return updated;
    });

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          🏥 Hospital AI Assistant
        </div>

        <div style={styles.messages}>
          {chat.map((c, i) => (
            <div key={i}>
              {c.user && (
                <div
                  style={
                    styles.userBubble
                  }
                >
                  {c.user}
                </div>
              )}

              {c.bot && (
                <div
                  style={
                    styles.botBubble
                  }
                >
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

        <div
          style={
            styles.inputContainer
          }
        >
          <input
            style={styles.input}
            value={message}
            placeholder="Type message..."
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage()
            }
          />

          <button
            style={styles.button}
            onClick={sendMessage}
          >
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
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "10px",
  },

  chatBox: {
    width: "100%",
    maxWidth: "700px",
    height: "95vh",
    backgroundColor: "white",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.1)",
  },

  header: {
    backgroundColor: "#0f766e",
    color: "white",
    padding: "16px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  userBubble: {
    backgroundColor: "#25D366",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    alignSelf: "flex-end",
    maxWidth: "85%",
    marginLeft: "auto",
    whiteSpace: "pre-line",
  },

  botBubble: {
    backgroundColor: "#e5e7eb",
    color: "#111",
    padding: "12px",
    borderRadius: "12px",
    maxWidth: "85%",
    whiteSpace: "pre-line",
  },

  typing: {
    color: "gray",
    fontStyle: "italic",
  },

  inputContainer: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  button: {
    backgroundColor: "#0f766e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "14px 20px",
    cursor: "pointer",
    fontSize: "16px",
  },
};