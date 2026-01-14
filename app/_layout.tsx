// app/_layout.tsx
import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}





// import { Stack } from "expo-router";
// import { ClerkProvider, tokenCache } from "@clerk/clerk-expo";
// import SafeScreen from "@/components/SafeScreen";

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <SafeScreen>
//         <Stack screenOptions={{ headerShown: false }} />
//       </SafeScreen>
//     </ClerkProvider>
//   );
// }

  
  
  
  
  
      