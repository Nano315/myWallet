import React, { createContext, useState } from "react";
import { database } from "@/constants/configFirebase";
import { ref, get, update, set } from "firebase/database";

export const BudgetContext = createContext();

export function BudgetProvider({ children }) {
    const [budgetTotal, setBudgetTotal] = useState(0);
    const [budgetMensuel, setBudgetMensuel] = useState(0);
    const [objectifMensuel, setObjectifMensuel] = useState(0);
    const [nomLabel, setNomLabel] = useState("");
    const [icon, setIcon] = useState("");
    const [labels, setLabels] = useState([]);

    async function fetchData() {
        const data = await getLabels();
        setTransactions(Object.values(data)); // Convertir l'objet en tableau
    }

    async function getBudgetTotal() {
        const reference = ref(database, "general/budgetTotal");
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return 0;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return 0;
        }
    }

    async function getBudgetMensuel() {
        const reference = ref(database, "general/budgetMensuel");
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return 0;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return 0;
        }
    }

    async function getObjectifMensuel() {
        const reference = ref(database, "general/objectifMensuel");
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return 0;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return 0;
        }
    }

    async function getLabels() {
        const reference = ref(database, "categories");
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                console.log(snapshot.val());
                console.log(Object.values(snapshot.val()));
                return Object.values(snapshot.val());
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                return [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return [];
        }
    }

    async function calculerBudgetMensuel() {
        const reference = ref(database, "transactions");
        let transactionsCalculBudgetMensuel = []; 
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                transactionsCalculBudgetMensuel = Object.values(snapshot.val());
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                transactionsCalculBudgetMensuel = [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            transactionsCalculBudgetMensuel = [];
        }
    
        let budgetMensuelTemporaire = 0; 
        const moisActuel = new Date().getMonth();
        for (let transaction of transactionsCalculBudgetMensuel) {
            const dateTransaction = new Date(transaction.date);
            if (dateTransaction.getMonth() === moisActuel) {
                budgetMensuelTemporaire += Number(transaction.prix); 
            }
        }
        return budgetMensuelTemporaire;
    }

    async function calculerBudgetTotal() {
        const reference = ref(database, "transactions");
        let transactionsCalculBudgetMensuel = []; 
        try {
            const snapshot = await get(reference);
            if (snapshot.exists()) {
                transactionsCalculBudgetMensuel = Object.values(snapshot.val());
            } else {
                console.log("Aucune donnée disponible pour ce chemin.");
                transactionsCalculBudgetMensuel = [];
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            transactionsCalculBudgetMensuel = [];
        }
    
        let bugetTotalTemporaire = 0; 
        for (let transaction of transactionsCalculBudgetMensuel) {
            bugetTotalTemporaire += Number(transaction.prix); 
        }
        console.log(bugetTotalTemporaire);
        return bugetTotalTemporaire;
    }

    function pushBudgeTotal(budgetApush) {
        const userRef = ref(database, "general");
        update(userRef, {
            budgetTotal: budgetApush,
        })
            .then(() => console.log("Push Firebase budget total réussi"))
            .catch((error) => console.error("Erreur lors de l'écriture des données :", error));
    }

    function pushBudgetMensuel(budgetApush) {
        const userRef = ref(database, "general");
        update(userRef, {
            budgetMensuel: budgetApush,
        })
            .then(() => console.log("Push Firebase budget mensuel réussi"))
            .catch((error) => console.error("Erreur lors de l'écriture des données :", error));
    }

    function pushObjectifMensuel() {
        const userRef = ref(database, "general");
        update(userRef, {
            objectifMensuel: objectifMensuel,
        })
            .then(() => console.log("Push Firebase objectif mensuel réussi"))
            .catch((error) => console.error("Erreur lors de l'écriture des données :", error));
    }

    function pushLabel() {
        const nouvelID = Date.now();
        const transactionsRef = ref(database, "categories/" + nouvelID);
        set(transactionsRef, {
            nomLabel: nomLabel,
            icon: icon,
        }).then(() => console.log("Entrée d'argent dans firebase")).catch((error) => console.error("Error écriture entree argent firebase:", error));
    }

    return (
        <BudgetContext.Provider
            value={{
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
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
}
