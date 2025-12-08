import eslintConfigNext from "eslint-config-next";

const eslintConfig = [
  ...eslintConfigNext,
  {
    ignores: ["node_modules/**"],
  },
];

export default eslintConfig;
