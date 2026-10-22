import { getAppointments, getRecentAppointments } from '../../../src/services/appointmentService';
import { getPatients } from '../../../src/services/patientService';
import { getDepartments } from '../../../src/services/departmentService';

describe('Q1: Staff Management Dashboard Services & Data Integrity', () => {
  it('retrieves appointments list with correct schema', async () => {
    const appointments = await getAppointments();
    expect(appointments.length).toBeGreaterThanOrEqual(30);

    const first = appointments[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('patientName');
    expect(first).toHaveProperty('doctorName');
    expect(first).toHaveProperty('specialty');
    expect(first).toHaveProperty('status');
    expect(first).toHaveProperty('dateTime');
    expect(first).toHaveProperty('roomNumber');
  });

  it('retrieves recent appointments limited to requested size', async () => {
    const recent = await getRecentAppointments(6);
    expect(recent.length).toBe(6);
  });

  it('retrieves 26+ hospital inpatients with allergy data', async () => {
    const patients = await getPatients();
    expect(patients.length).toBeGreaterThanOrEqual(25);

    const elena = patients.find(p => p.name === 'Elena Rostova');
    expect(elena).toBeDefined();
    expect(elena?.allergies).toContain('Penicillin');
  });

  it('retrieves all 8 clinical hospital departments', async () => {
    const depts = await getDepartments();
    expect(depts.length).toBe(8);

    const cardio = depts.find(d => d.code === 'CARD');
    expect(cardio).toBeDefined();
    expect(cardio?.name).toBe('Cardiology & Vascular');
  });
});
