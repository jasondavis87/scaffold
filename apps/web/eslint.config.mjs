import baseConfig from "@packages/eslint-config/base";
import nextjsConfig from "@packages/eslint-config/nextjs";
import reactConfig from "@packages/eslint-config/react";

export default [...baseConfig, ...reactConfig, ...nextjsConfig];
