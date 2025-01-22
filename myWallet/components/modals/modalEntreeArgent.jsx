import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    View,
    Text
} from "react-native";
import { couleurs } from "@/constants/Couleurs";
import { BlurView } from "expo-blur";
import { Dropdown } from 'react-native-element-dropdown';
import { database } from "@/constants/configFirebase";
import { useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";

// FORMULAIRE ENTRÉE D'ARGENT
export function ModalEntreeArgent({ visibiliteModalEntreeArgent, setVisibiliteModalEntreeArgent, getBudgetTotal, setBudgetTotal, pushBudgeTotal, getBudgetMensuel, setBudgetMensuel, pushBudgetMensuel, calculerBudgetMensuel, calculerBudgetTotal }) {
    const [labelEntreArgent, setLabelEntreArgent] = useState("");
    const [prixTransaction, setPrixTransaction] = useState("");
    const [categorie, setCategorie] = useState("");
    const [erreur, setErreur] = useState("blablablaest hgdfoqgf");
    // Date
    const [jourDate, setJourDate] = useState("");
    const [moisDate, setMoisDate] = useState(null);
    const [anneeDate, setAnneeDate] = useState(null);

    const [categorieTab, setCategorieTab] = useState([]);

    const mois = [
        { label: 'janvier', value: '0' },
        { label: 'fevrier', value: '1' },
        { label: 'mars', value: '2' },
        { label: 'avril', value: '3' },
        { label: 'mai', value: '4' },
        { label: 'juin', value: '5' },
        { label: 'juillet', value: '6' },
        { label: 'aout', value: '7' },
        { label: 'septembre', value: '8' },
        { label: 'octobre', value: '9' },
        { label: 'novembre', value: '10' },
        { label: 'decembre', value: '11' },
    ];

    // Focntion qui genere la liste des années depuis 2010
    function genererTableauAnnee() {
        let tableau = [];
        for (let i = 2025; i > 2010; i--) {
            tableau.push({ label: i.toString(), value: i });
        }
        return tableau;
    }

    // Fonction qui récupère les labels depuis firebase
    async function getLabelsFromFirebase() {
        try {
            const reference = ref(database, "categories");
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                console.log("\n\ntest labels : " + Object.entries(snapshot.val()).map(([key, value]) => ({
                    label: value.icon,
                    value: value.nomLabel
                })));
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

    // Garantie que les labels sont bien à jour au chargement du composant
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const data = await getLabelsFromFirebase();
            if (isMounted) {
                setCategorieTab(data);
            }
        }

        fetchData();

        return () => {
            isMounted = false; 
        };
    }, [visibiliteModalEntreeArgent]);

    // Reset les variables locales
    function resetLabels() {
        setLabelEntreArgent("");
        setPrixTransaction("");
        setCategorie("");
        setJourDate("");
        setMoisDate(null);
        setAnneeDate(null);
    }

    // Fonction qui vérifie qu'une date est bien une date valide
    function checkDateExiste(jour, mois, annee) {
        if (mois < 0 || mois > 11) return false;
        console.log("jour : " + jour + "mois : " + mois + "année : " + annee);
        let estUneDate = true;
        const estBissextile = (annee % 4 === 0 && annee % 100 !== 0) || (annee % 400 === 0);
        const joursFevrier = estBissextile ? 29 : 28;
        const mois31 = [0, 2, 4, 6, 7, 9, 11];
        const mois30 = [3, 5, 8, 10];
        mois = Number(mois);
        if (mois31.includes(mois)) {
            console.log("mois 31");
            if (jour < 1 || jour > 31) estUneDate = false;
        } else if (mois30.includes(mois)) {
            console.log("mois 30");
            if (jour < 1 || jour > 30) estUneDate = false;
        } else if (mois === 1) {
            console.log("mois fevrier");
            if (jour < 1 || jour > joursFevrier) estUneDate = false;
        } else {
            estUneDate = false;
        }
        console.log("date ? " + estUneDate);
        return estUneDate;
    }

    // Fonction qui vérifie que toutes les valeurs entrées par l'utilisateurs sont valide puis qui met à jour l'entrée d'argent dans firebase
    // puis les variables locales. La fonction met aussi à jour le budget total et le budget mensuel
    async function validationEntreeArgent() {
        const budgetTotalTemporaire = (await calculerBudgetTotal()) || 0;
        const budgetMensuelTemp = (await calculerBudgetMensuel()) || 0;
        // Vérifications des entrées de l'utilisateur
        if (labelEntreArgent === "" || prixTransaction === "" || categorie === "" || jourDate === "" || moisDate === null || anneeDate === null || checkDateExiste(jourDate, moisDate, anneeDate) === false) {
            if (checkDateExiste(jourDate, moisDate, anneeDate) === false) {
                setErreur("Oups, ta date semble un peu bizarre. Vérifie-la pour moi !");
            } else {
                setErreur("Hey, tu as oublié de remplir tous les champs ! Allez, un petit effort");
            }
            resetLabels();
            setVisibiliteModalEntreeArgent(true);
            return;
        } else {
            // Mise à jour de firebase
            const nouvelID = Date.now();
            const transactionsRef = ref(database, "transactions/" + nouvelID);
            const dateTransaction = new Date(anneeDate, moisDate, Number(jourDate));
            console.log(dateTransaction);
            console.log(dateTransaction.toDateString());
            set(transactionsRef, {
                label: labelEntreArgent,
                date: dateTransaction.toISOString(),
                prix: prixTransaction,
                categorie: categorie
            }).then(() => console.log("Entrée d'argent dans firebase")).catch((error) => console.error("Error écriture entree argent firebase:", error));
            // Mise à jour du budget total
            setBudgetTotal(budgetTotalTemporaire + Number(prixTransaction));
            pushBudgeTotal(budgetTotalTemporaire + Number(prixTransaction));
            // Mise à jour du buget mensuel
            const moisEnCours = new Date().getMonth();
            const anneeEnCours = new Date().getFullYear();
            if (Number(moisEnCours) === Number(moisDate) && Number(anneeDate) === Number(anneeEnCours)) {
                setBudgetMensuel(budgetMensuelTemp + Number(prixTransaction));
                pushBudgetMensuel(budgetMensuelTemp + Number(prixTransaction));
            }
            resetLabels();
            setVisibiliteModalEntreeArgent(false);
        }
    }

    // Composants pour le dropdown
    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibiliteModalEntreeArgent}
            onRequestClose={() => setVisibiliteModalEntreeArgent(false)}
        >
            {/*
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibiliteNotification}
                onRequestClose={() => setVisibiliteNotification(false)}
            >
                <View style={styles.notificationContainer}>
                <View style={styles.notification}>
                    <View style={styles.containerCroisTexte}>
                    <Text style={styles.notificationTitre}>
                        Erreur :
                    </Text>
                    <TouchableOpacity onPress={() => setVisibiliteNotification(false)}>
                        <Icon name="close" size={30} color="#ED7437" />
                    </TouchableOpacity>
                    </View>
                    <Text style={styles.notificationTexte}>{erreur}</Text>
                </View>
                </View>
            </Modal>
          */}
            <BlurView intensity={10} style={styles.modalOverlay}>
                <View style={styles.containerModal}>
                    <Text style={styles.modalTitle}>Ajouter une entrée d'argent</Text>
                    {/*Input pour le nom de l'entrée d'argent*/}
                    <TextInput
                        style={styles.input}
                        placeholder="Label"
                        onChangeText={setLabelEntreArgent}
                        value={labelEntreArgent}
                    />
                    <View style={styles.containerInputDate}>
                        {/*Input pour le montant de la transaction*/}
                        <TextInput
                            style={[styles.input, { width: 155 }]}
                            placeholder="Montant"
                            keyboardType="numeric"
                            onChangeText={setPrixTransaction}
                            value={prixTransaction}
                        />
                        {/*
                        <Dropdown
                            style={[styles.input, styles.dropdownContainerCategorie]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={categoriesType}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Catégorie"}
                            value={categorie}
                            onChange={item => setCategorie(item.value)}
                            renderItem={renderItem}
                            containerStyle={styles.dropdownContainer}
                            renderRightIcon={() => null}
                        />
                        */}
                        {/*Menu déroulant pour choisir une catégorie associée à la transaction*/}
                        <Dropdown
                            style={[styles.input, styles.dropdownContainerCategorie]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={categorieTab}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Catégorie"}
                            value={categorie}
                            onChange={item => setCategorie(item.value)}
                            renderItem={renderItem}
                            containerStyle={styles.dropdownContainer}
                            renderRightIcon={() => null}
                        />
                    </View>
                    {/* Container avec tous les input pour générer la date*/}
                    <View style={styles.containerInputDate}>
                        {/*Input du jour de la date*/}
                        <TextInput
                            style={styles.inputJour}
                            placeholder="Jour"
                            keyboardType="numeric"
                            onChangeText={setJourDate}
                            value={jourDate}
                        />
                        {/*Menu déroulant pour choisir le mois de la date de la transaction*/}
                        <Dropdown
                            style={[styles.input, styles.dropdownContainer]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={mois}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Mois"}
                            value={moisDate}
                            onChange={item => setMoisDate(item.value)}
                            renderItem={renderItem}
                            containerStyle={styles.dropdownContainer}
                            renderRightIcon={() => null}
                        />
                        {/*Menu déroulant pour choisir l'année de la date de la transaction*/}
                        <Dropdown
                            style={[styles.input, styles.dropdownContainerAnnee]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={genererTableauAnnee()} 
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Année"}
                            value={anneeDate} 
                            onChange={item => setAnneeDate(item.value)}
                            renderItem={renderItem}
                            containerStyle={[styles.dropdownContainer, { width: 80 }]}
                            renderRightIcon={() => null}
                        />
                    </View>
                    {/*Bouton pour annuler*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => {
                        setVisibiliteModalEntreeArgent(false);
                        resetLabels();
                    }}>
                        <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                    </TouchableOpacity>
                    {/*Bouton pour valider l'entrée d'argent*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.lightGreen }]} onPress={() => validationEntreeArgent()}>
                        <Text style={[styles.buttonText, { color: couleurs.darkGreen }]}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Couche semi-transparente
        justifyContent: "center",
        alignItems: "center",
    },
    containerModal: {
        width: "80%",
        padding: 20,
        backgroundColor: couleurs.white,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 28,
        fontFamily: "HelveticaBold",
        marginBottom: 20,
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
    inputJour: {
        width: 70,
        borderWidth: 1,
        borderColor: couleurs.grey,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
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
    // Dropdown
    dropdown: { // dropdown replié
        height: 30,
        width: 120,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: couleurs.grey,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    label: {
        position: 'absolute',
        backgroundColor: couleurs.grey,
        fontFamily: "HelveticaBold",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 10,
        fontSize: 14,
        borderRadius: 100
    },
    placeholderStyle: {
        fontSize: 14,
        color: "#CBCBCC",
    },
    selectedTextStyle: {
        fontSize: 14,
        color: couleurs.black,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    item: {
        padding: 10,
    },
    itemText: {
        fontSize: 14,
        fontFamily: 'HelveticaRegular',
        color: couleurs.black,
    },
    dropdownContainer: {
        width: 100,
        borderRadius: 5
    },
    dropdownContainerAnnee: {
        width: 80,
        borderRadius: 5
    },
    dropdownContainerCategorie: {
        width: 100,
        borderRadius: 5
    },
    // Containers
    containerInputDate: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    notificationContainer: {
        width: "100%",
        height: 130,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    notification: {
        width: "80%",
        height: 70,
        backgroundColor: couleurs.darkRed,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        padding: 10
    },
    containerCroisTexte: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    // Texte
    notificationTitre: {
        fontFamily: "HelveticaBold",
        fontSize: 20,
        color: couleurs.lightRed
    },
    notificationTexte: {
        fontFamily: "HelveticaRegular",
        fontSize: 14,
        color: couleurs.lightRed
    }
});