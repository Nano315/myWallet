import React, { useState, useEffect } from "react";
import { couleurs } from "@/constants/Couleurs";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Transaction } from "@/components/indexComponents/transaction";
import { get, ref } from "firebase/database";
import { database } from "@/constants/configFirebase";

// COMPOSANT QUI AFFICHE L'ENSEMBLE DES TRANSACTIONS DU MOIS
export function Transactions({visibiliteModalEntreeArgent, visibiliteModalSortieArgent}) {
    const [transactions, setTransactions] = useState([]); 
    const [moisSelectionne, setMoisSelectionne] = useState(moisEnCoursChiffre());

    const mois = [
        { label: "janvier", value: "0" },
        { label: "fevrier", value: "1" },
        { label: "mars", value: "2" },
        { label: "avril", value: "3" },
        { label: "mai", value: "4" },
        { label: "juin", value: "5" },
        { label: "juillet", value: "6" },
        { label: "aout", value: "7" },
        { label: "septembre", value: "8" },
        { label: "octobre", value: "9" },
        { label: "novembre", value: "10" },
        { label: "decembre", value: "11" },
    ];

    // Filtre le tableau pour le garder que les transactions du mois sélectionné
    function filtrerTransactionsParMois(transactions) {
        const nouveauTableauTransactions = [];
        for (const transaction of transactions) {
            const date = new Date(transaction.date);
            if (date.getMonth() === Number(moisSelectionne)) {
                nouveauTableauTransactions.push(transaction);
            }
        }
        return nouveauTableauTransactions;
    }

    // Fonction pour récupérer les données de Firebase
    async function getTransactionsFromFirebase() {
        const reference = ref(database, "transactions");
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

    // Charger les transactions au montage du composant
    useEffect(() => {
        async function fetchData() {
            const data = await getTransactionsFromFirebase();
            setTransactions(Object.values(data)); 
        }

        fetchData();
    }, [visibiliteModalSortieArgent, visibiliteModalEntreeArgent]);

    // Fonction qui récupère le mois actuel en chaine de caractère
    function moisEnCours() {
        const date = new Date();
        const moisIndex = date.getMonth();
        const moisEnCours = mois.find((item) => Number(item.value) === moisIndex);
        return moisEnCours ? moisEnCours.label : null;
    }

    // Fonction qui récupère le mois actuel en chiffre
    function moisEnCoursChiffre() {
        const date = new Date();
        const moisIndex = date.getMonth();
        return moisIndex;
    }

    // Génère les composants visuels pour le dropdown
    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    const transactionsAffichees = filtrerTransactionsParMois(transactions);

    return (
        <View style={styles.containerGeneral}>
            <View style={styles.containerTitre}>
                <Text style={styles.textTitreTransactions}>Transactions</Text>
                {/*Dropdown pour sélectionner un mois à afficher*/}
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={mois}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={moisEnCours()}
                    renderItem={renderItem}
                    containerStyle={styles.dropdownContainer}
                    onChange={item => setMoisSelectionne(item.value)}
                />
            </View>
            {/*ScrollView avec toutes les transactions du mois*/}
            <ScrollView style={styles.containerScrollView}>
                {transactions.length > 0 ? (
                    transactionsAffichees.map((transaction, index) => (
                        <Transaction
                            key={index}
                            icon={transaction.categorie} 
                            label={transaction.label}
                            prix={transaction.prix}
                            date={transaction.date}
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
        width: 120,
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
        height: 350
    }
});
