import API from "./API";

export const AjoutHistorique = async (data) => {
  try {
    console.log(data);
    const response = await API.post("/creategamehistory", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'historique :", error.message);
    throw error;
  }
};

export const DeleteHistorique = async (id) => {
  try {
    const response = await API.delete(`/deletegamehistory/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'historique :",
      error.message
    );
    throw error;
  }
};
export const RecupererHistorique = async (id_createur, id_deck) => {
  try {
    const response = await API.get(`/gamehistory/${id_createur}/${id_deck}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique :",
      error.message
    );
    throw error;
  }
};