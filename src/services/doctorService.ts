import { Doctor } from '../types';
import doctorsData from '../data/doctors.json';

// Simulated async network delay (150ms)
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDoctors(): Promise<Doctor[]> {
  await delay();
  return doctorsData as Doctor[];
}

export async function getDoctorById(id: string): Promise<Doctor | undefined> {
  await delay();
  return (doctorsData as Doctor[]).find(doc => doc.id === id);
}

export async function searchDoctors(
  query: string,
  specialtyFilter?: string
): Promise<Doctor[]> {
  await delay();
  let list = doctorsData as Doctor[];

  if (specialtyFilter && specialtyFilter !== 'All') {
    list = list.filter(
      doc => doc.specialty.toLowerCase() === specialtyFilter.toLowerCase()
    );
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      doc =>
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.hospitalAffiliation.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getSpecialties(): Promise<string[]> {
  await delay(50);
  const allSpecialties = (doctorsData as Doctor[]).map(doc => doc.specialty);
  return ['All', ...Array.from(new Set(allSpecialties))];
}
