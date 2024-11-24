import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        //onPress={() => router.push(`/page/Auth/userconnexion?page=connexion`)}
        onPress={() => router.push({
          pathname: "/page/Auth/userconnexion",
          params: { page: "connexion" }
        })}
        style={{
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white" }}>Connexion</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push({
          pathname: "/page/Auth/userconnexion",
          params: { page: "register" }
        })}
        style={{
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>Inscription</Text>
      </Pressable>

    </View>
  );
}
