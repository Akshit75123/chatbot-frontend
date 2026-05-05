const API_BASE = "https://springai-chatbot-backend.onrender.com/api/conversation";

export const chatApi = {
  // POST /{conversationId}
  sendMessage: async (id, text, provider = 'openai', model = 'gpt-5.4-mini') => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'AI-Provider': provider,
        'AI-Model': model
      },
      body: text
    });
    return response.json();
  },

  // GET /{conversationId}/history
  getHistory: async (id) => {
    const response = await fetch(`${API_BASE}/${id}/history`);
    return response.json();
  },

  // GET /list
  listConversations: async () => {
    const response = await fetch(`${API_BASE}/list`);
    return response.json();
  },

  // DELETE /{conversationId}
  deleteConversation: async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText}`);
    }
    
    // Depending on if your Spring Boot controller returns a body or just 204 No Content
    return response.status === 204 ? { success: true } : response.json();
  }
};