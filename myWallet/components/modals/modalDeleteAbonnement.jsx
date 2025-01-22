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

// FORMULAIRE SUPPRIMER ABONNEMENT
export function ModalDeleteAbonnement({ visibiliteModalDeleteAbonnement, setVisibiliteModalDeleteAbonnement }) {
    const [abonnements, setAbonnements] = useState([]);
    const [abonnementSelectionne, setAbonnementSelectionne] = useState(null);
    const [erreur, setErreur] = useState("");

    // Fonction qui supprimer un abonnement à partir de sa key (dans firebase et dans les variables locales)
    async function supprimerAbonnement(key) {
        try {
            if (!key) {
                setErreur("Veuillez sélectionner un abonnement.");
                return;
            }
            const abonnementRef = ref(database, `abonnement/${key}`);
            await set(abonnementRef, null);
            setAbonnements(prev => prev.filter(ab => ab.key !== key));
            setVisibiliteModalDeleteAbonnement(false);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'abonnement :", error);
            setErreur("Une erreur s'est produite lors de la suppression.");
        }
    }

    // Récupère les abonnements depuis firebase
    async function getAbonnementsFromFirebase() {
        try {
            const reference = ref(database, "abonnement");
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return Object.entries(snapshot.val()).map(([key, value]) => ({
                    key,
                    label: value.label,
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

    // Garantie que les abonnements sont bien à jour au chargement du composant
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            const data = await getAbonnementsFromFirebase();
            if (isMounted) {
                setAbonnements(data);
            }
        }

        fetchData();

        return () => {
            isMounted = false; 
        };
    }, [visibiliteModalDeleteAbonnement]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibiliteModalDeleteAbonnement}
            onRequestClose={() => setVisibiliteModalDeleteAbonnement(false)}
        >
            <BlurView intensity={10} style={styles.modalOverlay}>
                <View style={styles.containerModal}>
                    <Text style={styles.modalTitle}>Supprimer un abonnement</Text>
                    {/*Dropdown avec la liste de tous les abonnements*/}
                    <Dropdown
                        style={styles.input}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={abonnements}
                        value={abonnementSelectionne}
                        onChange={item => setAbonnementSelectionne(item.value)}
                        labelField="label"
                        valueField="value"
                        placeholder="Choisissez un abonnement"
                        renderItem={item => (
                            <View style={styles.item}>
                                <Text style={styles.itemText}>{item.label}</Text>
                            </View>
                        )}
                        containerStyle={styles.dropdownContainer}
                    />
                    {erreur ? <Text style={styles.errorText}>{erreur}</Text> : null}
                    {/*Bouton annuler*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalDeleteAbonnement(false)}>
                        <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                    </TouchableOpacity>
                    {/*Formulaire valider*/}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: couleurs.lightGreen }]}
                        onPress={() => supprimerAbonnement(abonnementSelectionne)}
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
