import type { CVData } from '../types';
import { sampleCV } from '../data/mockData';
import { api } from './api';

export const cvService = {
  async list(): Promise<CVData[]> {
    const result = await api.listCVs();
    return (result.cvs || []) as unknown as CVData[];
  },
  async get(id: string): Promise<CVData | undefined> {
    try { const result = await api.getCV(id); return result.cv as unknown as CVData; } catch { return undefined; }
  },
  async create(payload: Partial<CVData> = {}): Promise<CVData> {
    const result = await api.createCV(payload);
    return result.cv as unknown as CVData;
  },
  async update(cv: CVData): Promise<CVData> {
    const { id, ...payload } = cv;
    const result = await api.updateCV(id, payload);
    return result.cv as unknown as CVData;
  },
  async remove(id: string): Promise<void> { await api.deleteCV(id); },
  sample: sampleCV,
};
