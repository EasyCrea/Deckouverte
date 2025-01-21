import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { registerCreateur } from "../../fetch/Auth";
import { Picker } from "@react-native-picker/picker";

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
      router.push("/page/Auth/userconnexion?page=connexion");
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

  const renderDatePicker = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de naissance</Text>
          <TextInput
            type="date"
            style={styles.input}
            onChange={(e) => setDateNaissance(new Date(e.target.value))}
          />
        </View>
      );
    }

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

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date de naissance</Text>
        <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>{formatDate(dateNaissance)}</Text>
        </Pressable>

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Inscription</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Votre pseudo</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre pseudo"
                placeholderTextColor="#666666"
                value={formData.nom_createur}
                onChangeText={(value) =>
                  handleInputChange("nom_createur", value)
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre email"
                placeholderTextColor="#666666"
                value={formData.ad_email_createur}
                onChangeText={(value) =>
                  handleInputChange("ad_email_createur", value)
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor="#666666"
                value={formData.mdp_createur}
                onChangeText={(value) =>
                  handleInputChange("mdp_createur", value)
                }
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#666666"
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

            <Pressable
              style={({ pressed }) => [
                styles.mainButton,
                loading && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.mainButtonText}>S'inscrire</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() =>
                router.push("/page/Auth/userconnexion?page=connexion")
              }
            >
              <Text style={{ color: "blue",  fontStyle: 'italic' }}>Se connecter</Text>
            </Pressable>

            <Pressable
            style={styles.button}
             onPress={() => router.push("/")}>
              <Text style={{ color: "blue",  fontStyle: 'italic' }}>Retour</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 30,
  },
  formSection: {
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    textAlign: "center",
    color: "#7C2EE0",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
    color: "#666666",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333333",
    paddingLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputText: {
    fontSize: 16,
    color: "#333333",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: "#FF4D4D",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: "#5B3ADD",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  button:{
    marginTop: 10,
    alignItems: 'center',
  }

});
