const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Document = require('../models/Document');
const AccessRequest = require('../models/AccessRequest');
const ActivityLog = require('../models/ActivityLog');

// Load environment variables
dotenv.config();

const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "patient",
  },
  {
    name: "Dr. Michael Chen",
    email: "dr.chen@hospital.com",
    role: "provider",
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "dr.rodriguez@clinic.com",
    role: "provider",
  },
];

const documents = [
  {
    fileName: "Blood_Test_Results_2026.pdf",
    uploadDate: "2026-02-20",
    size: "1.2 MB",
    type: "Lab Results",
  },
  {
    fileName: "MRI_Scan_Report.pdf",
    uploadDate: "2026-02-15",
    size: "4.8 MB",
    type: "Imaging",
  },
  {
    fileName: "Prescription_Feb2026.pdf",
    uploadDate: "2026-02-10",
    size: "0.3 MB",
    type: "Prescription",
  },
  {
    fileName: "Annual_Physical_Report.pdf",
    uploadDate: "2026-01-28",
    size: "2.1 MB",
    type: "General",
  },
];

const accessRequests = [
  {
    providerName: "Dr. Michael Chen",
    providerEmail: "dr.chen@hospital.com",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    status: "pending",
    requestDate: "2026-02-24",
  },
  {
    providerName: "Dr. Emily Rodriguez",
    providerEmail: "dr.rodriguez@clinic.com",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    status: "approved",
    requestDate: "2026-02-18",
  },
  {
    providerName: "Dr. James Wilson",
    providerEmail: "dr.wilson@medcenter.com",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    status: "denied",
    requestDate: "2026-02-12",
  },
];

const activityLogs = [
  {
    action: "Document Uploaded",
    details: "Blood_Test_Results_2026.pdf was uploaded",
    timestamp: "2026-02-20 14:32",
    type: "upload",
  },
  {
    action: "Access Approved",
    details: "Approved access for Dr. Emily Rodriguez",
    timestamp: "2026-02-19 09:15",
    type: "approval",
  },
  {
    action: "Access Requested",
    details: "Dr. Michael Chen requested document access",
    timestamp: "2026-02-18 16:45",
    type: "request",
  },
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteMany();
        await Document.deleteMany();
        await AccessRequest.deleteMany();
        await ActivityLog.deleteMany();

        await User.insertMany(users);
        await Document.insertMany(documents);
        await AccessRequest.insertMany(accessRequests);
        await ActivityLog.insertMany(activityLogs);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

importData();
