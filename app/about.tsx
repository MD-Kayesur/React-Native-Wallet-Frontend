import { Text, View } from "react-native";


export default function About() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#000000", 
      }}
    >
      <Text style={{ textAlign: "center", color: "#ffffff" }}>About Screen</Text>
    </View>
  );
}