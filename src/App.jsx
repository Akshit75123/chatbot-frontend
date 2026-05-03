import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import { chatApi } from './api';
import { MessageSquare, Plus, Database } from 'lucide-react';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Fetch the list of IDs from your backend's /api/conversation/list
  const refreshList = async () => {
  try {
    const data = await chatApi.listConversations();
    // Assuming backend returns [{id: "...", topic: "..."}, ...]
    setConversations(data.conversations || []);
  } catch (error) {
    console.error("Failed to fetch conversations", error);
  }
};

  useEffect(() => {
    refreshList();
  }, []);

  const createNewChat = () => {
  const newId = `chat_${Date.now()}`;
  setActiveId(newId);
  // Add a new object with a placeholder topic immediately
  setConversations(prev => [{ id: newId, topic: 'New Chat' }, ...prev]);
};

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          <Plus size={18} /> New Chat
        </button>
        <div className="conv-list">
  {conversations.map(chat => (
    <div 
      key={chat.id} 
      className={`conv-item ${activeId === chat.id ? 'active' : ''}`}
      onClick={() => setActiveId(chat.id)}
    >
      <MessageSquare size={16} />
      {/* Display the human-readable topic here */}
      <span className="conv-topic">{chat.topic || "New Chat"}</span>
    </div>
  ))}
</div>
        <div className="sidebar-footer">
          <Database size={14} /> <span>Spring AI Backend</span>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        {activeId ? (
    <Chat 
      conversationId={activeId} 
      onMessageSent={refreshList} // Pass the refresh function here
    />
        ) : (
          <div className="empty-state">
            <h2>Welcome to Spring Chat</h2>
            <p>Select a conversation or start a new one to begin.</p>
            <button onClick={createNewChat}>Start Chat</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;