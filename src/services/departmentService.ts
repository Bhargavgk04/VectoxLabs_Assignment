import { Department } from '../types';
import departmentsData from '../data/departments.json';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDepartments(): Promise<Department[]> {
  await delay();
  return departmentsData as Department[];
}

export async function getDepartmentById(id: string): Promise<Department | undefined> {
  await delay();
  return (departmentsData as Department[]).find(d => d.id === id);
}
