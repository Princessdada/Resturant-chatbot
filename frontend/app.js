// Configuration
const API_URL = 'http://localhost:8000';

// State Management
let deviceId = null;
let isTyping = false;

// DOM Elements
const messagesArea = document.getElementById('messages-area');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const menuBtn = document.getElementById('menu-btn');
const menuModal = document.getElementById('menu-modal');
const closeMenuBtn = document.getElementById('close-menu-btn');
const menuGrid = document.getElementById('menu-grid');

// Initialize Application
function init() {
  // Get or create device ID
  deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
  }

  // Load initial message
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');

  if (paymentStatus === 'success') {
      addMessage("Payment successful! ✅\nYour order has been placed.", 'bot');
      window.history.replaceState({}, document.title, "/");
      // Still load welcome message after a short delay so they see the menu
      setTimeout(loadWelcomeMessage, 1500);
  } else if (paymentStatus === 'failed') {
      addMessage("Payment failed ❌\nPlease try again.", 'bot');
      window.history.replaceState({}, document.title, "/");
      setTimeout(loadWelcomeMessage, 1500);
  } else {
      loadWelcomeMessage();
  }

  // Event Listeners
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Restrict input to numbers only
  messageInput.addEventListener('input', (e) => {
    // Only allow digits
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  // Prevent non-numeric characters from being typed
  messageInput.addEventListener('keydown', (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
}

// Generate unique device ID
function generateDeviceId() {
  return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Load welcome message
async function loadWelcomeMessage() {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: deviceId,
        message: ''
      })
    });

    const data = await response.json();
    if (data.reply) {
      addMessage(data.reply, 'bot');
    }
  } catch (error) {
    console.error('Error loading welcome message:', error);
    addMessage('Welcome to our restaurant! 🍽️\n\nHow can I help you today?', 'bot');
  }
}

// Send message
async function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;

  // Add user message to chat
  addMessage(message, 'user');
  messageInput.value = '';

  // Show typing indicator
  showTyping();

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: deviceId,
        message: message
      })
    });

    const data = await response.json();
    
    // Simulate typing delay for better UX
    setTimeout(() => {
      hideTyping();
      if (data.reply) {
        addMessage(data.reply, 'bot');
      }
    }, 500);

  } catch (error) {
    console.error('Error sending message:', error);
    hideTyping();
    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
  }
}

// Add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  
  // Format message text (preserve line breaks)
  bubbleDiv.innerHTML = formatMessage(text);

  messageDiv.appendChild(bubbleDiv);
  messagesArea.appendChild(messageDiv);

  // Scroll to bottom
  scrollToBottom();
}

// Format message text
function formatMessage(text) {
  // Convert line breaks to <br>
  let formatted = text.replace(/\n/g, '<br>');
  
  // Detect and format numbered lists
  formatted = formatted.replace(/(\d+\.\s)/g, '<br>$1');
  
  // Make bold text between asterisks
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return formatted;
}

// Show typing indicator
function showTyping() {
  isTyping = true;
  typingIndicator.classList.add('active');
  scrollToBottom();
}

// Hide typing indicator
function hideTyping() {
  isTyping = false;
  typingIndicator.classList.remove('active');
}

// Scroll to bottom of messages
function scrollToBottom() {
  setTimeout(() => {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }, 100);
}



// Add some visual feedback for button clicks
sendBtn.addEventListener('mousedown', () => {
  sendBtn.style.transform = 'scale(0.95)';
});

sendBtn.addEventListener('mouseup', () => {
  sendBtn.style.transform = 'scale(1)';
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


