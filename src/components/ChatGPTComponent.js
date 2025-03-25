import React, { useState, useEffect, useRef } from "react";
import axios from "axios";  // NOTE: HTTP 요청을 위한 axios

// NOTE: ChatGPT API와 연동된 채팅 컴포넌트
const ChatGPTComponent = () => {
  // NOTE: 사용자 입력값 관리
  const [inputText, setInputText] = useState("");

  // NOTE: 채팅 메시지 상태 관리
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);

  // NOTE: API 호출 중 로딩 여부
  const [loading, setLoading] = useState(false);

  // NOTE: 메시지 전송 시 자동 스크롤을 위한 ref
  const messageEndRef = useRef(null);

  // NOTE: 메시지가 업데이트 될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // NOTE: 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // NOTE: 메시지 전송 및 ChatGPT API 호출
  const sendMessage = async () => {
    if (!inputText) return;
    setLoading(true);

    // 사용자 입력 메시지 추가
    const newMessages = [...messages, { role: "user", content: inputText }];
    setMessages(newMessages);
    setInputText("");

    try {
      // NOTE: ChatGPT API 호출 
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // API 응답 메시지 추가
      const gptMessage = response.data.choices[0].message;
      setMessages([...newMessages, gptMessage]);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: 인라인 스타일 정의
  const styles = {
    container: { /* 전체 레이아웃 스타일 */
      backgroundColor: "#1e1e1e", // 어두운 배경
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      width: "90%",
      height: "60vh", // 화면 높이의 80%로 고정
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      margin: "0 auto",
      overflow: "hidden",
      color: "white",
    },
    messageList: { /* 메시지 리스트 영역 */
      flex: 1,
      overflowY: "auto", // 스크롤 가능
      padding: "10px",
      marginBottom: "10px",
    },
    messageContainer: {
      marginBottom: "10px",
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: "#0084ff",
      color: "white",
      padding: "10px",
      borderRadius: "12px 12px 0 12px",
      maxWidth: "80%",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      overflow: "hidden",
      whiteSpace: "pre-wrap",
    },
    assistantMessage: {
      alignSelf: "flex-start",
      backgroundColor: "#f1f0f0",
      color: "black",
      padding: "10px",
      borderRadius: "12px 12px 12px 0",
      maxWidth: "80%",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      overflow: "hidden",
      whiteSpace: "pre-wrap",
    },
    inputContainer: { /* 입력창 & 버튼 래퍼 */
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      backgroundColor: "#333",
      borderRadius: "8px",
    },
    input: { /* 텍스트 입력창 스타일 */
      width: "75%",
      padding: "10px",
      borderRadius: "20px",
      border: "1px solid #ccc",
      backgroundColor: "#444",
      color: "white",
    },
    sendButton: {
      backgroundColor: "#0084ff",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    sendButtonDisabled: {
      backgroundColor: "#aaa",
      cursor: "not-allowed",
    },
    loading: {
      color: "#888",
    },
  };

  return (
    <div style={styles.container}>
      {/* === 채팅 메시지 리스트 === */}
      <div style={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.messageContainer}>
            <div
              style={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage
              }
            >
              <strong>{msg.role === "user" ? "User" : "Assistant"}:</strong>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* === 로딩 표시 === */}
      {loading && <p style={styles.loading}>Loading...</p>}

      {/* === 입력창 + 전송 버튼 === */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={
            loading
              ? { ...styles.sendButton, ...styles.sendButtonDisabled }
              : styles.sendButton
          }
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatGPTComponent;
