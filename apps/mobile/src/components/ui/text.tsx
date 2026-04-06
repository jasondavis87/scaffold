import { Text as RNText, type TextProps as RNTextProps } from "react-native";

export interface TextProps extends RNTextProps {
  className?: string;
}

export function Text({ accessible = true, allowFontScaling = true, ...props }: TextProps) {
  return (
    <RNText
      accessible={accessible}
      accessibilityRole="text"
      allowFontScaling={allowFontScaling}
      {...props}
    />
  );
}
