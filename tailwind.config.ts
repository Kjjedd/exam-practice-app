import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10243e",
        mist: "#f4f7fb",
        tide: "#d6e4f0",
        coral: "#ff7a59"
      }
    }
  },
  plugins: []
};

export default config;
