import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import { chatApi } from './api';
// import { MessageSquare, Plus, Database } from 'lucide-react';
import { MessageSquare, Plus, Database, Trash2, Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  // Close sidebar after selecting a chat on mobile
  const handleSelectChat = (id) => {
    setActiveId(id);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDelete = async (e, id) => {
  e.stopPropagation(); // Prevents the chat from being selected when deleting
  
  if (!window.confirm("Are you sure you want to delete this chat?")) return;

  try {
    // 1. Call your API (Ensure this method exists in your chatApi)
    await chatApi.deleteConversation(id); 
    
    // 2. Update local state
    setConversations(prev => prev.filter(chat => chat.id !== id));
    
    // 3. If the deleted chat was the active one, clear the view
    if (activeId === id) {
      setActiveId(null);
    }
  } catch (error) {
    console.error("Failed to delete conversation", error);
  }
};

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
      {/* Mobile Header */}
      <header className="mobile-header">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="mobile-title">{activeId ? "Chat" : "Spring AI"}</div>
        <button onClick={createNewChat}>
          <Plus size={24} />
        </button>
      </header>

      {/* Sidebar with dynamic class */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <button className="new-chat-btn" onClick={createNewChat} style={{flex: 1}}>
            <Plus size={18} /> New Chat
          </button>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="conv-list">
          {conversations.map(chat => (
            <div 
              key={chat.id} 
              className={`conv-item ${activeId === chat.id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="conv-content">
                <MessageSquare size={16} />
                <span className="conv-topic">{chat.topic || "New Chat"}</span>
              </div>
              <button className="delete-btn" onClick={(e) => handleDelete(e, chat.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
</div>
        <div className="sidebar-footer">
          <Database size={14} /> <span>Spring AI Backend</span>
        </div>
      </aside>

      {/* Overlay for mobile to close sidebar when clicking outside */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

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