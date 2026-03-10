const API_URL = "http://127.0.0.1:8000";

const chatbotService = {
  async sendMessage(message: string) {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_message: message,
          historique: []
        })
      });

      if (!response.ok) {
        throw new Error("Erreur API");
      }

      return await response.json();

    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  }
};

export default chatbotService;