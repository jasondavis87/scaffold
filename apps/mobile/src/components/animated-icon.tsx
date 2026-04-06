import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AnimatedIconProps {
  onComplete?: () => void;
}

export function AnimatedIcon({ onComplete }: AnimatedIconProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.6);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0.8, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      ),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 800 }), withTiming(0.6, { duration: 800 })),
      -1,
      true,
    );

    rotation.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, opacity, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: "#171717",
        },
        animatedStyle,
      ]}
    />
  );
}
