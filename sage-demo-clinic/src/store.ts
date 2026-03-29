import { createContext } from 'react'
import type { Patient, Appointment, Invoice, Prescription, LabReport, PharmacyItem, Notification, ToastData } from './data'
import {
  INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_INVOICES, INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS, INITIAL_PHARMACY, INITIAL_NOTIFICATIONS, DEMO_TODAY, SERVICES as SERVICES_DATA, DOCTORS as DOCTORS_DATA
} from './data'
import type { Service, Doctor } from './data'

export interface AppState {
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  pharmacy: PharmacyItem[];
  notifications: Notification[];
  services: Service[];
  doctors: Doctor[];
  toasts: ToastData[];
  currentUser: { role: string; name: string; doctorId: string | null };
  activeModule: string;
  selectedPatientId: string | null;
  todayDate: string;
  editMode: boolean;
  clinicName: string;
  clinicTagline: string;
  enabledModules: string[] | null;
}

const getInitialClinicName = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('clinic') || "LifeCare Multi-Speciality Clinic";
  }
  return "LifeCare Multi-Speciality Clinic";
};

const getInitialModules = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('modules');
    return m ? m.split(',') : null;
  }
  return null;
};

export const initialState: AppState = {
  patients: INITIAL_PATIENTS,
  appointments: INITIAL_APPOINTMENTS,
  invoices: INITIAL_INVOICES,
  prescriptions: INITIAL_PRESCRIPTIONS,
  labReports: INITIAL_LAB_REPORTS,
  pharmacy: INITIAL_PHARMACY,
  notifications: INITIAL_NOTIFICATIONS,
  services: SERVICES_DATA,
  doctors: DOCTORS_DATA,
  toasts: [],
  currentUser: { role: "admin", name: "Admin", doctorId: null },
  activeModule: "dashboard",
  selectedPatientId: null,
  todayDate: DEMO_TODAY,
  editMode: false,
  clinicName: getInitialClinicName(),
  clinicTagline: "Compassionate Care, Advanced Medicine",
  enabledModules: getInitialModules(),
}

export type AppAction =
  | { type: 'BOOK_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPT_STATUS'; id: string; status: string }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'SAVE_PRESCRIPTION'; payload: Prescription }
  | { type: 'CREATE_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; id: string; payload: Partial<Invoice> }
  | { type: 'UPDATE_STOCK'; id: string; qty: number }
  | { type: 'ADD_PHARMACY_ITEM'; payload: PharmacyItem }
  | { type: 'ADD_LAB_REPORT'; payload: LabReport }
  | { type: 'UPDATE_LAB_STATUS'; id: string; status: string }
  | { type: 'MARK_NOTIFICATION'; id: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'SET_ROLE'; role: string }
  | { type: 'SET_MODULE'; module: string }
  | { type: 'SELECT_PATIENT'; id: string | null }
  | { type: 'ADD_TOAST'; payload: ToastData }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'SET_CLINIC_NAME'; name: string }
  | { type: 'SET_CLINIC_TAGLINE'; tagline: string }
  | { type: 'TOGGLE_DOCTOR_AVAILABILITY'; id: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'BOOK_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] }
    case 'UPDATE_APPT_STATUS':
      return { ...state, appointments: state.appointments.map(a => a.id === action.id ? { ...a, status: action.status } : a) }
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] }
    case 'UPDATE_PATIENT':
      return { ...state, patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'SAVE_PRESCRIPTION':
      return { ...state, prescriptions: [...state.prescriptions, action.payload] }
    case 'CREATE_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] }
    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map(i => i.id === action.id ? { ...i, ...action.payload } : i) }
    case 'UPDATE_STOCK':
      return { ...state, pharmacy: state.pharmacy.map(m => m.id === action.id ? { ...m, stock: m.stock + action.qty } : m) }
    case 'ADD_PHARMACY_ITEM':
      return { ...state, pharmacy: [...state.pharmacy, action.payload] }
    case 'ADD_LAB_REPORT':
      return { ...state, labReports: [...state.labReports, action.payload] }
    case 'UPDATE_LAB_STATUS':
      return { ...state, labReports: state.labReports.map(l => l.id === action.id ? { ...l, status: action.status } : l) }
    case 'MARK_NOTIFICATION':
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) }
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }
    case 'SET_ROLE': {
      const defaultModules: Record<string, string> = { admin: 'dashboard', doctor: 'doctor_dashboard', patient: 'patient_portal' }
      return { ...state, currentUser: { ...state.currentUser, role: action.role, doctorId: action.role === 'doctor' ? 'D001' : null }, activeModule: defaultModules[action.role] || 'dashboard' }
    }
    case 'SET_MODULE':
      return { ...state, activeModule: action.module }
    case 'SELECT_PATIENT':
      return { ...state, selectedPatientId: action.id }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'TOGGLE_EDIT_MODE':
      return { ...state, editMode: !state.editMode }
    case 'SET_CLINIC_NAME':
      return { ...state, clinicName: action.name }
    case 'SET_CLINIC_TAGLINE':
      return { ...state, clinicTagline: action.tagline }
    case 'TOGGLE_DOCTOR_AVAILABILITY':
      return { ...state, doctors: state.doctors.map(d => d.id === action.id ? { ...d, available: !d.available } : d) }
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] }
    case 'UPDATE_SERVICE':
      return { ...state, services: state.services.map(s => s.id === action.payload.id ? action.payload : s) }
    default:
      return state
  }
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToast: (type: ToastData['type'], msg: string) => void;
}
export const AppContext = createContext<AppContextType | null>(null)
