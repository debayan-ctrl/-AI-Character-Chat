import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDoMLoPo2HfX2tpUl43HS2JFEE_-UOWWY0",
  authDomain: "ai-character-chat-86215.firebaseapp.com",
  projectId: "ai-character-chat-86215",
  storageBucket: "ai-character-chat-86215.firebasestorage.app",
  messagingSenderId: "194214171621",
  appId: "1:194214171621:web:d46f16ff87275d07b6d50c",
  measurementId: "G-PMP793647D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let selectedCharacter = null;
let characters = [];

fetch('characters.json')
  .then(res => res.json())
  .then(data => {
    characters = data;
    const container = document.getElementById('character-list');
    data.forEach(char => {
      const img = document.createElement('img');
      img.src = `avatars/${char.avatar}`;
      img.alt = char.name;
      img.onclick = () => selectCharacter(char);
      container.appendChild(img);
    });
  });

function selectCharacter(character) {
  selectedCharacter = character;
  document.getElementById('chat-window').innerHTML = `<b>Talking to ${character.name}</b><br><br>`;
}

window.sendMessage = async function () {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message || !selectedCharacter) return;

  const chatWindow = document.getElementById('chat-window');
  chatWindow.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

  const res = await fetch("https://ai-character-api.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, character: selectedCharacter.name })
  });
  const data = await res.json();
  const reply = data.reply;
  chatWindow.innerHTML += `<div><strong>${selectedCharacter.name}:</strong> ${reply}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    await addDoc(collection(db, "chats"), {
      character: selectedCharacter.name,
      user: message,
      reply: reply,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error saving to Firestore:", e);
  }

  input.value = '';
};