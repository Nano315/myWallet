import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    View,
    Text,
    ImageBackground
} from "react-native";
import { couleurs } from "@/constants/Couleurs";
import { BlurView } from "expo-blur";
import { Dropdown } from 'react-native-element-dropdown';
import { database } from "@/constants/configFirebase";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { MOIS_DICTIONNAIRE } from "@/constants/CONST_TEMPOREL";
import * as ImagePicker from 'expo-image-picker';

// FORMULAIRE POUR AJOUTER UN ABONNEMENT
export function ModalNouvelAbonnement({ visibiliteModalNouvelAbonnement, setVisibiliteModalNouvelAbonnement }) {
    const [nomAbonnement, setNomAbonnement] = useState("");
    const [prixAbonnement, setPrixAbonnement] = useState("");
    const [recurrence, setRecurrence] = useState("");
    const [erreur, setErreur] = useState("blablablaest hgdfoqgf");
    const [image, setImage] = useState("");
    // Date
    const [jourDate, setJourDate] = useState("");
    const [moisDate, setMoisDate] = useState(null);
    const [anneeDate, setAnneeDate] = useState(null);

    const recurrenceLabel = [
        { label: "mensuel", value: "mensuel" },
        { label: "annuel", value: "annuel" }
    ];

    // Fonction qui génère une liste avec les années depuis 2010
    function genererTableauAnnee() {
        let tableau = [];
        for (let i = 2025; i > 2010; i--) {
            tableau.push({ label: i.toString(), value: i });
        }
        return tableau;
    }

    // Foncrion qui reset les valeurs des labels dans les variables locales
    function resetLabels() {
        setNomAbonnement("");
        setPrixAbonnement("");
        setRecurrence("");
        setJourDate("");
        setMoisDate(null);
        setAnneeDate(null);
        setImage("");
    }

    // Fonction qui vérifie si une date entrée est une date valide
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

    // Fonction qui upload le logo de l'abonnement sélectionnée dans la base de données firebase
    const uploadImageAsync = async (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const blob = await (await fetch(uri)).blob();
        const storage = getStorage();
        const imageRef = storageRef(storage, `images/${filename}`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    };

    // Fonction qui vérifie que les entrées de l'utilisateurs sont valides puis qui vient ajouter l'abonnement (firebase et maj des variables locales)
    async function validationEntreeArgent() {
        // Vérification des entrées de l'utilisateur
        if (image === "" || nomAbonnement === "" || prixAbonnement === "" || recurrence === "" || jourDate === "" || moisDate === null || anneeDate === null || checkDateExiste(jourDate, moisDate, anneeDate) === false) {
            if (checkDateExiste(jourDate, moisDate, anneeDate) === false) {
                setErreur("Oups, ta date semble un peu bizarre. Vérifie-la pour moi !");
            } else {
                setErreur("Hey, tu as oublié de remplir tous les champs ! Allez, un petit effort");
            }
            resetLabels();
            setVisibiliteModalNouvelAbonnement(true);
            return;
        } else {
            try {
                const nouvelID = Date.now();
                const transactionsRef = ref(database, "abonnement/" + nouvelID);
                const dateTransaction = new Date(anneeDate, moisDate, Number(jourDate));

                // Attendre l'upload de l'image et obtenir son URL
                let downloadURL = null;
                if (image) {
                    console.log("Uploading image...");
                    downloadURL = await uploadImageAsync(image);
                    console.log("Image uploaded successfully. URL:", downloadURL);
                }

                // Ajouter l'entrée dans Firebase avec l'URL de l'image
                await set(transactionsRef, {
                    label: nomAbonnement,
                    date: dateTransaction.toISOString(),
                    prix: prixAbonnement,
                    recurrence: recurrence,
                    imageUrl: downloadURL || null 
                });
                console.log("Abonnement ajouté avec succès dans Firebase !");

                // Réinitialisation des champs
                resetLabels();
                setVisibiliteModalNouvelAbonnement(false);
            } catch (error) {
                console.error("Erreur lors de l'ajout de l'abonnement :", error);
                setErreur("Une erreur s'est produite. Merci de réessayer !");
            }
        }
    }

    // Génération des composants pour le dropdown
    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>{item.label}</Text>
            </View>
        );
    };

    // Fonction pour sélectionner une image dans notre gallerie
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], 
            quality: 1,
        });

        console.log(result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
            console.log("Image URI sélectionnée :", uri); 
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibiliteModalNouvelAbonnement}
            onRequestClose={() => setVisibiliteModalNouvelAbonnement(false)}
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
                    <Text style={styles.modalTitle}>Ajouter un abonnement</Text>
                    {/*Input pour le nom de l'abonnement*/}
                    <TextInput
                        style={styles.input}
                        placeholder="Label"
                        onChangeText={setNomAbonnement}
                        value={nomAbonnement}
                    />
                    <View style={styles.containerInputDate}>
                        {/*Input pour le prix de l'abonnement*/}
                        <TextInput
                            style={[styles.input, { width: 135 }]}
                            placeholder="Montant"
                            keyboardType="numeric"
                            onChangeText={setPrixAbonnement}
                            value={prixAbonnement}
                        />
                        {/*Menu déroulant pour choisir la récurrence de l'abonnement*/}
                        <Dropdown
                            style={[styles.input, styles.dropdownContainerRecurrence]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={recurrenceLabel}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={"Récurrence"}
                            value={recurrence}
                            onChange={item => setRecurrence(item.value)}
                            renderItem={renderItem}
                            containerStyle={[styles.dropdownContainer, { width: 120 }]}
                            renderRightIcon={() => null}
                        />
                    </View>
                    {/*Container des inputs pour choisir la date de l'abonnement*/}
                    <View style={styles.containerInputDate}>
                        {/*Input pour choisir le jour de l'abonnement*/}
                        <TextInput
                            style={styles.inputJour}
                            placeholder="Jour"
                            keyboardType="numeric"
                            onChangeText={setJourDate}
                            value={jourDate}
                        />
                        {/*Menu déroulant pour choisir le mois de l'abonnement*/}
                        <Dropdown
                            style={[styles.input, styles.dropdownContainer]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={MOIS_DICTIONNAIRE}
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
                        {/*Menu déroulant pour choisir l'année de l'abonnement*/}
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
                    {/*Container pour choisir le logo de l'abonnement et affiche l'image sélectionnée en background si elle existe*/}
                    {image ? (
                        <>
                            <ImageBackground source={{ uri: image }} style={[styles.buttonImgBackground, { overflow: 'hidden' }]} imageStyle={{ borderRadius: 5 }} resizeMode="cover">
                                <Text style={[styles.buttonText, { color: couleurs.white }]}>Logo ajouté</Text>
                            </ImageBackground>
                        </>
                    ) : (
                        <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.grey }, { marginBottom: 30 }]} onPress={pickImage}>
                            <Text style={[styles.buttonText, { color: couleurs.black }]}>Ajouter un logo</Text>
                        </TouchableOpacity>
                    )}
                    {/*Bouton annuler*/}
                    <TouchableOpacity style={[styles.button, { backgroundColor: couleurs.darkGreen }]} onPress={() => {
                        setVisibiliteModalNouvelAbonnement(false);
                        resetLabels();
                    }}>
                        <Text style={[styles.buttonText, { color: couleurs.lightGreen }]}>Fermer</Text>
                    </TouchableOpacity>
                    {/*Bouton valider*/}
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
    buttonImgBackground: {
        width: "100%",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 30
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
    dropdownContainerRecurrence: {
        width: 120,
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
    },
    image: {
        width: 100,
        height: 100
    }
});
