import { Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { couleurs } from "@/constants/Couleurs";
import {DashboardCalendar} from "@/components/previewComponents/dashboardCalendar";
import {Abonnements} from "@/components/previewComponents/abonnements";
import { useState } from 'react';
import { ModalNouvelAbonnement } from "@/components/modals/modalNouvelAbonnement";
import { ModalDeleteAbonnement } from "@/components/modals/modalDeleteAbonnement";

// ÉCRAN ABONNEMENTS
export default function PreviewScreen() {
    const [visbiliteModalNouvelAbonnement, setVisibiliteModalNouvelAbonnement] = useState(false);
    const [visibiliteModalDeleteAbonnement, setVisibiliteModalDeleteAbonnement] = useState(false);
    return (
        <SafeAreaProvider style={styles.containerGeneral}>
            <SafeAreaView>
                {/*Formulaire pour ajouter un abonnement*/}
                <ModalNouvelAbonnement 
                    visibiliteModalNouvelAbonnement={visbiliteModalNouvelAbonnement}
                    setVisibiliteModalNouvelAbonnement={setVisibiliteModalNouvelAbonnement}
                />
                {/*Formulaire supprimer un abonnement*/}
                <ModalDeleteAbonnement
                    visibiliteModalDeleteAbonnement={visibiliteModalDeleteAbonnement}
                    setVisibiliteModalDeleteAbonnement={setVisibiliteModalDeleteAbonnement}
                />
                {/*Zone en haut de la page avec le calendrier de preview des abonnements*/}
                <DashboardCalendar
                    setVisibiliteModalNouvelAbonnement={setVisibiliteModalNouvelAbonnement}
                    setVisibiliteModalDeleteAbonnement={setVisibiliteModalDeleteAbonnement}
                    visbiliteModalNouvelAbonnement={visbiliteModalNouvelAbonnement}
                    visibiliteModalDeleteAbonnement={visibiliteModalDeleteAbonnement}
                />
                {/*Liste des abonnements sur le mois*/}
                <Abonnements
                    visbiliteModalNouvelAbonnement={visbiliteModalNouvelAbonnement}
                    visibiliteModalDeleteAbonnement={visibiliteModalDeleteAbonnement}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    containerGeneral: {
        backgroundColor: couleurs.grey,
        flex: 1,
    }
});
