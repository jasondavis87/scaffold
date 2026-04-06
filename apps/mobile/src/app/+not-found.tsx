import { Link, Stack } from "expo-router";

import { Text, View } from "@/lib/react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="bg-background flex-1 items-center justify-center p-5">
        <Text className="text-foreground text-xl font-bold">This screen does not exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-primary">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
