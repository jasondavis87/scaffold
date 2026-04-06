import { Text, View } from "@/lib/react-native";

export default function HomeScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Text className="text-foreground text-2xl font-bold">{"scaffold"}</Text>
      <Text className="text-muted-foreground mt-2">Welcome to your app</Text>
    </View>
  );
}
