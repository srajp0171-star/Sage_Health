// ═══════════════════════════════════════════════════════════════════
// DATA — All seed data for the Sage Healthcare Platform Demo
// ═══════════════════════════════════════════════════════════════════

export const AGENCY = {
  name: "Sage Tech Solutions",
  tagline: "Built for clinics. Owned by you. Forever.",
  email: "hello@sagetechsolutions.in",
  phone: "+91 98765 43210",
  website: "www.sagetechsolutions.in",
}

export const CLINIC = {
  name: "LifeCare Multi-Speciality Clinic",
  tagline: "Compassionate Care, Advanced Medicine",
  address: "14, MG Road, Indiranagar, Bengaluru – 560038",
  phone: "+91 80 4567 8900",
  email: "care@lifecareclinic.in",
  logo: "LC",
  established: "2018",
  gstin: "29AABCL1234F1Z5",
}

export const DEMO_TODAY = "2025-07-07"

export interface Doctor {
  id: string; name: string; speciality: string; fee: number; avatar: string; available: boolean; slots: string[];
}
export const DOCTORS: Doctor[] = [
  { id: "D001", name: "Dr. Arjun Mehta", speciality: "General Medicine", fee: 600, avatar: "AM", available: true, slots: ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00"] },
  { id: "D002", name: "Dr. Priya Sharma", speciality: "Gynaecology", fee: 800, avatar: "PS", available: true, slots: ["09:00","09:30","10:00","11:00","11:30","15:00","15:30","16:00"] },
  { id: "D003", name: "Dr. Kiran Rao", speciality: "Paediatrics", fee: 700, avatar: "KR", available: true, slots: ["10:00","10:30","11:00","14:00","14:30","15:00","15:30"] },
  { id: "D004", name: "Dr. Ananya Singh", speciality: "Dermatology", fee: 900, avatar: "AS", available: false, slots: ["09:30","10:00","10:30","11:30","14:00","16:00"] },
]

export interface Service {
  id: string; name: string; price: number; category: string;
}
export const SERVICES: Service[] = [
  { id: "S001", name: "OPD Consultation", price: 600, category: "Consultation" },
  { id: "S002", name: "Specialist Consultation", price: 800, category: "Consultation" },
  { id: "S003", name: "ECG", price: 400, category: "Diagnostics" },
  { id: "S004", name: "Blood Pressure Check", price: 150, category: "Diagnostics" },
  { id: "S005", name: "Dressing / Wound Care", price: 350, category: "Procedures" },
  { id: "S006", name: "Nebulisation", price: 250, category: "Procedures" },
  { id: "S007", name: "Suture Removal", price: 300, category: "Procedures" },
]

export interface Patient {
  id: string; name: string; age: number; gender: string; phone: string; email: string;
  blood: string; address: string; lastVisit: string; totalVisits: number; balance: number;
  allergies: string[]; conditions: string[];
}
export const INITIAL_PATIENTS: Patient[] = [
  { id: "P001", name: "Rahul Verma", age: 34, gender: "Male", phone: "9845123456", email: "rahul.v@email.com", blood: "B+", address: "12, HSR Layout, Bengaluru", lastVisit: "2025-06-10", totalVisits: 8, balance: 0, allergies: ["Penicillin"], conditions: ["Hypertension"] },
  { id: "P002", name: "Sunita Reddy", age: 28, gender: "Female", phone: "9741234567", email: "sunita.r@email.com", blood: "A+", address: "45, Koramangala, Bengaluru", lastVisit: "2025-06-25", totalVisits: 3, balance: 0, allergies: [], conditions: ["PCOS"] },
  { id: "P003", name: "Amir Khan", age: 52, gender: "Male", phone: "9632587410", email: "amir.k@email.com", blood: "O+", address: "7, Jayanagar, Bengaluru", lastVisit: "2025-07-01", totalVisits: 15, balance: 600, allergies: ["Aspirin", "Sulfa drugs"], conditions: ["Type 2 Diabetes", "Hypertension"] },
  { id: "P004", name: "Deepa Nair", age: 41, gender: "Female", phone: "8056234789", email: "deepa.n@email.com", blood: "AB-", address: "22, Whitefield, Bengaluru", lastVisit: "2025-07-03", totalVisits: 5, balance: 0, allergies: [], conditions: ["Thyroid"] },
  { id: "P005", name: "Lakshmi Iyer", age: 65, gender: "Female", phone: "9980123456", email: "lakshmi.i@email.com", blood: "B-", address: "3, Rajajinagar, Bengaluru", lastVisit: "2025-06-28", totalVisits: 22, balance: 0, allergies: ["NSAIDs"], conditions: ["Arthritis", "Hypertension", "Diabetes"] },
  { id: "P006", name: "Rohan Gupta", age: 8, gender: "Male", phone: "9876543210", email: "rohan.parent@email.com", blood: "O+", address: "18, Malleswaram, Bengaluru", lastVisit: "2025-07-04", totalVisits: 4, balance: 0, allergies: [], conditions: [] },
]

export interface Appointment {
  id: string; patientId: string; doctorId: string; date: string; time: string;
  status: string; type: string; fee: number; notes: string;
}
export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "A001", patientId: "P001", doctorId: "D001", date: "2025-07-07", time: "09:00", status: "Completed", type: "Follow-up", fee: 600, notes: "BP check, medication review" },
  { id: "A002", patientId: "P002", doctorId: "D002", date: "2025-07-07", time: "09:30", status: "In Queue", type: "Consultation", fee: 800, notes: "" },
  { id: "A003", patientId: "P003", doctorId: "D001", date: "2025-07-07", time: "10:00", status: "Waiting", type: "Follow-up", fee: 600, notes: "Diabetes management" },
  { id: "A004", patientId: "P004", doctorId: "D003", date: "2025-07-07", time: "10:30", status: "Waiting", type: "New Patient", fee: 700, notes: "" },
  { id: "A005", patientId: "P005", doctorId: "D001", date: "2025-07-07", time: "11:00", status: "Scheduled", type: "Follow-up", fee: 600, notes: "" },
  { id: "A006", patientId: "P006", doctorId: "D003", date: "2025-07-07", time: "14:00", status: "Scheduled", type: "Consultation", fee: 700, notes: "" },
  { id: "A007", patientId: "P001", doctorId: "D001", date: "2025-07-08", time: "10:00", status: "Scheduled", type: "Follow-up", fee: 600, notes: "" },
  { id: "A008", patientId: "P003", doctorId: "D002", date: "2025-07-09", time: "09:30", status: "Scheduled", type: "Consultation", fee: 800, notes: "" },
]

export interface InvoiceItem { name: string; qty: number; rate: number; }
export interface Invoice {
  id: string; patientId: string; appointmentId: string | null; date: string;
  items: InvoiceItem[]; subtotal: number; gst: number; total: number;
  paid: number; status: string; method: string;
}
export const INITIAL_INVOICES: Invoice[] = [
  { id: "INV-001", patientId: "P001", appointmentId: "A001", date: "2025-07-07", items: [{ name: "OPD Consultation", qty: 1, rate: 600 }], subtotal: 600, gst: 0, total: 600, paid: 600, status: "Paid", method: "UPI" },
  { id: "INV-002", patientId: "P003", appointmentId: null, date: "2025-07-01", items: [{ name: "Specialist Consultation", qty: 1, rate: 800 }, { name: "ECG", qty: 1, rate: 400 }], subtotal: 1200, gst: 0, total: 1200, paid: 600, status: "Partial", method: "Cash" },
  { id: "INV-003", patientId: "P005", appointmentId: null, date: "2025-06-28", items: [{ name: "OPD Consultation", qty: 1, rate: 600 }, { name: "Blood Pressure Check", qty: 1, rate: 150 }], subtotal: 750, gst: 0, total: 750, paid: 750, status: "Paid", method: "Card" },
]

export interface Medicine {
  name: string; dose: string; freq: string; duration: string; instructions: string;
}
export interface Prescription {
  id: string; patientId: string; doctorId: string; date: string; appointmentId: string | null;
  diagnosis: string; medicines: Medicine[]; advice: string; followUp: string;
  vitals: { bp: string; pulse: string; weight: string; spo2: string; };
}
export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX001", patientId: "P001", doctorId: "D001", date: "2025-07-07", appointmentId: "A001",
    diagnosis: "Hypertension – Controlled",
    medicines: [
      { name: "Amlodipine 5mg", dose: "1 tablet", freq: "Once daily", duration: "30 days", instructions: "After breakfast" },
      { name: "Telma 40mg", dose: "1 tablet", freq: "Once daily", duration: "30 days", instructions: "After dinner" },
    ],
    advice: "Low sodium diet. Avoid stress. Walk 30 min daily.",
    followUp: "2025-08-07",
    vitals: { bp: "128/82", pulse: "74", weight: "78kg", spo2: "98%" },
  },
  {
    id: "RX002", patientId: "P005", doctorId: "D001", date: "2025-06-28", appointmentId: null,
    diagnosis: "Arthritis – Moderate, Hypertension",
    medicines: [
      { name: "Methotrexate 10mg", dose: "1 tablet", freq: "Once weekly", duration: "4 weeks", instructions: "Saturday morning with food" },
      { name: "Folic Acid 5mg", dose: "1 tablet", freq: "Daily (except Sat)", duration: "4 weeks", instructions: "After meals" },
      { name: "Amlodipine 2.5mg", dose: "1 tablet", freq: "Once daily", duration: "30 days", instructions: "After breakfast" },
    ],
    advice: "Warm compress on joints. Gentle stretching. Avoid cold exposure.",
    followUp: "2025-07-28",
    vitals: { bp: "138/88", pulse: "80", weight: "62kg", spo2: "96%" },
  },
]

export interface LabResult { name: string; value: string; range: string; flag: string; }
export interface LabReport {
  id: string; patientId: string; doctorId: string; date: string;
  testName: string; lab: string; status: string; results: LabResult[];
}
export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: "LAB001", patientId: "P001", doctorId: "D001", date: "2025-07-05",
    testName: "Complete Blood Count (CBC)", lab: "Thyrocare", status: "Report Ready",
    results: [
      { name: "Haemoglobin", value: "14.2 g/dL", range: "13.5–17.5", flag: "Normal" },
      { name: "WBC Count", value: "8,200 /μL", range: "4,500–11,000", flag: "Normal" },
      { name: "Platelet Count", value: "2,45,000 /μL", range: "1,50,000–4,00,000", flag: "Normal" },
      { name: "RBC Count", value: "5.1 M/μL", range: "4.7–6.1", flag: "Normal" },
    ],
  },
  {
    id: "LAB002", patientId: "P003", doctorId: "D001", date: "2025-07-03",
    testName: "HbA1c + Fasting Blood Sugar", lab: "Metropolis", status: "Report Ready",
    results: [
      { name: "HbA1c", value: "7.8 %", range: "< 5.7% (Normal)", flag: "High" },
      { name: "Fasting Sugar", value: "148 mg/dL", range: "70–99", flag: "High" },
    ],
  },
]

export interface PharmacyItem {
  id: string; name: string; category: string; stock: number; unit: string;
  mrp: number; expiry: string; supplier: string; threshold: number;
}
export const INITIAL_PHARMACY: PharmacyItem[] = [
  { id: "MED001", name: "Amlodipine 5mg", category: "Cardiovascular", stock: 180, unit: "Tablet", mrp: 3.50, expiry: "2026-08", supplier: "Sun Pharma", threshold: 50 },
  { id: "MED002", name: "Telma 40mg", category: "Cardiovascular", stock: 95, unit: "Tablet", mrp: 8.20, expiry: "2026-06", supplier: "Glenmark", threshold: 30 },
  { id: "MED003", name: "Metformin 500mg", category: "Diabetes", stock: 220, unit: "Tablet", mrp: 2.10, expiry: "2026-12", supplier: "Cipla", threshold: 60 },
  { id: "MED004", name: "Paracetamol 500mg", category: "Analgesic", stock: 35, unit: "Tablet", mrp: 1.20, expiry: "2026-03", supplier: "Mankind", threshold: 100 },
  { id: "MED005", name: "Cetirizine 10mg", category: "Antihistamine", stock: 8, unit: "Tablet", mrp: 4.50, expiry: "2025-11", supplier: "Dr. Reddy's", threshold: 20 },
  { id: "MED006", name: "Azithromycin 500mg", category: "Antibiotic", stock: 60, unit: "Tablet", mrp: 22.00, expiry: "2026-09", supplier: "Cipla", threshold: 20 },
  { id: "MED007", name: "Methotrexate 10mg", category: "Immunosuppressant", stock: 24, unit: "Tablet", mrp: 45.00, expiry: "2025-12", supplier: "Neon Lab", threshold: 10 },
  { id: "MED008", name: "Folic Acid 5mg", category: "Vitamins", stock: 150, unit: "Tablet", mrp: 1.80, expiry: "2027-03", supplier: "Pfizer", threshold: 30 },
]

export const ANALYTICS = {
  monthlyOPD: [18, 22, 27, 31, 26, 35, 29, 38, 42, 36, 44, 48],
  monthlyRevenue: [10800, 13200, 16200, 18600, 15600, 21000, 17400, 22800, 25200, 21600, 26400, 28800],
  noShowRate: [22, 18, 25, 20, 15, 18, 12, 16, 14, 17, 11, 13],
  months: ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"],
  todayStats: { total: 24, completed: 1, inQueue: 1, waiting: 2, scheduled: 14, noShow: 0, revenue: 1200 },
  doctorPerformance: [
    { name: "Dr. Mehta", patients: 312, revenue: 187200, rating: 4.8 },
    { name: "Dr. Sharma", patients: 198, revenue: 158400, rating: 4.9 },
    { name: "Dr. Rao", patients: 176, revenue: 123200, rating: 4.7 },
    { name: "Dr. Singh", patients: 142, revenue: 127800, rating: 4.6 },
  ],
}

export interface Notification {
  id: string; type: string; message: string; time: string; read: boolean;
}
export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "N001", type: "appointment", message: "Rahul Verma has a follow-up tomorrow at 10:00 AM", time: "2 min ago", read: false },
  { id: "N002", type: "stock", message: "Low stock alert: Cetirizine 10mg (8 units remaining)", time: "15 min ago", read: false },
  { id: "N003", type: "payment", message: "Outstanding balance: Amir Khan – ₹600", time: "1 hr ago", read: false },
  { id: "N004", type: "lab", message: "Lab report ready: Rahul Verma – CBC", time: "2 hrs ago", read: true },
  { id: "N005", type: "appointment", message: "Appointment confirmed: Rohan Gupta – Dr. Rao, 2:00 PM", time: "3 hrs ago", read: true },
]

export interface ToastData {
  id: string; type: 'success' | 'error' | 'warning' | 'info'; msg: string;
}
