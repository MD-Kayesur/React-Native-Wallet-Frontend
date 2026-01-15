import { View, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/colors";
import { styles } from "@/assets/images/styles/create.styles";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};
export default PageLoader;