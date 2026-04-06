import { forwardRef } from "react";
import { Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { cn } from "@/lib/utils";
import { Text } from "./text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const buttonVariants = cva("flex flex-row items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      outline: "border-border bg-background border",
      ghost: "",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3",
      lg: "h-12 px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-primary-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
  ({ className, textClassName, variant, size, children, ...props }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={animatedStyle}
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        {...props}
      >
        {typeof children === "string" ? (
          <Text className={cn(buttonTextVariants({ variant }), textClassName)}>{children}</Text>
        ) : (
          children
        )}
      </AnimatedPressable>
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
