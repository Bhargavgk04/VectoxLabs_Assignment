import {
  getDiagnosticServices,
  getHospitalFacilities,
  getHealthPackages,
  getDiagnosticById,
  getFacilityById,
} from '../../../src/services/facilityService';
import { getDepartments } from '../../../src/services/departmentService';
import { getDoctors } from '../../../src/services/doctorService';

describe('Q4: Swiggy-Style Hospital Home & Carousel Data Integrity', () => {
  it('retrieves diagnostic services with turnaround time and pricing', async () => {
    const services = await getDiagnosticServices();
    expect(services.length).toBeGreaterThanOrEqual(8);

    const first = services[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('category');
    expect(first).toHaveProperty('price');
    expect(first).toHaveProperty('turnaroundTime');
    expect(first).toHaveProperty('imageUrl');
  });

  it('retrieves hospital facilities with availability and capacity', async () => {
    const facilities = await getHospitalFacilities();
    expect(facilities.length).toBeGreaterThanOrEqual(8);

    const first = facilities[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('location');
    expect(first).toHaveProperty('availability');
    expect(first).toHaveProperty('capacity');
  });

  it('retrieves health checkup package for promotional hero banner', async () => {
    const packages = await getHealthPackages();
    expect(packages.length).toBeGreaterThanOrEqual(1);

    const primaryPkg = packages[0];
    expect(primaryPkg).toHaveProperty('title');
    expect(primaryPkg).toHaveProperty('badge');
    expect(primaryPkg).toHaveProperty('includesTestsCount');
    expect(primaryPkg.includesTestsCount).toBeGreaterThanOrEqual(50);
    expect(primaryPkg.discountedPrice).toBeLessThan(primaryPkg.originalPrice);
    expect(primaryPkg.features.length).toBeGreaterThan(0);
  });

  it('provides all 4 distinct dataset feeds for horizontal carousels', async () => {
    const [departments, doctors, diagnostics, facilities] = await Promise.all([
      getDepartments(),
      getDoctors(),
      getDiagnosticServices(),
      getHospitalFacilities(),
    ]);

    expect(departments.length).toBeGreaterThan(0);
    expect(doctors.length).toBeGreaterThan(0);
    expect(diagnostics.length).toBeGreaterThan(0);
    expect(facilities.length).toBeGreaterThan(0);
  });

  it('fetches specific diagnostic and facility entities by id', async () => {
    const mri = await getDiagnosticById('diag-01');
    expect(mri).toBeDefined();
    expect(mri?.category).toBe('Radiology');

    const trauma = await getFacilityById('fac-01');
    expect(trauma).toBeDefined();
    expect(trauma?.availability).toContain('24/7');
  });
});
