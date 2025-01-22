import {View, StyleSheet, Text, Image} from "react-native";
import { couleurs } from "@/constants/Couleurs";
import { MOIS_DICTIONNAIRE } from "@/constants/CONST_TEMPOREL";
import {categoriesType} from "@/constants/categories";

// COMPOSANT ABONNEMENT
export function Abonnement({label, prix, date, image}){
    // Fonction qui formate la date correctement pour l'affichage (chaine de caractère)
    function formatDate(dateString) {
        const date = new Date(dateString); 
        const moisIndex = date.getMonth();
        const mois = MOIS_DICTIONNAIRE.find(item => Number(item.value) === moisIndex)?.label || "Mois inconnu";
        const dateFormatee = date.getDate() + " " + mois + " " + date.getFullYear();
        return dateFormatee;
    }
    
    return(
        <View style={styles.containerGlobal}>
            {/*Logo de l'abonnement */}
            <Image style={styles.imageAbonnement} source={{ uri: image }}/>
            {/*Informaiton sur l'abonnement*/}
            <View style={styles.containerInfosAbonnement}>
                <View style={styles.containerPrixLabel}>
                    <Text style={styles.textLabel}>{label}</Text>
                    <Text style={styles.textPrix}>{prix}€</Text>
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
    imageAbonnement: {
        width: 50,
        height: 50,
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    containerInfosAbonnement: {
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