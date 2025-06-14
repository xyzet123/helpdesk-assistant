// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD72YArWl0qg8habc2gAru75lkc4yVOEpI",
  authDomain: "helpdeskassitant.firebaseapp.com",
  projectId: "helpdeskassitant",
  storageBucket: "helpdeskassitant.firebasestorage.app"
  messagingSenderId: "17521809534",
  appId: "1:17521809534:web:0c33033dc6b8ee67b0a02f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Update this function ---
async function submitResponse() {
    const rawPrompt = document.getElementById('ticketDescription').value;
    const aiDraft = document.getElementById('aiResponse').value;
    const userEdit = document.getElementById('userEditedResponse').value;
    const selectedProject = document.getElementById('projectSelection').value;
    
    if (!rawPrompt || !aiDraft || !userEdit) {
        showNotification('Please complete all fields.', true);
        return;
    }
    
    try {
        // Save to Firestore
        await addDoc(collection(db, 'responses'), {
            rawPrompt,
            aiDraft,
            userEdit,
            project: selectedProject,
            timestamp: new Date().toISOString()
        });
        
        // Show success notification
        showNotification('Response submitted successfully!');
        
        // Clear form
        document.getElementById('ticketDescription').value = '';
        document.getElementById('aiResponse').value = '';
        document.getElementById('userEditedResponse').value = '';
    } catch (e) {
        console.error('Error adding document: ', e);
        showNotification('Error saving response.', true);
    }
}
// --- End of Update ---

// Make sure to add the Firebase script tags to your index.html before </body>
// <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
// <script src="path/to/your/script.js"></script>

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

// Database to store responses (in a real app, this would be a server database)
let responseDatabase = [];

// Event Listeners
projectSelection.addEventListener('change', handleProjectSelection);
addProjectBtn.addEventListener('click', addNewProject);
generateBtn.addEventListener('click', generateResponse);
submitBtn.addEventListener('click', submitResponse);

// Functions
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
        // Add to dropdown
        const option = document.createElement('option');
        option.value = projectName;
        option.text = projectName;
        projectSelection.insertBefore(option, projectSelection.lastElementChild);
        
        // Select the new project
        projectSelection.value = projectName;
        
        // Hide the new project input
        newProjectContainer.style.display = 'none';
        newProjectName.value = '';
        
        showNotification(`Project "${projectName}" added successfully!`);
    } else {
        showNotification('Please enter a project name.', true);
    }
}

function generateResponse() {
    const ticketText = ticketDescription.value.trim();
    const selectedProject = projectSelection.value;
    
    if (!ticketText) {
        showNotification('Please enter a ticket description.', true);
        return;
    }
    
    // Show loading animation
    loadingAnimation.classList.remove('hidden');
    aiResponse.value = '';
    userEditedResponse.value = '';
    
    // In a real app, this would call your backend API
    // For this demo, we'll simulate an API call with a timeout
    setTimeout(() => {
        // Simulate AI response generation
        const aiDraft = generateAiDraft(ticketText, selectedProject);
        
        // Hide loading animation
        loadingAnimation.classList.add('hidden');
        
        // Display the AI response
        aiResponse.value = aiDraft;
        userEditedResponse.value = aiDraft;
    }, 2000);
}

function generateAiDraft(ticketText, project) {
    // This is a mock function to simulate AI response generation
    // In a real app, this would call your AI API
    
    // Generate a draft response based on the ticket and project
    let response = `Thank you for your ticket regarding ${project}.\n\n`;
    response += `I understand that you're experiencing: "${ticketText.substring(0, 100)}${ticketText.length > 100 ? '...' : ''}"\n\n`;
    response += `Our team is looking into this issue and will get back to you shortly.\n\n`;
    response += `Please check your email or this ticket for updates. If you have any urgent concerns, please reply to this message.\n\n`;
    response += `Best regards,\n${project} Support Team`;
    
    return response;
}


    const responseEntry = {
        rawPrompt,
        aiDraft,
        userEdit,
        project: selectedProject,
        timestamp: new Date().toISOString()
    };
    
    // Add to database
    responseDatabase.push(responseEntry);
    
    // Show success notification
    showNotification('Response submitted successfully!');
    
    // Clear form
    ticketDescription.value = '';
    aiResponse.value = '';
    userEditedResponse.value = '';
}

function showNotification(message, isError = false) {
    notificationMessage.textContent = message;
    notification.classList.toggle('error', isError);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set focus to the ticket description field
    ticketDescription.focus();
});
