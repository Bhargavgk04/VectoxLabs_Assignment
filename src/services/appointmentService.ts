import { Appointment } from '../types';
import appointmentsData from '../data/appointments.json';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

let inMemoryAppointments: Appointment[] = [...(appointmentsData as Appointment[])];

export async function getAppointments(): Promise<Appointment[]> {
  await delay();
  return [...inMemoryAppointments];
}

export async function getRecentAppointments(limit = 6): Promise<Appointment[]> {
  await delay();
  return inMemoryAppointments.slice(0, limit);
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  await delay();
  return inMemoryAppointments.find(a => a.id === id);
}

export interface CreateBookingParams {
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  dateTime: string;
  roomNumber?: string;
  type?: 'In-Person' | 'Follow-Up' | 'Emergency' | 'Telehealth';
}

export async function createBooking(params: CreateBookingParams): Promise<Appointment> {
  await delay(300);
  const newAppointment: Appointment = {
    id: `apt-${Date.now().toString().slice(-6)}`,
    patientId: `p-${Math.floor(Math.random() * 20 + 1)}`,
    patientName: params.patientName,
    patientAge: 35,
    patientGender: 'F',
    doctorId: params.doctorId,
    doctorName: params.doctorName,
    specialty: params.specialty,
    dateTime: params.dateTime,
    status: 'Scheduled',
    roomNumber: params.roomNumber || 'Clinic Suite 204',
    type: params.type || 'In-Person',
  };

  inMemoryAppointments = [newAppointment, ...inMemoryAppointments];
  return newAppointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status']
): Promise<Appointment | undefined> {
  await delay(150);
  const idx = inMemoryAppointments.findIndex(a => a.id === id);
  if (idx !== -1) {
    inMemoryAppointments[idx] = {
      ...inMemoryAppointments[idx],
      status,
    };
    return { ...inMemoryAppointments[idx] };
  }
  return undefined;
}
