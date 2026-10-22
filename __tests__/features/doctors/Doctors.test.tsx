import { getDoctors, searchDoctors, getSpecialties, getDoctorById } from '../../../src/services/doctorService';
import { createBooking, getAppointmentById } from '../../../src/services/appointmentService';

describe('Q2: Doctor Directory & Appointment Booking Integrity', () => {
  it('retrieves full roster of doctors with availability and credentials', async () => {
    const doctors = await getDoctors();
    expect(doctors.length).toBeGreaterThanOrEqual(12);

    const first = doctors[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('specialty');
    expect(first).toHaveProperty('availability');
    expect(first).toHaveProperty('imageUrl');
    expect(first).toHaveProperty('consultationFee');
    expect(first).toHaveProperty('availableDates');
    expect(first.availableDates.length).toBeGreaterThan(0);
  });

  it('contains at least 2 intentionally broken image URLs for fallback verification', async () => {
    const doctors = await getDoctors();
    const brokenUrls = doctors.filter(d => d.imageUrl.includes('broken') || d.imageUrl.includes('invalid'));
    expect(brokenUrls.length).toBeGreaterThanOrEqual(2);
  });

  it('filters doctors by specialty correctly', async () => {
    const cardiologyDocs = await searchDoctors('', 'Cardiology');
    expect(cardiologyDocs.length).toBeGreaterThan(0);
    cardiologyDocs.forEach(d => {
      expect(d.specialty.toLowerCase()).toBe('cardiology');
    });
  });

  it('filters doctors by keyword query (name / wing)', async () => {
    const searchResults = await searchDoctors('Sarah');
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
    expect(searchResults[0].name).toContain('Sarah');
  });

  it('successfully creates an appointment booking with slots', async () => {
    const doctor = await getDoctorById('doc-01');
    expect(doctor).toBeDefined();

    const booking = await createBooking({
      doctorId: doctor!.id,
      doctorName: doctor!.name,
      specialty: doctor!.specialty,
      patientName: 'Test Patient Elena',
      dateTime: '2026-10-20 at 10:30 AM',
      type: 'In-Person',
    });

    expect(booking.id).toBeDefined();
    expect(booking.status).toBe('Scheduled');
    expect(booking.doctorName).toBe(doctor!.name);

    // Verify appointment is stored
    const retrieved = await getAppointmentById(booking.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.patientName).toBe('Test Patient Elena');
  });

  it('provides all clinical specialties with "All" as first filter', async () => {
    const specialties = await getSpecialties();
    expect(specialties[0]).toBe('All');
    expect(specialties).toContain('Cardiology');
    expect(specialties).toContain('Neurology');
    expect(specialties).toContain('Orthopedics');
  });
});
