import { Text, View } from "@/lib/react-native";

export default function ExploreScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Text className="text-foreground text-2xl font-bold">Explore</Text>
      <Text className="text-muted-foreground mt-2">Discover something new</Text>
    </View>
  );
}
