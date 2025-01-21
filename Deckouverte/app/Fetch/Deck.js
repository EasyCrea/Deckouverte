import API from "./API"; 

export const RecupererCartes = async (id, gameStarted) => {
    try {
      if (!gameStarted || !id) {
        throw new Error("Jeu non commencé ou identifiant invalide");
      }
  
      const response = await API.get(`/createur/deckCard/${id}`);
      const data = response.data;
  
      if (data.status === "success" && Array.isArray(data.cards)) {
        return data.cards;
      } else {
        console.error("Réponse API invalide :", data);
        throw new Error("Format de données des cartes invalide");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cartes :", error.message);
  
      if (error.response) {
        console.error("Erreur serveur :", error.response.data);
      } else if (error.request) {
        console.error("Erreur réseau :", error.request);
      }
  
      throw error;
    }
  };

  export const getAllDecks = async () => {
    try {
      const response = await API.get(
        `/getAllDeck`
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des decks:", error.message);
      throw error;
    }
  };

  export const getParticipants = async (id) => {
    try{
      const response = await API.get(
        `/createur/participants/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des decks:", error.message);
      throw error;
    }
    }