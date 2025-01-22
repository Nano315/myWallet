import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    View,
    Text
} from "react-native";
import { couleurs } from "@/constants/Couleurs";
import { BlurView } from "expo-blur";
import { Dropdown } from "react-native-element-dropdown";
import { useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "@/constants/configFirebase";

// FORMULAIRE DE SUPPRESSION D'UN LABEL
export function ModalSuppressionLabel({ visibiliteModalSuppressionLabel, setVisibiliteModalSuppressionLabel }) {
    const [abonnements, setAbonnements] = useState([]);
    const [abonnementSelectionne, setAbonnementSelectionne] = useState(null);
    const [erreur, setErreur] = useState("");

    // Fonction qui supprime un label grâce à sa key (dans firebase et dans les variables locales)
    async function supprimerLabel(key) {
        try {
            if (!key) {
                setErreur("Veuillez sélectionner un abonnement.");
                return;
            }
            const abonnementRef = ref(database, `categories/${key}`);
            await set(abonnementRef, null); 
            setAbonnements(prev => prev.filter(ab => ab.key !== key)); 
            setVisibiliteModalSuppressionLabel(false);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'abonnement :", error);
            setErreur("Une erreur s'est produite lors de la suppression.");
        }
    }

    // Fonction qui récupère les labels depuis firebase
    async function getLabelsFromFirebase() {
        try {
            const reference = ref(database, "categories");
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return Object.entries(snapshot.val()).map(([key, value]) => ({
                    key,
                    label: value.nomLabel,
                    value: key
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

    // Garantie que les labels sont toujours à jour au lancement du composant
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const data = await getLabelsFromFirebase();
            if (isMounted) {
                setAbonnements(data);
            }
        }

        fetchData();

        return () => {
            isMounted = false; 
        };
    }, [visibiliteModalSuppressionLabel]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibiliteModalSuppressionLabel}
            onRequestClose={() => setVisibiliteModalSuppressionLabel(false)}
        >
            <BlurView intensity={10} style={styles.modalOverlay}>
                <View style={styles.containerModal}>
                    <Text style={styles.modalTitle}>Supprimer une catégorie</Text>
                    {/*Menu déroulant avec les labels*/}
                    <Dropdown
                        style={styles.input}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={abonnements}
                        value={abonnementSelectionne}
                        onChange={item => setAbonnementSelectionne(item.value)}
                        labelField="label"
                        valueField="value"
                        placeholder="Choisissez une catégorie"
                        renderItem={item => (
                            <View style={styles.item}>
                                <Text style={styles.itemText}>{item.label}</Text>
                            </View>
                        )}
                        containerStyle={styles.dropdownContainer}
                    />
                    {erreur ? <Text style={styles.errorText}>{erreur}</Text> : null}
                    {/*Bouton annuler*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalSuppressionLabel(false)}>
                        <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                    </TouchableOpacity>
                    {/*Bouton valider*/}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: couleurs.lightGreen }]}
                        onPress={() => supprimerLabel(abonnementSelectionne)}
                    >
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
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: couleurs.grey,
        color: couleurs.black,
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
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        color: "#CBCBCC",
    },
    selectedTextStyle: {
        fontSize: 14,
        color: couleurs.black,
    },
    item: {
        padding: 10,
    },
    itemText: {
        fontSize: 14,
        fontFamily: 'HelveticaRegular',
        color: couleurs.black,
    }
});
