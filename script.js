import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD72YArWl0qg8habc2gAru75lkc4yVOEpI",
  authDomain: "helpdeskassitant.firebaseapp.com",
  projectId: "helpdeskassitant",
  storageBucket: "helpdeskassitant.firebasestorage.app",
  messagingSenderId: "17521809534",
  appId: "1:17521809534:web:0c33033dc6b8ee67b0a02f",
  measurementId: "G-SF8ZC22M1B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// DOM Elements
const ticketDescription = document.getElementById('ticketDescription');
const projectSelection = document.getElementById('projectSelection');
const newProjectContainer = document.getElementById('newProjectContainer');
const newProjectName = document.getElementById('newProjectName');
const addProjectBtn = document.getElementById('addProjectBtn');
const generateBtn = document.getElementById('generateBtn');
const aiResponse = document.getElementById('aiResponse');
const userEditedResponse = document.getElementById('userEditedResponse');
const submitBtn = document.getElementById('submitBtn');
const loadingAnimation = document.getElementById('loadingAnimation');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

// Event Listeners
projectSelection.addEventListener('change', handleProjectSelection);
addProjectBtn.addEventListener('click', addNewProject);
generateBtn.addEventListener('click', generateResponse);
submitBtn.addEventListener('click', submitResponse);

// Project handling
function handleProjectSelection() {
  if (projectSelection.value === 'add-new') {
    newProjectContainer.style.display = 'flex';
    newProjectName.focus();
  } else {
    newProjectContainer.style.display = 'none';
  }
}

function addNewProject() {
  const projectName = newProjectName.value.trim();
  if (projectName) {
    const option = document.createElement('option');
    option.value = projectName;
    option.text = projectName;
    projectSelection.insertBefore(option, projectSelection.lastElementChild);
    projectSelection.value = projectName;
    newProjectContainer.style.display = 'none';
    newProjectName.value = '';
    showNotification(`Project "${projectName}" added successfully!`);
  } else {
    showNotification('Please enter a project name.', true);
  }
}

// AI Generation
function generateResponse() {
  const ticketText = ticketDescription.value.trim();
  const selectedProject = projectSelection.value;

  if (!ticketText) {
    showNotification('Please enter a ticket description.', true);
    return;
  }

  loadingAnimation.classList.remove('hidden');
  aiResponse.value = '';
  userEditedResponse.value = '';

  fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket: ticketText, project: selectedProject })
  })
    .then(res => res.json())
    .then(data => {
      aiResponse.value = data.response;
      userEditedResponse.value = data.response;
    })
    .catch(err => {
      console.error(err);
      showNotification('Error generating response.', true);
    })
    .finally(() => {
      loadingAnimation.classList.add('hidden');
    });
}

// Submit to Firestore
async function submitResponse() {
  const rawPrompt = ticketDescription.value.trim();
  const aiDraft = aiResponse.value.trim();
  const userEdit = userEditedResponse.value.trim();
  const project = projectSelection.value;

  if (!rawPrompt || !aiDraft || !userEdit) {
    showNotification('Please complete all fields.', true);
    return;
  }

  try {
    await addDoc(collection(db, 'responses'), {
      rawPrompt,
      aiDraft,
      userEdit,
      project,
      timestamp: new Date().toISOString()
    });

    showNotification('Response submitted successfully!');
    ticketDescription.value = '';
    aiResponse.value = '';
    userEditedResponse.value = '';
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    showNotification('Error saving response.', true);
  }
}

// Show Notification
function showNotification(message, isError = false) {
  notificationMessage.textContent = message;
  notification.classList.toggle('error', isError);
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
