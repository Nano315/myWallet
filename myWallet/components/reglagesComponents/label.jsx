import { Text, StyleSheet, View } from 'react-native';
import { couleurs } from "@/constants/Couleurs";

export function Label({smiley, label}) {

    return (
        <View style={styles.containerLabel}>
            <View style={styles.containerCercleGris}>
                <Text style={styles.smileyText}>{smiley}</Text>
            </View>
            <Text style={styles.textLabel}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containerLabel: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 5,
    },
    containerCercleGris: {
        width: 50,
        height: 50,
        backgroundColor: couleurs.grey,
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    smileyText: {
        fontSize: 25
    },
    textLabel: {
        fontFamily: "HelveticaBold",
        fontSize: 18,
        marginLeft: 15
    }
});