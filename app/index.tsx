import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#000000", 
         
      }}
    >
      <Text style={{ textAlign: "center", color: "#ffffff" }}>Edit app/index.tsx to edit this screen sdfgsdfg <Link href="/about">About</Link> </Text>
      
    </View>
  );
}
