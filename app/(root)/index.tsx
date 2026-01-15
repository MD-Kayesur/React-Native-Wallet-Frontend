import PageLoader from "@/components/PageLoader";
import { SignOutButton } from "@/components/SignOutButton";
import { COLORS } from "@/constants/colors";
import { useTransactions } from "@/hooks/useTransaction";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {"left"}

          <View style={styles.headerLeft}>
            <Image
              style={styles.headerLogo}
              resizeMode="contain"
              source={require("../../assets/images/styles/imagelogo")}
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {user?.emainAddress[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {"right"}
          <View style={styles.headerRight}>
            {" "}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              {" "}
              <Ionicons name="add" size={20} color="#FFF" />{" "}
              <Text style={styles.addButtonText}>Add</Text>{" "}
            </TouchableOpacity>{" "}
            <SignOutButton />{" "}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: COLORS.primary,
    marginVertical: 10,
  },
});
