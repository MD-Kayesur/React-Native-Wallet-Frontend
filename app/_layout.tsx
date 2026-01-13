import { Stack } from "expo-router";
import { ClerkProvider, tokenCache } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeScreen>
    </ClerkProvider>
  );
}

  
  
  
  
  
      