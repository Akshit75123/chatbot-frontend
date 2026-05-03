const API_BASE = "http://localhost:8081/api/conversation";

export const chatApi = {
  // POST /{conversationId}
  sendMessage: async (id, text, provider = 'gemini', model = 'gemini-2.5-flash') => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Your controller takes @RequestBody String
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
  }
};