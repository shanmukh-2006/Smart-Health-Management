const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

// Basic in-memory data store for "Offline Mode"
let mockDB = {
  users: [
    { id: "u1", name: "Sarah Johnson", email: "sarah.johnson@email.com", role: "patient" },
    { id: "u2", name: "Dr. Michael Chen", email: "dr.chen@hospital.com", role: "provider" }
  ],
  documents: [],
  requests: [],
  activity: []
};

// Load data from file on startup
const loadDB = () => {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      mockDB = JSON.parse(data);
      console.log('✅ Mock database loaded from db.json');
    } catch (err) {
      console.error('❌ Error loading db.json:', err.message);
    }
  }
};

const saveDB = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(mockDB, null, 2));
  } catch (err) {
    console.error('❌ Error saving db.json:', err.message);
  }
};

loadDB();

const getCollection = (name) => {
  return mockDB[name] || [];
};

const addToCollection = (name, item) => {
  const id = `${name.charAt(0)}${Date.now()}`;
  const newItem = { id, ...item, createdAt: new Date() };
  mockDB[name].push(newItem);
  saveDB();
  return newItem;
};

const updateInCollection = (name, id, updates) => {
  const index = mockDB[name].findIndex(item => item.id === id);
  if (index !== -1) {
    mockDB[name][index] = { ...mockDB[name][index], ...updates };
    saveDB();
    return mockDB[name][index];
  }
  return null;
};

module.exports = {
  getCollection,
  addToCollection,
  updateInCollection
};
