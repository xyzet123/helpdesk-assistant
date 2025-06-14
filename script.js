// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD72YArWl0qg8habc2gAru75lkc4yVOEpI",
  authDomain: "helpdeskassitant.firebaseapp.com",
  projectId: "helpdeskassitant",
  storageBucket: "helpdeskassitant.firebasestorage.app"
  messagingSenderId: "17521809534",
  appId: "1:17521809534:web:0c33033dc6b8ee67b0a02f"
  measurementId: "G-SF8ZC22M1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
async function saveToHistory(ticketDesc, aiResponse, userEditedResponse, project) {
  try {
    const docRef = await setDoc(doc(db, "responses", Date.now().toString()), {
      ticketDescription: ticketDesc,
      aiResponse: aiResponse,
      response: userEditedResponse,
      project: project,
      timestamp: Date.now()
    });
    
    console.log("Document written with ID: ", docRef.id);
    showNotification('Response saved successfully!');
    
    // Clear the form
    ticketDescription.value = '';
    responseCard.style.display = 'none';
    responseEditor.value = '';
    
    // Update the history list
    await updateHistoryList();
  } catch (e) {
    console.error("Error adding document: ", e);
    showNotification('Error saving response. Please try again.', 'error');
  }
}

async function updateHistoryList() {
  try {
    const querySnapshot = await getDocs(query(collection(db, "responses"), orderBy("timestamp", "desc")));
    const history = [];
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by timestamp (newest first)
    history.sort((a, b) => b.timestamp - a.timestamp);
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
      historyList.innerHTML = '<p>No response history yet.</p>';
      return;
    }
    
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-item-header">
          <span class="history-item-project">${item.project}</span>
          <span class="history-item-date">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div class="form-group">
          <label>Ticket Description</label>
          <p>${item.ticketDescription}</p>
        </div>
        <div class="form-group">
          <label>Response</label>
          <p>${item.response}</p>
        </div>
      `;
      historyList.appendChild(historyItem);
    });
  } catch (error) {
    console.error("Error fetching history: ", error);
    historyList.innerHTML = '<p>Error loading history. Please try again.</p>';
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

// --- Change this function ---
function generateResponse() {
    const ticketText = document.getElementById('ticketDescription').value.trim();
    const selectedProject = document.getElementById('projectSelection').value;
    
    if (!ticketText) {
        showNotification('Please enter a ticket description.', true);
        return;
    }
    
    // Show loading animation
    document.getElementById('loadingAnimation').classList.remove('hidden');
    document.getElementById('aiResponse').value = '';
    document.getElementById('userEditedResponse').value = '';
    
    // In a real app, this would call your backend API
    // For this demo, we'll call our Vercel function
    
    // Get the API key from the environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    fetch('https://helpdesk-assistant.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Use the API key from Vercel
        },
        body: JSON.stringify({ ticket: ticketText, project: selectedProject })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Hide loading animation
        document.getElementById('loadingAnimation').classList.add('hidden');
        
        // Display the AI response
        document.getElementById('aiResponse').value = data.response;
        document.getElementById('userEditedResponse').value = data.response;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loadingAnimation').classList.add('hidden');
        showNotification('Error generating response. Check console.', true);
    });
}
// --- End of Change ---

// Update the submitResponse function to send to your Vercel function too
function submitResponse() {
    const rawPrompt = document.getElementById('ticketDescription').value;
    const aiDraft = document.getElementById('aiResponse').value;
    const userEdit = document.getElementById('userEditedResponse').value;
    const selectedProject = document.getElementById('projectSelection').value;
    
    if (!rawPrompt || !aiDraft || !userEdit) {
        showNotification('Please complete all fields.', true);
        return;
    }
    
    // In a real app, this would send data to your backend
    // For this demo, we'll just store it in our local database
    const responseEntry = {
        rawPrompt,
        aiDraft,
        userEdit,
        project: selectedProject,
        timestamp: new Date().toISOString()
    };
    
    // Add to database (in memory, will reset when page reloads)
    responseDatabase.push(responseEntry);
    
    // Show success notification
    showNotification('Response submitted successfully!');
    
    // Clear form
    document.getElementById('ticketDescription').value = '';
    document.getElementById('aiResponse').value = '';
    document.getElementById('userEditedResponse').value = '';
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
