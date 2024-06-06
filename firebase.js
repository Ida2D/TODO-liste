// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getFirestore,
    doc,
    updateDoc, 
    deleteDoc,
    addDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBW48ZsLIVvQ4xstw2GIHHVkhPScDmucQ8",
    authDomain: "todoliste-ca079.firebaseapp.com",
    projectId: "todoliste-ca079",
    storageBucket: "todoliste-ca079.appspot.com",
    messagingSenderId: "529415035458",
    appId: "1:529415035458:web:d8d809e9eecd3323cdebdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const docRef = doc(db, "Todoitems", "1")
const docSnap = await getDoc(docRef)

if (docSnap.exists()) {
    console.log("Document data:", docSnap.data())
} else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!")
}

// En referanse til div'en der jeg vil dytte inn oppgavene:
const listeRef = document.getElementById("liste")

// const q = query(collection(db, "Todoitems"), where("erFerdig", "==", false))
// const querySnapshot = await getDocs(q)
const querySnapshot = await getDocs(collection(db, "Todoitems"))
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data())
    // Legger til alle oppgavene i lista vår:
    const listePunkt = document.createElement("p")
    listePunkt.innerHTML = doc.data().tekst
    listePunkt.classList.add(doc.data().erFerdig ? "ferdig" : "todo")
    listePunkt.addEventListener("click", klikkPaaOppgave)

    //Lag x-en for å slette oppgave-----------------------------------------
    const xMerke = document.createElement("i")
    //Legg på klassene: fa-regular fa-circle-xmark
    xMerke.classList.add("fa-regular","fa-circle-xmark")
    xMerke.addEventListener("click", slettOppgave)

    const punkDiv = document.createElement("div")
    punkDiv.classList.add("punktDiv")
    punkDiv.dataset.id = doc.id
    punkDiv.appendChild(xMerke)
    punkDiv.appendChild(listePunkt)
    listeRef.appendChild(punkDiv)
})

async function slettOppgave(event) {
    const id =  event.target.parentElement.dataset.id
    // Slett fra vår lokale liste:
    listeRef.removeChild(event.target.parentElement)
    // Slett fra Google Firebase:
    await deleteDoc(doc(db, "Todoitems", id));
}

async function klikkPaaOppgave(event) {
    const elementKlikket = event.target
    console.log("klikkPaaOppgave")
    elementKlikket.classList.add("ferdig")
    const id = elementKlikket.parentElement.dataset.id
    //Oppdaterer elementet i databasen til firebase
    const docRef = doc(db, "Todoitems", id);
    await updateDoc(docRef, {
        erFerdig: true
    });

}



document.getElementById("knapp").addEventListener("click", leggTilNyOppgave)

async function leggTilNyOppgave() {
    console.log("leggTilNyOppgave")
    const oppgaveTekst = document.getElementById("oppgave").value
    console.log(oppgaveTekst)

    // Lagre ny oppgave i Google Firebase:
    const doc = await addDoc(collection(db, "Todoitems"), {
        tekst: oppgaveTekst,
        erFerdig: false
    });
    console.log("Document written with ID: ", doc.id);
    
    // Legger til alle oppgavene i lista vår:
    const listePunkt = document.createElement("p")
    listePunkt.innerHTML = oppgaveTekst
    listePunkt.addEventListener("click", klikkPaaOppgave)

    //Lag x-en for å slette oppgave-----------------------------------------
    const xMerke = document.createElement("i")
    //Legg på klassene: fa-regular fa-circle-xmark
    xMerke.classList.add("fa-regular","fa-circle-xmark")
    xMerke.addEventListener("click", slettOppgave)

    const punkDiv = document.createElement("div")
    punkDiv.classList.add("punktDiv")
    punkDiv.dataset.id = doc.id
    punkDiv.appendChild(xMerke)
    punkDiv.appendChild(listePunkt)
    listeRef.appendChild(punkDiv)

    // Tøm input feltet:
    document.getElementById("oppgave").value = ""
}
