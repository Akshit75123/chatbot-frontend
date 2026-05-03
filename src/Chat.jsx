import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from './api';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot } from 'lucide-react';

const Chat = ({ conversationId, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    chatApi.getHistory(conversationId).then(data => {
      if (data.messages) setMessages(data.messages);
    });
  }, [conversationId]);

  const formatContent = (content) => {
    if (typeof content !== 'string') return '';
    if (content.includes('textContent=')) {
      const match = content.match(/textContent=(.*?)(?:, metadata=|, toolCalls=|$)/);
      return match ? match[1] : content;
    }
    return content;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Capture the current state of messages to check if this is the first message
    const isFirstMessage = messages.length === 0;
    const userMsg = { role: 'user', content: input };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Store input before clearing
    setInput('');
    setLoading(true);

    try {
      const data = await chatApi.sendMessage(conversationId, currentInput);
      const aiMsg = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMsg]);

      // If this was the first message, trigger the refresh in App.js
      // to update the sidebar with the new topic from PostgreSQL
      if (isFirstMessage && onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Chat failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, i) => (
          <div key={i} className={`message-bubble ${msg.role}`}>
            {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
            <div className="markdown-content">
              <ReactMarkdown>{formatContent(msg.content)}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />

        {loading && <div className="loading">AI is thinking...</div>}
      </div>

      <div className="input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={loading}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;