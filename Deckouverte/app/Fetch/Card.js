import API from "./API";

export const getCards = async (id) => {
  try {
    console.log(data);
    const response = await API.get(
      `/createur/deckCard/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'historique :", error.message);
    throw error;
  }
};


