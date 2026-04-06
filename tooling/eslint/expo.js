/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-native",
              importNames: [
                "Text",
                "View",
                "ScrollView",
                "Pressable",
                "TouchableOpacity",
                "TextInput",
                "FlatList",
                "SectionList",
                "Image",
              ],
              message:
                'Import from "@/lib/react-native" or "@/components/ui/*" instead of directly from react-native.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/src/components/ui/**", "**/src/lib/react-native.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];
