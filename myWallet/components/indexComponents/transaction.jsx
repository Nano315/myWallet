import {View, StyleSheet, Text} from "react-native";
import { couleurs } from "@/constants/Couleurs";
import { MOIS_DICTIONNAIRE } from "@/constants/CONST_TEMPOREL";
import { useState, useEffect } from "react";
import { get, ref } from "firebase/database";
import { database } from "@/constants/configFirebase";

// COMPOSANT TRANSACTION 
export function Transaction({icon, label, prix, date}){
    const [categoriesType, setCategoriesType] = useState([])

    // Fonction qui récupères les labels de la base de données
    async function getLabelsFromFirebase() {
        try {
            const reference = ref(database, "categories");
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return Object.entries(snapshot.val()).map(([key, value]) => ({
                    label: value.icon,
                    value: value.nomLabel
                }));
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return [];
        }
    }

    // Garde à jour les labels
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const data = await getLabelsFromFirebase();
            if (isMounted) {
                setCategoriesType(data);
            }
        }

        fetchData();

        return () => {
            isMounted = false; 
        };
    }, []);

    // Formate la date en string pour l'afficher correctement 
    function formatDate(dateString) {
        const date = new Date(dateString); 
        const moisIndex = date.getMonth();
        const mois = MOIS_DICTIONNAIRE.find(item => Number(item.value) === moisIndex)?.label || "Mois inconnu";
        const dateFormatee = date.getDate() + " " + mois + " " + date.getFullYear();
        return dateFormatee;
    }

    // Formate la categorie avec son icon
    function formatCategorie(categorie) {
        let label; 
        label = categorie 
            ? categoriesType.find(item => categorie === item.value)?.label || "❓" 
            : "rien";
        return label;
    }
    

    return(
        <View style={styles.containerGlobal}>
            {/*Container smiley (cercle plus smiley)*/}
            <View style={styles.containerSmileyCercleBlanc}>
                <Text style={styles.smileyText}>{formatCategorie(icon)}</Text>
            </View>
            {/*Informations sur la transaction*/}
            <View style={styles.containerInfoTransaction}>
                <View style={styles.containerPrixLabel}>
                    <Text style={styles.textLabel}>{label}</Text>
                    <Text style={[styles.textPrix, prix < 0 ? {color: couleurs.darkGreen} : {color: couleurs.lightGreen}]}>{prix}€</Text>
                </View>
                <Text style={styles.textDate}>{formatDate(date)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // container
    containerGlobal: {
        display: "flex",
        flexDirection: "row",
        paddingTop: 10
        //justifyContent: "flex-start"
    },
    containerSmileyCercleBlanc: {
        width: 50,
        height: 50,
        backgroundColor: couleurs.white,
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    containerInfoTransaction: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10
    },
    containerPrixLabel: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    // Titres
    smileyText: {
        fontSize: 25
    },
    textLabel: {
        fontFamily: "HelveticaBold",
        fontSize: 18,
        color: couleurs.black
    },
    textPrix: {
        fontFamily: "HelveticaBold",
        fontSize: 18,
        color: couleurs.black
    },
    textDate: {
        fontFamily: "HelveticaRegular",
        fontSize: 14,
        color: couleurs.black
    }
});