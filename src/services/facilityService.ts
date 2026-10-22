import { DiagnosticService, HospitalFacility, HealthPackage } from '../types';
import diagnosticsData from '../data/diagnostics.json';
import facilitiesData from '../data/facilities.json';
import packagesData from '../data/packages.json';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDiagnosticServices(): Promise<DiagnosticService[]> {
  await delay();
  return diagnosticsData as DiagnosticService[];
}

export async function getHospitalFacilities(): Promise<HospitalFacility[]> {
  await delay();
  return facilitiesData as HospitalFacility[];
}

export async function getHealthPackages(): Promise<HealthPackage[]> {
  await delay();
  return packagesData as HealthPackage[];
}

export async function getDiagnosticById(id: string): Promise<DiagnosticService | undefined> {
  await delay();
  return (diagnosticsData as DiagnosticService[]).find(d => d.id === id);
}

export async function getFacilityById(id: string): Promise<HospitalFacility | undefined> {
  await delay();
  return (facilitiesData as HospitalFacility[]).find(f => f.id === id);
}

export async function getPackageById(id: string): Promise<HealthPackage | undefined> {
  await delay();
  return (packagesData as HealthPackage[]).find(p => p.id === id);
}
