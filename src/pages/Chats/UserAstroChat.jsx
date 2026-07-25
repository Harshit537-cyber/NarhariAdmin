import React, { useState } from "react";
import "./UserAstroChat.css";

// Mock Data for Chats
const initialChats = [
  {
    id: 1,
    name: "Rahul Sharma",
    zodiac: "Aries (मेष)",
    lastMessage: "Sir, my career graph is not stable...",
    time: "10:30 AM",
    unread: 2,
    online: true,
    avatar: "♈",
  },
  {
    id: 2,
    name: "Priyanka Patel",
    zodiac: "Virgo (कन्या)",
    lastMessage: "Thank you for the gemstone suggestion.",
    time: "Yesterday",
    unread: 0,
    online: false,
    avatar: "♍",
  },
  {
    id: 3,
    name: "Amit Verma",
    zodiac: "Leo (सिंह)",
    lastMessage: "When will my Sade Sati end?",
    time: "2 days ago",
    unread: 0,
    online: true,
    avatar: "♌",
  },
];

const mockConversations = {
  1: [
    { id: 1, sender: "user", text: "Pranam Pandit ji, please review my birth chart.", time: "10:15 AM" },
    { id: 2, sender: "astro", text: "Aadesh! Share your exact birth details (Time, Date, and Place).", time: "10:18 AM" },
    { id: 3, sender: "user", text: "Sir, my career graph is not stable. 12th April 1995, 08:45 AM, Delhi.", time: "10:30 AM" },
  ],
  2: [
    { id: 1, sender: "astro", text: "Wear Panna (Emerald) on Wednesday morning.", time: "Yesterday" },
    { id: 2, sender: "user", text: "Thank you for the gemstone suggestion.", time: "Yesterday" },
  ],
  3: [
    { id: 1, sender: "user", text: "When will my Sade Sati end?", time: "2 days ago" },
  ]
};

export default function UserAstroChat() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [conversations, setConversations] = useState(mockConversations);
  const [newMessage, setNewMessage] = useState("");

  const activeChat = initialChats.find((chat) => chat.id === activeChatId);
  const currentMessages = conversations[activeChatId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const updatedMessage = {
      id: Date.now(),
      sender: "astro", // Assuming logged-in entity is the Astrologer/Admin replying
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations({
      ...conversations,
      [activeChatId]: [...currentMessages, updatedMessage],
    });
    setNewMessage("");
  };

  return (
    <div className="astro-chat-container">
      {/* Sidebar: Chat List */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>User Consultations</h3>
          <span className="live-badge">Live</span>
        </div>
        
        <div className="chat-list">
          {initialChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <div className="chat-avatar-wrapper">
                <div className="chat-avatar">{chat.avatar}</div>
                {chat.online && <span className="online-indicator"></span>}
              </div>
              <div className="chat-info">
                <div className="chat-meta">
                  <span className="user-name">{chat.name}</span>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <span className="user-zodiac">{chat.zodiac}</span>
                <p className="last-message">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main-window">
        {activeChat ? (
          <>
            {/* Chat Window Header */}
            <div className="chat-window-header">
              <div className="header-user-details">
                <div className="chat-avatar">{activeChat.avatar}</div>
                <div>
                  <h4>{activeChat.name}</h4>
                  <p className="status-subtext">
                    {activeChat.online ? (
                      <span className="online-text">● Online | {activeChat.zodiac}</span>
                    ) : (
                      <span className="offline-text">Offline | {activeChat.zodiac}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Message History */}
            <div className="chat-messages-body">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${msg.sender === "astro" ? "sent" : "received"}`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your astrological advice here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="empty-chat-state">
            <p>Select a user to start the Astro consultation</p>
          </div>
        )}
      </div>
    </div>
  );
}