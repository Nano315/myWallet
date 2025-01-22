import { Text, StyleSheet, View, TouchableOpacity, Image, Modal, TextInput, ScrollView } from 'react-native';
import { BlurView } from "expo-blur";
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import arrowUp from "@/assets/images/arrowUp.png";
import arrowDown from "@/assets/images/arrowDown.png";
import { couleurs } from "@/constants/Couleurs";
import { BudgetContext } from "@/scripts/budgetContext";
import { Label } from "@/components/reglagesComponents/label";
import { ModalAjoutLabel } from "@/components/modals/modalAjoutLabel";
import { ModalSuppressionLabel } from "@/components/modals/modalSuppressionLabel"

// ÉCRAN DE RÉGLAGES
export default function ReglagesScreen() {
    const [visibiliteModalObjectif, setVisibiliteModalObjectif] = useState(false);
    const [visibiliteModalAjoutLabel, setVisibiliteModalAjoutLabel] = useState(false);
    const [visibiliteModalSuppressionLabel, setVisibiliteModalSuppressionLabel] = useState(false);

    // Import du contexte
    const {
        budgetTotal,
        budgetMensuel,
        objectifMensuel,
        nomLabel,
        icon,
        labels,
        getBudgetTotal,
        getBudgetMensuel,
        getObjectifMensuel,
        getLabels,
        setLabels,
        pushBudgeTotal,
        pushBudgetMensuel,
        pushLabel,
        setBudgetTotal,
        setBudgetMensuel,
        setObjectifMensuel,
        setNomLabel,
        setIcon,
        pushObjectifMensuel,
        calculerBudgetMensuel,
        calculerBudgetTotal
    } = useContext(BudgetContext);

    // Gestion du changement d'objectif financier (-> maj firebase, et modification de la variable dans l'app)
    function handleChangementObjectif() {
        if (Number(objectifMensuel) !== 0) {
            pushObjectifMensuel();
            setBudgetMensuel(0);
            setVisibiliteModalObjectif(false);
        }
    }

    // Récupère les différents budgets et les mets à jour en local pour toujours avoir le bon
    useEffect(() => {
        async function fetchBudget() {
            const budgetRecup = await calculerBudgetTotal();
            const budgetMensuelRecup = await calculerBudgetMensuel();
            const objectifMensuelRecup = await getObjectifMensuel();
            setBudgetMensuel(budgetMensuelRecup);
            setBudgetTotal(budgetRecup);
            setObjectifMensuel(objectifMensuelRecup);
        }

        fetchBudget();
    }, [visibiliteModalObjectif, visibiliteModalAjoutLabel, visibiliteModalSuppressionLabel]);

    // Idem pour les labels
    useEffect(() => {
        async function fetchLabels() {
            try {
                const labelsRecup = await getLabels();
                const labelsArray = Object.values(labelsRecup); 
                setLabels(labelsArray);
            } catch (error) {
                console.error("Erreur lors de la récupération des labels :", error);
            }
        }
        fetchLabels();
    }, [visibiliteModalObjectif, visibiliteModalAjoutLabel, visibiliteModalSuppressionLabel]);


    // Vérifier dans le rendu si label est vide
    useEffect(() => {
        console.log("labels dans le rendu : ", labels);
    }, [labels]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.containerSafeAreaView}>
                {/*Formulaire objectif financier*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visibiliteModalObjectif}
                    onRequestClose={() => setVisibiliteModalObjectif(false)}
                >
                    <BlurView intensity={10} style={styles.modalOverlay}>
                        <View style={styles.containerModal}>
                            <Text style={styles.modalTitle}>Modifier l'objectif mensuel</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nouvel objectif"
                                keyboardType="numeric"
                                onChangeText={setObjectifMensuel}
                                value={objectifMensuel}
                            />
                            <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalObjectif(false)}>
                                <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: couleurs.lightGreen }]}
                                onPress={() => handleChangementObjectif()}
                            >
                                <Text style={[styles.buttonText, { color: couleurs.darkGreen }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </Modal>
                {/*Formulaire suppression label*/}
                <ModalSuppressionLabel 
                    visibiliteModalSuppressionLabel={visibiliteModalSuppressionLabel}
                    setVisibiliteModalSuppressionLabel={setVisibiliteModalSuppressionLabel}
                />
                {/*Formulaire ajout label*/}
                <ModalAjoutLabel
                    visibiliteModalAjoutLabel={visibiliteModalAjoutLabel}
                    setVisibiliteModalAjoutLabel={setVisibiliteModalAjoutLabel}
                    pushLabel={pushLabel}
                    nomLabel={nomLabel}
                    setNomLabel={setNomLabel}
                    icon={icon}
                    setIcon={setIcon}
                />
                <View style={styles.containerGlobalReglages}>
                    <View style={styles.containerTitre}>
                        <Text style={styles.textTitreTransactions}>Réglages</Text>
                    </View>
                </View>
                {/*Container objectif mensuel (chiffre et bouton de modification)*/}
                <View style={styles.containerObjectifGlobal}>
                    <View style={styles.containerObjectif}>
                        <Text style={styles.textObjectif}>objectif mensuel</Text>
                        <Text style={styles.bigTextObjectif}>{objectifMensuel}€</Text>
                    </View>
                    <TouchableOpacity style={[styles.bouton, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalObjectif(true)}>
                        <Image source={arrowDown} style={styles.image} />
                        <Text style={[styles.textBouton, { color: couleurs.lightGreen }]}>Modifier l'objectif</Text>
                    </TouchableOpacity>
                </View>
                {/*Container label (liste et boutons de modification)*/}
                <View style={styles.containerLabelsGeneral}>
                    <View style={styles.containerButtonLabel}>
                        <TouchableOpacity style={[styles.bouton, { backgroundColor: couleurs.darkGreen, marginTop: 6 }]} onPress={() => setVisibiliteModalSuppressionLabel(true)}>
                            <Image source={arrowDown} style={styles.image} />
                            <Text style={[styles.textBouton, { color: couleurs.lightGreen, marginLeft: 15 }]}>Supprimer label</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bouton, { backgroundColor: couleurs.lightGreen, marginTop: 6 }]} onPress={() => setVisibiliteModalAjoutLabel(true)}>
                            <Image source={arrowUp} style={styles.image} />
                            <Text style={[styles.textBouton, { color: couleurs.darkGreen, marginLeft: 15 }]}>Ajouter label</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.containerGeneral}>
                        <View style={styles.containerLabels}>
                            <ScrollView style={styles.containerScrollView}>
                                {Array.isArray(labels) && labels.map((label, index) => (
                                    <Label
                                        key={index}
                                        smiley={label.icon}
                                        label={label.nomLabel}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    containerGeneral: {
        backgroundColor: couleurs.white,
        padding: 10,
        borderRadius: 10,
        width: 208,
        marginTop: 5,
        // Ombre pour iOS
        shadowColor: couleurs.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Ombre pour Android
        elevation: 10,
    },
    containerLabels: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    containerModal: {
        width: "80%",
        padding: 20,
        backgroundColor: couleurs.white,
        borderRadius: 10,
        alignItems: "flex-start",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 28,
        fontFamily: "HelveticaBold",
        marginBottom: 20,
    },
    button: {
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontFamily: "HelveticaBold"
    },
    containerSafeAreaView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    containerGlobalReglages: {
        width: "80%",
    },
    textTitreTransactions: {
        fontFamily: "HelveticaBold",
        fontSize: 40,
    },
    containerTitre: {
        marginTop: 40
    },
    bouton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderRadius: 5,
        width: 85,
        height: 82,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: couleurs.grey,
        color: couleurs.black,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    textBouton: {
        fontFamily: 'HelveticaRegular',
        fontSize: 14,
        marginLeft: 20,
        marginTop: -15
    },
    image: {
        marginLeft: -10,
        marginTop: -12.5,
        width: 75,
        height: 75
    },
    textObjectif: {
        fontFamily: "HelveticaRegular",
        fontSize: 14,
        color: couleurs.darkGreen
    },
    bigTextObjectif: {
        fontFamily: "HelveticaBold",
        fontSize: 50,
        marginTop: -10,
        marginBottom: -10,
        color: couleurs.darkGreen
    },
    containerObjectif: {
        backgroundColor: couleurs.lightGreen,
        borderRadius: 5,
        padding: 15,
        width: 210,
    },
    containerObjectifGlobal: {
        display: "flex",
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 40
    },
    containerButtonLabel: {
        display: "flex",
        flexDirection: "column",
    },
    containerLabelsGeneral: {
        display: "flex",
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-between"
    },
    containerScrollView: {
        height: 160,
        marginTop: -5,
        marginBottom: -5
    }
});