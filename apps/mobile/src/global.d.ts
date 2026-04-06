// UniWind type augmentations — adds className to RN components.
// Once you run `expo start`, UniWind generates uniwind-types.d.ts with full types.
import "react-native";
import "react-native-reanimated";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
}
