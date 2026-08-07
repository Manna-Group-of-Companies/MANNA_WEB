import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next v16 ships native flat configs — no FlatCompat wrapper
 * (wrapping them throws "Converting circular structure to JSON").
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "node_modules/**",
      "out/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
