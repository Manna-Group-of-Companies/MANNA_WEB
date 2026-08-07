/**
 * TypeScript 6 requires a declaration for side-effect imports of non-TS files
 * (TS2882). Next.js' own types don't ship these.
 */
declare module "*.css";
declare module "*.scss";
declare module "*.svg";
