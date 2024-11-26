import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  Picker,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { registerCreateur } from "../../components/Auth";

export function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom_createur: "",
    ad_email_createur: "",
    mdp_createur: "",
    passwordConfirm: "",
    genre: "homme",
  });
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {

    if (!formData.ad_email_createur || !formData.mdp_createur) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.mdp_createur !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formattedDate = dateNaissance.toISOString().split("T")[0];
      const data = {
        nom_createur: formData.nom_createur.trim(),
        ad_email_createur: formData.ad_email_createur.toLowerCase().trim(),
        mdp_createur: formData.mdp_createur,
        genre: formData.genre,
        ddn: formattedDate,
      };

      await registerCreateur(data);
      // router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
      console.error(err);
    } finally {

      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDateNaissance(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleWebDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setDateNaissance(selectedDate);
  };

  const renderDatePicker = () => {
    // Pour le web
    if (Platform.OS === "web") {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de naissance</Text>
          <TextInput
            type="date"
            style={styles.input}
            onChange={handleWebDateChange}
          />
        </View>
      );
    }

    // Pour iOS
    if (Platform.OS === "ios") {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de naissance</Text>
          <DateTimePicker
            value={dateNaissance}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>
      );
    }

    // Pour Android
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date de naissance</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(dateNaissance)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateNaissance}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Votre pseudo</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre pseudo"
            value={formData.nom_createur}
            onChangeText={(value) => handleInputChange("nom_createur", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.ad_email_createur}
            onChangeText={(value) => handleInputChange("ad_email_createur", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={formData.mdp_createur}
            onChangeText={(value) => handleInputChange("mdp_createur", value)}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            value={formData.passwordConfirm}
            onChangeText={(value) =>
              handleInputChange("passwordConfirm", value)
            }
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Genre</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.genre}
              style={styles.picker}
              onValueChange={(value) => handleInputChange("genre", value)}
            >
              <Picker.Item label="Homme" value="homme" />
              <Picker.Item label="Femme" value="femme" />
              <Picker.Item label="Autre" value="autre" />
            </Picker>
          </View>
        </View>

        {renderDatePicker()}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>
      </View>
      <Pressable style={styles.button} onPress={() => router.push("/page/Auth/userconnexion?page=connexion")}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Retour</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  datePicker: {
    width: "100%",
    marginTop: -10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "#ff4d4d",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
