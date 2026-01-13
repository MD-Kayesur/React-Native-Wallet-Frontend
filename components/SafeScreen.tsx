
// Fixed SafeScreen.tsx
import { COLORS } from "@/constants/colors";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScreenProps {
  children: React.ReactNode;
}

const SafeScreen = ({ children }: SafeScreenProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: COLORS.background,
      }}
    >
      {children} {/* Render children directly, not wrapped in Text */}
    </View>
  );
};

export default SafeScreen;








// //import liraries
// import { COLORS } from "@/constants/colors";
// import { View, Text } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface SafeScreenProps {
//   children: React.ReactNode | string | any;
// }

// const SafeScreen = ({ children }: SafeScreenProps) => {
//   console.log(children);
//   const insets = useSafeAreaInsets();
//   console.log(insets);
//   return (
//     <View
//       style={{
//         flex: 1, 
//         paddingTop: insets.top,
//         paddingBottom: insets.bottom,
//         paddingLeft: insets.left,
//         paddingRight: insets.right,
//         backgroundColor: COLORS.background,
//       }}
//     >
//       <Text style={{ flex: 1, }}>{children} </Text>
//     </View>
//   );
// };
// export default SafeScreen;
