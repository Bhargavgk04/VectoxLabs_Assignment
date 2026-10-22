import { Patient } from '../types';
import patientsData from '../data/patients.json';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

let memoryPatients: Patient[] = [...(patientsData as Patient[])];

export async function getPatients(): Promise<Patient[]> {
  await delay();
  return [...memoryPatients];
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  await delay();
  return memoryPatients.find(p => p.id === id);
}

export async function addPatient(newPatient: Omit<Patient, 'id'>): Promise<Patient> {
  await delay();
  const created: Patient = {
    ...newPatient,
    id: `pat-${Date.now()}`,
  };
  memoryPatients = [created, ...memoryPatients];
  return created;
}

export async function updatePatientStatus(
  id: string,
  status: Patient['status'],
  roomBed?: string
): Promise<Patient | undefined> {
  await delay(150);
  const idx = memoryPatients.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryPatients[idx] = {
      ...memoryPatients[idx],
      status,
      roomBed: roomBed !== undefined ? roomBed : memoryPatients[idx].roomBed,
    };
    return { ...memoryPatients[idx] };
  }
  return undefined;
}
