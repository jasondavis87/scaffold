import { View as RNView, type ViewProps as RNViewProps } from "react-native";

export interface ViewProps extends RNViewProps {
  className?: string;
}

export function View({ accessible, ...props }: ViewProps) {
  return <RNView accessible={accessible} {...props} />;
}
