import API from "./API";

export const getAllDecks = async () => {
    try {
      console.log(data);
      const response = await API.post(
        `http://localhost:8000/getAllDeck`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'historique :", error.message);
      throw error;
    }
  };
  