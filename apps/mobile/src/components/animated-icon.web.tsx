import { useEffect, useState } from "react";

import { View } from "@/lib/react-native";

interface AnimatedIconProps {
  onComplete?: () => void;
}

export function AnimatedIcon({ onComplete }: AnimatedIconProps) {
  const [opacity, setOpacity] = useState(0.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 0.6 ? 1 : 0.6));
    }, 800);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#171717",
        opacity,
      }}
    />
  );
}
