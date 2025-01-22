// Les petites couleurs de mon app
export const couleurs = {
    darkGreen: "#002A00",
    lightGreen: "#71D561",
    white: "#FFFFFF",
    grey: "#F1F1F3",
    black: "#1A1A1A",
    lightRed: '#ED7437',
    darkRed: '#7E2C03'
} as const;

export type Couleurs = typeof couleurs;
