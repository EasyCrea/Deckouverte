import API from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const loginCreateur = async (email, password) => {
  try {
    const response = await API.post("/createurs/login", { email, password });
    if (response.data && response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
      return response.data;
    } else {
      throw new Error("Authentification échouée : réponse invalide.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    throw error;
  }
};

export const registerCreateur = async (data) => {
  try {
    const response = await API.post("/createurs/register", data);
    return response.data;
  } catch(error) {
    console.error("Erreur lors de l'inscription :", error.message);
    throw error;
  }
  
};

export const AjoutLike = async (id) => {
  try {
    const response = await API.patch(`/likeDeck/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du like :", error.message);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await API.get("/createurs/checkToken");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la validation du token :", error.message);
    throw error;
  }
};

export const logoutCreateur = async () => {
  await AsyncStorage.removeItem("token");
  const response = await API.get("/createurs/logout");
  return response.data;
};