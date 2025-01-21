import API from "./API";

export const getCards = async (id) => {
  try {
    console.log(data);
    const response = await API.post(
      `http://localhost:8000/createur/deckCard/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'historique :", error.message);
    throw error;
  }
};


