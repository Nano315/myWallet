import React, { useState, useEffect } from "react";
import { couleurs } from "@/constants/Couleurs";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { get, ref } from "firebase/database";
import { database } from "@/constants/configFirebase";
import { MOIS_DICTIONNAIRE } from "@/constants/CONST_TEMPOREL";
import { Abonnement } from "@/components/previewComponents/abonnement";

// COMPOSANTS QUI CONTIENT L'ENSEMBLE DES ABONNEMENTS DU MOIS SÉLECTIONNÉ
export function Abonnements({ visbiliteModalNouvelAbonnement, visibiliteModalDeleteAbonnement }) {
    const [abonnements, setAbonnements] = useState([]);
    const [moisSelectionne, setMoisSelectionne] = useState(moisEnCoursChiffre() || 0);
    const [abonnementsAffiches, setAbonnementsAffiches] = useState([]);

    // Fonction qui retourne le mois en cours en format string
    function moisEnCours() {
        const date = new Date();
        const moisIndex = date.getMonth();
        const moisEnCours = MOIS_DICTIONNAIRE.find((item) => Number(item.value) === moisIndex);
        return moisEnCours ? moisEnCours.label : null;
    }

    // Fonction qui retourne le mois en cours (chiffre)
    function moisEnCoursChiffre() {
        const date = new Date();
        const moisIndex = date.getMonth();
        return moisIndex;
    }   
    
    // Génère les composants pour le menu déroulant
    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    // Fonction qui calcule la date de la prochaine transaction d'un abonnement
    function getProchaineTransactionAbonnement(date, recurrence) {
        if (!date) {
            console.error("Date invalide :", date);
            return "Date invalide";
        }

        date = new Date(date);
        if (isNaN(date)) {
            console.error("Date non valide après conversion :", date);
            return "Date non valide";
        }

        const dateAjd = new Date();

        if (date < dateAjd) {
            if (recurrence === "journalier") {
                while (date < dateAjd) {
                    date.setDate(date.getDate() + 1);
                }
            } else if (recurrence === "mensuel") {
                while (date < dateAjd) {
                    date.setMonth(date.getMonth() + 1);
                }
            } else if (recurrence === "annuel") {
                while (date < dateAjd) {
                    date.setFullYear(date.getFullYear() + 1);
                }
            } else {
                return "Récurrence non prise en charge";
            }
        }

        console.log(
            "Date actuelle : " + dateAjd.toISOString() +
            " | Prochaine date : " + date.toISOString()
        );

        return date;
    }

    // Fonction qui filtre les abonnements à afficher en fonction de la date de prochaine transaction
    function filterAbonnementsCalendar() {
        const anciensAbonnements = abonnements; 
        const updatedAbonnements = [];
        for (const abonnement of anciensAbonnements) {
            const abonnementDate = new Date(abonnement.date);
            const moisAbonnement = abonnementDate.getMonth();
            const finMois = new Date(new Date().getFullYear(), Number(moisSelectionne) + 1, 0);
            if (abonnementDate <= finMois) {
                if (abonnement.recurrence === "mensuel") {
                    updatedAbonnements.push(abonnement);
                } else if (abonnement.recurrence === "annuel") {
                    if (moisAbonnement === Number(moisSelectionne)) {
                        updatedAbonnements.push(abonnement);
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

    // Fonction qui garantie que les abonnements sont toujoursà jours
    useEffect(() => {
        async function fetchData() {
            const data = await getAbonnementsFromFirebase();
            setAbonnements(Object.values(data)); 
        }

        fetchData();
    }, [visbiliteModalNouvelAbonnement, visibiliteModalDeleteAbonnement]);

    useEffect(() => {
        const filteredAbonnements = [...filterAbonnementsCalendar()].reverse();
        setAbonnementsAffiches(filteredAbonnements);
    }, [moisSelectionne, abonnements]); 
    

    return (
        <View style={styles.containerGeneral}>
            <View style={styles.containerTitre}>
                <Text style={styles.textTitreTransactions}>Abonnements</Text>
                {/*Menu pour sélectionner un mois*/}
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={MOIS_DICTIONNAIRE}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={moisEnCours()}
                    renderItem={renderItem}
                    containerStyle={styles.dropdownContainer}
                    onChange={item => setMoisSelectionne(item.value)}
                />
            </View>
            {/*Scrollview avec la liste des abonnements du mois choisi */}
            <ScrollView style={styles.containerScrollView}>
                {abonnementsAffiches.length > 0 ? (
                    abonnementsAffiches.map((abonnement, index) => (
                        <Abonnement
                            label={abonnement.label}
                            prix={abonnement.prix}
                            date={abonnement.date}
                            image={abonnement.imageUrl}
                        />
                    ))
                ) : (
                    <Text>Aucune transaction disponible</Text>
                )}
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    containerGeneral: {
        marginLeft: 20,
        marginRight: 20,
    },
    dropdown: {
        height: 30,
        width: 95,
        borderColor: couleurs.black,
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: couleurs.grey,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: "absolute",
        backgroundColor: couleurs.grey,
        fontFamily: "HelveticaBold",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 10,
        fontSize: 14,
        borderRadius: 100,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: couleurs.black,
    },
    itemText: {
        fontSize: 14,
        fontFamily: "HelveticaRegular",
        color: couleurs.black,
    },
    dropdownContainer: {
        backgroundColor: couleurs.grey,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: couleurs.black,
    },
    containerTitre: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textTitreTransactions: {
        fontFamily: "HelveticaBold",
        fontSize: 30,
    },
    containerScrollView: {
        height: 230
    }
});
