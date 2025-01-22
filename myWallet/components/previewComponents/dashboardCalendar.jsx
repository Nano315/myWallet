import { Text, View, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native";
import { couleurs } from '@/constants/Couleurs';
import arrowUp from "@/assets/images/arrowUp.png";
import arrowDown from "@/assets/images/arrowDown.png";
import { database } from "@/constants/configFirebase";
import { ref, get } from "firebase/database";
import { useState, useEffect } from "react";
import { MOIS_DICTIONNAIRE, JOURS_DICTIONNAIRE } from "@/constants/CONST_TEMPOREL";

// CALENDRIER POUR VISUALISER LES ABONNEMENTS À VENIR
export function DashboardCalendar({ setVisibiliteModalNouvelAbonnement, setVisibiliteModalDeleteAbonnement, visbiliteModalNouvelAbonnement, visibiliteModalDeleteAbonnement }) {
    const [abonnements, setAbonnements] = useState([]);

    // Fonction qui génère le titre du dashboard (mois + année)
    function getTitreDashboard() {
        const date = new Date();
        const moisIndex = date.getMonth();
        const annee = date.getFullYear();
        const mois = MOIS_DICTIONNAIRE.find(item => Number(item.value) === moisIndex)?.label || "Mois inconnu";
        const chaine = mois.charAt(0).toUpperCase() + mois.slice(1).toLowerCase() + " " + annee;
        return chaine
    }

    // Fonction qui filtre les logo des abonnements à afficher en fonction du mois
    function filterAbonnementsCalendar() {
        const anciensAbonnements = abonnements; 
        const updatedAbonnements = [];
        for (const abonnement of anciensAbonnements) {
            const abonnementDate = new Date(abonnement.date);
            const moisAbonnement = abonnementDate.getMonth();
            const moisActuel = new Date().getMonth();
            const finMois = new Date(new Date().getFullYear(), Number(moisActuel) + 1, 0);
            if (abonnementDate <= finMois) {
                if (abonnement.recurrence === "mensuel") {
                    const tempDico = {
                        jour: abonnementDate.getDate(),
                        photoUri: abonnement.imageUrl
                    };
                    updatedAbonnements.push(tempDico);
                } else if (abonnement.recurrence === "annuel") {
                    if (moisAbonnement === Number(moisActuel)) {
                        const tempDico = {
                            jour: abonnementDate.getDate(),
                            photoUri: abonnement.imageUrl
                        };
                        updatedAbonnements.push(tempDico);
                    }
                }
            }
        }
        return updatedAbonnements;
    }

    // Fonction qui récupère les abonnements depuis firebase
    async function getAbonnementsFromFirebase() {
        const reference = ref(database, "abonnement");
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return [];
        }
    }

    // Garantie que les abonnements sont tjrs à jour en local
    useEffect(() => {
        async function fetchData() {
            const data = await getAbonnementsFromFirebase();
            setAbonnements(Object.values(data)); 
        }

        fetchData();
    }, [visbiliteModalNouvelAbonnement, visibiliteModalDeleteAbonnement]);

    // Fonction qui retourne un tableau formaté pour correspondre les chiffres avec les jours de la semaine
    // ajoute des cases vides avant et apres les chiffres pour garantir le décalage
    function calculerDecalage() {
        const date = new Date();
        const annee = date.getFullYear();
        const mois = date.getMonth();

        // Premier jour du mois
        const premierDuMois = new Date(annee, mois, 1);
        const difference = (7 + premierDuMois.getDay()) % 7;

        // Calcul du nombre de jours dans le mois
        const estBissextile = (annee % 4 === 0 && annee % 100 !== 0) || (annee % 400 === 0);
        const joursFevrier = estBissextile ? 29 : 28;
        const mois31 = [0, 2, 4, 6, 7, 9, 11];
        const mois30 = [3, 5, 8, 10];

        let nbJoursMois = 0;
        if (mois31.includes(mois)) {
            nbJoursMois = 31;
        } else if (mois30.includes(mois)) {
            nbJoursMois = 30;
        } else if (mois === 1) {
            nbJoursMois = joursFevrier;
        }

        const tab = [];
        let ligne = [];

        // Ajouter les jours du mois au tableau
        for (let i = 0; i < difference; i++) {
            ligne.push(""); 
        }

        for (let jour = 1; jour <= nbJoursMois; jour++) {
            ligne.push(jour);
            if (ligne.length === 7) {
                tab.push(ligne);
                ligne = [];
            }
        }

        // Compléter la dernière ligne si nécessaire (case vide à la fin du mois)
        if (ligne.length > 0) {
            while (ligne.length < 7) {
                ligne.push(""); 
            }
            tab.push(ligne);
        }

        console.log(tab);
        return tab;
    }

    const abonnementsFiltres = filterAbonnementsCalendar();

    return (
        <View style={styles.containerGeneral}>
            <View style={styles.containerChiffres}>
                {/*Titre du dashboard*/}
                <Text style={styles.textTitreTransactions}>{getTitreDashboard()}</Text>
                <View style={styles.calendarContainer}>
                    {/*Ligne avec les jours (lun mar mer jeu ven sam dim*/}
                    <View style={styles.containerLigneTitre}>
                        {
                            JOURS_DICTIONNAIRE.map((jour, index) => (
                                <View key={jour.value} style={styles.boxCalendar}>
                                    <Text style={styles.textJours}>{jour.label.slice(0, 3)}</Text>
                                </View>
                            ))
                        }
                    </View>
                    {/*Calendrier avec les chiffres alignés aux jours*/}
                    {   
                        calculerDecalage().map((ligne, index) => (
                            <View key={index} style={styles.containerLigneTitre}>
                                {ligne.map((jour, idx) =>
                                    // Ajoute le logo de l'abonnement en background si c'est le jour du prélèvement
                                    abonnementsFiltres.some(abonnement => abonnement.jour === jour) ? (
                                        <ImageBackground
                                            key={`${jour}-${idx}`}
                                            source={{ uri: abonnementsFiltres.find(abonnement => abonnement.jour === jour)?.photoUri }}
                                            style={[styles.buttonImgBackground, { overflow: "hidden" }]}
                                            imageStyle={{ borderRadius: 100 }}
                                            resizeMode="cover"
                                        >
                                            <Text style={[styles.textChiffre, {color: couleurs.white, fontFamily: "HelveticaBold"}]}>{jour}</Text>
                                        </ImageBackground>
                                    ) : (
                                        <View key={`${jour}-${idx}`} style={styles.boxCalendar}>
                                            <Text style={styles.textChiffre}>{jour}</Text>
                                        </View>
                                    )
                                )}
                            </View>
                        ))
                    }
                </View>
            </View>
            <View style={styles.containerBoutons}>
                {/*Bouton supprimer abonnement*/}
                <TouchableOpacity style={[styles.bouton, { backgroundColor: couleurs.lightGreen }]} onPress={() => setVisibiliteModalDeleteAbonnement(true)}>
                    <Image source={arrowUp} style={styles.image} />
                    <Text style={[styles.textBouton, { color: couleurs.darkGreen }]}>Supprimer</Text>
                </TouchableOpacity>
                {/*Bouton ajouter abonnement*/}
                <TouchableOpacity style={[styles.bouton, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalNouvelAbonnement(true)}>
                    <Image source={arrowDown} style={styles.image} />
                    <Text style={[styles.textBouton, { color: couleurs.lightGreen }]}>Ajouter</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    // Containers
    containerGeneral: {
        backgroundColor: couleurs.white,
        margin: 20,
        padding: 10,
        borderRadius: 10,
        // Ombre pour iOS
        shadowColor: couleurs.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        // Ombre pour Android
        elevation: 10,
    },
    bouton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        width: 140,
        height: 30,
        marginRight: 5,
    },
    containerBoutons: {
        display: "flex",
        flexDirection: "row",
        marginTop: 40
    },
    // textes
    textChiffres: {
        fontFamily: 'HelveticaBold',
        fontSize: 50,
        marginTop: -10,
        color: couleurs.black
    },
    textChiffresDessous: {
        color: couleurs.grey,
        marginTop: -15,
    },
    textPourcentage: {
        fontFamily: 'HelveticaRegular',
        fontSize: 14,
    },
    textBouton: {
        fontFamily: 'HelveticaRegular',
        fontSize: 14,
        marginLeft: -3,
        marginTop: 3
    },
    textJours: {
        fontSize: 14,
        fontFamily: "HelveticaBold",
        color: couleurs.black,
    },
    textChiffre: {
        fontSize: 14,
        fontFamily: "HelveticaRegular",
        color: couleurs.black,
    },
    // autres
    image: {
        width: 25,
        height: 25
    },
    textTitreTransactions: {
        fontFamily: "HelveticaBold",
        fontSize: 30,
    },
    containerLigneTitre: {
        display: "flex",
        flexDirection: "row",
        width: 280,
        justifyContent: "space-between"
    },
    calendarContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30
    },
    boxCalendar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30
    },
    buttonImgBackground: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30
    }
});