/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],

  // Keep things from wrapping aggressively
  printWidth: 200,

  // For HTML/Vue/etc., put the closing > on the last line if it wraps
  bracketSameLine: true,

  // Do NOT force one attribute per line
  singleAttributePerLine: false,

  // Be lenient about whitespace so Prettier is less eager to reflow
  htmlWhitespaceSensitivity: "ignore",
};
