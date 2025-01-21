import API from "./API";

export const AjoutLike = async (id_deck, id_createur) => {
    try {
      const response2 = await API.post(`/like/${id_deck}/${id_createur}`);
      
      return response2.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du like :", error.message);
      throw error;
    }
  };
  
  export const RecupererLike = async (id_deck, id_createur) => {
    try {
      const response = await API.get(`/like/${id_deck}/${id_createur}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du like :", error.message);
      throw error;
    }
  };
  
  export const DeleteLike = async (id_deck, id_createur) => {
    try{
      const response = await API.delete(`/like/delete/${id_deck}/${id_createur}`);
      return response.data;
    } catch(error) {
      console.error("Erreur lors de la suppression du like :", error.message);
      throw error;
    }
  }