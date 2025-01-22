import { Text, StyleSheet, View, TouchableOpacity, Image, Modal, TextInput, ScrollView } from 'react-native';
import { BlurView } from "expo-blur";
import React from "react";
import { couleurs } from "@/constants/Couleurs";

// FORMULAIRE POUR AJOUTER UN LABEL
export function ModalAjoutLabel({visibiliteModalAjoutLabel, setVisibiliteModalAjoutLabel, pushLabel, nomLabel, setNomLabel, icon, setIcon}) {
    // Fonction qui gère l'ajout de l'abel (maj firebase et maj variables locales)
    function handleAjoutLabel() {
        if (nomLabel !== "" && icon !== "") {
            pushLabel();
            setNomLabel("");
            setIcon("");
            setVisibiliteModalAjoutLabel(false);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibiliteModalAjoutLabel}
            onRequestClose={() => setVisibiliteModalAjoutLabel(false)}
        >
            <BlurView intensity={10} style={styles.modalOverlay}>
                <View style={styles.containerModal}>
                    <Text style={styles.modalTitle}>Ajouter un label</Text>
                    <View style={styles.containerInputs}>
                        {/*Input nom du label*/}
                        <TextInput
                            style={[styles.input, { width: 190 }]}
                            placeholder="Nom label"
                            onChangeText={setNomLabel}
                            value={nomLabel}
                        />
                        {/*Input de l'icon du label*/}
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder="Icon"
                            onChangeText={setIcon}
                            value={icon}
                        />
                    </View>
                    {/*Bouton annuler*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => setVisibiliteModalAjoutLabel(false)}>
                        <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                    </TouchableOpacity>
                    {/*Formulaire valider*/}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: couleurs.lightGreen }]}
                        onPress={() => handleAjoutLabel()}
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
    containerInputs: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    }
});