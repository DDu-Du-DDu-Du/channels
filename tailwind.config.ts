const FONTS = require("./constants/fonts/fonts").default ?? require("./constants/fonts/fonts");
const { createTailwindColorTokens } = require("./constants/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./stories/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...createTailwindColorTokens({ themeName: "wireframe", mode: "light" }),
        "neutral-dark": createTailwindColorTokens({ themeName: "wireframe", mode: "dark" }).neutral,
        "role-dark": createTailwindColorTokens({ themeName: "wireframe", mode: "dark" }).role,
        "ui-dark": createTailwindColorTokens({ themeName: "wireframe", mode: "dark" }).ui,
        "domain-dark": createTailwindColorTokens({ themeName: "wireframe", mode: "dark" }).domain,
      },

      borderRadius: {
        radius5: "0.5rem",
        radius10: "1rem",
        radius15: "1.5rem",
        circle: "9999rem",
      },

      fontSize: {
        size10: "1rem",
        size11: "1.1rem",
        size12: "1.2rem",
        size13: "1.3rem",
        size14: "1.4rem",
        size15: "1.5rem",
        size16: "1.6rem",
        size17: "1.7rem",
        size18: "1.8rem",
        size20: "2rem",
      },

      fontFamily: {
        "spoqa-thin": FONTS.spoqaHansSans.thin,
        "spoqa-regular": FONTS.spoqaHansSans.regular,
        "spoqa-medium": FONTS.spoqaHansSans.medium,
        "spoqa-semiBold": FONTS.spoqaHansSans.semiBold,
        "spoqa-bold": FONTS.spoqaHansSans.bold,
      },

      boxShadow: {
        shadow_100: "0 0.8rem 2.4rem rgba(149, 157, 165, 0.2)",
        shadow_300: "",
        shadow_500: "0.3rem 0.3rem 2rem 0 rgba(0, 0, 0, 0.06)",
        shadow_700: "0 0.4rem 0.4rem 0 rgba(0, 0, 0, 0.25)",
        shadow_900: "",
        example_shadow: "0 0 1rem 0.1rem rgba(0,0,0,0.15)",
      },

      screens: {
        example_min: { min: "900px" },
        example_max: { max: "900px" },

        color_sheet_450: { max: "450px" },
        color_sheet_420: { max: "420px" },
        color_sheet_350: { max: "350px" },
      },

      zIndex: {
        timeline_dashed: "22",
        timeline_line: "23",
        timeline_icon: "24",

        header: "300",
        headerLink: "400",

        modal: "500",

        bottom_sheet: "500",

        toast: "600",

        spinner: "800",
        background: "900",
        background_content: "999",

        monthly_goal_overlay: "40",
        monthly_goal_textarea: "50",
      },

      gridTemplateColumns: {
        color8: "repeat(8, minmax(50px, 1fr))",
        color6: "repeat(6, minmax(50px, 1fr))",
        color5: "repeat(5, minmax(50px, 1fr))",
        color4: "repeat(4, minmax(50px, 1fr))",
      },
    },
  },
  plugins: [require("tailwindcss-animated"), require("tailwind-scrollbar-hide")],
};
