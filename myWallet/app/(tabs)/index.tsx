import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { couleurs } from "@/constants/Couleurs";
import { DashboardChiffres } from "@/components/indexComponents/dashboardChiffres";
import { Transactions } from "@/components/indexComponents/transactions";
import { useState, useEffect } from "react";
import { ModalEntreeArgent } from "@/components/modals/modalEntreeArgent";
import { ModalSortieArgent } from "@/components/modals/modalSortieArgent";
import { BudgetContext } from "@/scripts/budgetContext";
import React, { useContext } from "react";

// ÉCRAN TRANSACTIONS
export default function HomeScreen() {
  const [visibiliteModalEntreeArgent, setVisibiliteModalEntreeArgent] = useState(false);
  const [visibiliteModalSortieArgent, setVisibiliteModalSortieArgent] = useState(false);

  // Import du context
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

  // Gestion des budgets (total, mensuel et objectif) pour qu'ils soient à jour quand on charge l'écran
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
  }, []);

  // recupere les labels pour que ce soit bien à jour
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
  }, []);

  useEffect(() => {
    console.log("labels dans le rendu : ", labels);
  }, [labels]);


  return (
    <SafeAreaProvider style={styles.containerGeneral}>
      <SafeAreaView>
        {/*Formulaire entrée argent*/}
        <ModalEntreeArgent
          visibiliteModalEntreeArgent={visibiliteModalEntreeArgent}
          setVisibiliteModalEntreeArgent={setVisibiliteModalEntreeArgent}
          getBudgetTotal={getBudgetTotal}
          setBudgetTotal={setBudgetTotal}
          pushBudgeTotal={pushBudgeTotal}
          getBudgetMensuel={getBudgetMensuel}
          setBudgetMensuel={setBudgetMensuel}
          pushBudgetMensuel={pushBudgetMensuel}
          calculerBudgetMensuel={calculerBudgetMensuel}
          calculerBudgetTotal={calculerBudgetTotal}
        />
        {/*Formulaire sortie d'argent*/}
        <ModalSortieArgent
          visibiliteModalSortieArgent={visibiliteModalSortieArgent}
          setVisibiliteModalSortieArgent={setVisibiliteModalSortieArgent}
          getBudgetTotal={getBudgetTotal}
          setBudgetTotal={setBudgetTotal}
          pushBudgeTotal={pushBudgeTotal}
          getBudgetMensuel={getBudgetMensuel}
          setBudgetMensuel={setBudgetMensuel}
          pushBudgetMensuel={pushBudgetMensuel}
          calculerBudgetMensuel={calculerBudgetMensuel}
          calculerBudgetTotal={calculerBudgetTotal}
        />
        {/*Écran blanc avec les chiffres et les boutons en haut*/}
        <DashboardChiffres
          setVisibiliteModalEntreeArgent={setVisibiliteModalEntreeArgent}
          setVisibiliteModalSortieArgent={setVisibiliteModalSortieArgent}
          budgetMensuel={Number(objectifMensuel) + Number(budgetMensuel)}
          bugdetTotal={budgetTotal}
        />
        {/*Ensemble de transactions effectuées sur le mois*/}
        <Transactions
          visibiliteModalEntreeArgent={visibiliteModalEntreeArgent}
          visibiliteModalSortieArgent={visibiliteModalSortieArgent}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  containerGeneral: {
    backgroundColor: couleurs.grey,
    flex: 1,
  }
});
