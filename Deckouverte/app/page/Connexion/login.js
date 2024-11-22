import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { loginCreateur } from "../../components/Auth";


export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginCreateur(email, password);
      asyncStorage.setItem("token", data.token);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          required
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Couleur de fond douce
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Couleur sombre pour le texte
    marginBottom: 20,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555', // Couleur discrète pour les labels
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc', // Bordure grise
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff', // Fond blanc pour le champ
    color: '#333', // Couleur du texte
  },
  error: {
    color: '#ff4d4d', // Rouge pour les erreurs
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF', // Bleu pour le bouton
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc', // Grisé pour le bouton désactivé
  },
  buttonText: {
    color: '#fff', // Texte blanc
    fontSize: 16,
    fontWeight: 'bold',
  },
});
