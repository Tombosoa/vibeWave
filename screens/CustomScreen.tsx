import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Text } from "react-native";
import { customScreenStyles } from "@/styles/style";

export const CustomScreen: React.FC<{ title: string; icon: string }> = ({
  title,
  icon,
}) => (
  <Animated.View entering={FadeIn} style={customScreenStyles.container}>
    <LinearGradient
      colors={["#1e3c72", "#2a5298"]}
      style={customScreenStyles.gradientContainer}
    >
      <MaterialIcons icon={icon} size={80} color="rgba(255,255,255,0.2)" />
      <Text style={customScreenStyles.text}>{title}</Text>
      <Text style={customScreenStyles.comingSoon}>Bientôt disponible</Text>
    </LinearGradient>
  </Animated.View>
);
