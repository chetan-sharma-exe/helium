import "./App.css";
import { FaArrowUp } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

function App() {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;

  const generateResponse = async () => {
    setMessage((messages) => [
      ...messages,
      {
        content: userInput,
        sender: "cl",
      },
    ]);
    setUserInput("");
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(userInput);
      setMessage((messages) => [
        ...messages,
        {
          content: response.response.text(),
          sender: "ai",
        },
      ]);
    } catch (error) {
      setMessage((messages) => [
        ...messages,
        {
          content: error,
          sender: "ai",
        },
      ]);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        background: "#222831",
      }}
    >
      <div
        style={{
          height: "10vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          style={{
            height: "40px",
            marginLeft: "3vw",
          }}
          src="/public/logo.png"
          alt="logo"
        />
      </div>
      <div className="chat_container">
        {message.length === 0 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "40px",
                fontWeight: "500",
                color: "#cfcfcf",
              }}
            >
              What can I help with?
            </p>
          </div>
        )}
        {message.map((message, idx) => (
          <div
            className={message.sender === "cl" ? "cl_res" : "ai_res"}
            key={idx}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div
        className="input_container"
        style={{
          width: "55%",
          height: "10%",
          display: "flex",
          position: "relative",
        }}
      >
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          type="text"
          placeholder="Message Helium"
          onKeyDown={(e) => {
            if (e.key === "Enter") generateResponse();
          }}
        />
        <button className="btn" onClick={generateResponse}>
          <FaArrowUp size={"20px"} />
        </button>
      </div>
    </div>
  );
}

export default App;
