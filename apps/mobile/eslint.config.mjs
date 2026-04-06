import baseConfig from "@packages/eslint-config/base";
import expoConfig from "@packages/eslint-config/expo";
import reactConfig from "@packages/eslint-config/react";

export default [...baseConfig, ...reactConfig, ...expoConfig];
