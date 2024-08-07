// tailwind.confic.ts

import "@tailwindcss/aspect-ratio";
import "@tailwindcss/forms";
import "@tailwindcss/typography";
import "tailwindcss-animate";
import "tailwindcss-animated";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "#00AE98",
          light: "#33BFAE",
          dark: "#008F7A",
        },
        secondary: {
          DEFAULT: "#707070",
          light: "#8E8E8E",
          dark: "#5A5A5A",
        },
        backgroundone: {
          DEFAULT: "#1a1a1a",
          light: "#f8f9fa",
        },
        foregroundone: {
          DEFAULT: "#ffffff",
          light: "#212529",
        },
      },
      fontFamily: {
        sans: [ "Inter", "sans-serif" ],
      },
      keyframes: {
        "3d-rotate": {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(180deg)" },
        },
        "3d-bounce": {
          "0%, 100%": { transform: "translateZ(0)" },
          "50%": { transform: "translateZ(50px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "parallax": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-30px)" },
        },
        "rotate-in": {
          "0%": { transform: "rotate(-360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "zoom-in": {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1)" },
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "3d-rotate": "3d-rotate 5s infinite",
        "3d-bounce": "3d-bounce 3s infinite",
        "fade-in": "fade-in 2s ease-in-out",
        "slide-in": "slide-in 1s ease-out",
        "parallax": "parallax 10s infinite alternate",
        "rotate-in": "rotate-in 1s ease-in-out",
        "zoom-in": "zoom-in 0.5s ease-in-out",
        "pulse": "pulse 2s infinite",
        "bounce-in": "bounce-in 1s ease-in-out",
      },
      boxShadow: {
        customLight: "0 4px 6px rgba(0, 0, 0, 0.1)",
        customDark: "0 4px 6px rgba(0, 0, 0, 0.4)",
        "3dLight": "10px 10px 30px rgba(0, 0, 0, 0.1)",
        "3dDark": "10px 10px 30px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(0, 174, 152, 0.5)",
        neon:
          "0 0 10px rgba(0, 174, 152, 0.5), 0 0 20px rgba(0, 174, 152, 0.3), 0 0 30px rgba(0, 174, 152, 0.2)",
      },
      backgroundImage: {
        gradientRadial: "radial-gradient(var(--tw-gradient-stops))",
        gradientConic: "conic-gradient(var(--tw-gradient-stops))",
        gradientMulti: "linear-gradient(135deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
        gradientBorder: "linear-gradient(135deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
        gradientDiagonal: "linear-gradient(45deg, #00AE98, #33BFAE, #8E8E8E, #707070)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframesone: {
        accordionDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animationone: {
        accordionDown: "accordion-down 0.2s ease-out",
        accordionUp: "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default config;