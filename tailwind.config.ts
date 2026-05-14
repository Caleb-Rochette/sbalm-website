// Brand colors sourced from "Brand Foundation v1.0" document.
// Digital mode: Cream/Paper backgrounds ~50%, Navy ~30%, Stone ~10%, Orange ~7% (CTAs only), Gold ~2% (wordmark/badges only).
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Navy scale
          deepNavy:  "#050A12",  // body text (softer than pure black)
          navy:      "#0F1E32",  // primary — headers, footers, hero sections
          navyLight: "#1E3A5F",  // Steel Navy — section backgrounds
          slateNavy: "#3D5A80",  // secondary text, navy-on-navy hierarchy
          mist:      "#A8B8CC",  // borders, dividers, disabled
          fog:       "#E8EDF3",  // pale section backgrounds, hover surfaces

          // Orange scale — primary CTAs and key highlights (digital: ~7%)
          orange:    "#EB4100",  // SirBox Orange — CTAs, accents
          ember:     "#FF6420",  // hover state
          burnt:     "#C03000",  // pressed / active state
          peach:     "#FFE5D4",  // badges, callout backgrounds

          // Warm neutrals
          cream:     "#FAF7F2",  // default web background (never pure white)
          paper:     "#FFFFFF",  // elevated cards, content surfaces
          stoneLight:"#E8E4DE",  // subtle borders, dividers
          stone:     "#8A8580",  // secondary body text
          stoneDark: "#3D3935",  // long-form body text

          // Support — strict roles
          gold:      "#FABE0A",  // Squire Gold — wordmark / premium badges ONLY
          // Knight Red #C80F14 — mascot illustration only, not used in UI

          // Functional UI
          success:   "#0F8B4C",
          warning:   "#F5A623",
          error:     "#D93025",
          info:      "#2563EB",

          // Convenience aliases used across components
          dark:      "#050A12",  // alias for deepNavy
          gray:      "#8A8580",  // alias for stone
        },
      },
      fontFamily: {
        // Archivo Black/Bold for all display/heading copy
        heading: ["var(--font-archivo)", "Arial Black", "sans-serif"],
        // Inter for all body, UI, captions
        body:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
