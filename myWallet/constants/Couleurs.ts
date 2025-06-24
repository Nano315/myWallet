// Les petites couleurs de mon app
export const couleurs = {
    darkGreen: "#15002A",
    lightGreen: "#8B61D5",
    white: "#FFFFFF",
    grey: "#F1F1F3",
    black: "#1A1A1A",
    lightRed: '#ED7437',
    darkRed: '#7E2C03',
    violetEquivalentIcon : "#9F65D9",
    violetSombreIcon : "#18042C"
} as const;

export type Couleurs = typeof couleurs;
