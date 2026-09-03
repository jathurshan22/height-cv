import type { ATSAnalysis, CVData } from '../types';
import { api, type JsonRecord } from './api';
export const atsService = { async analyze(cv: CVData, jobDescription = ''): Promise<ATSAnalysis> { return (await api.ats(cv as unknown as JsonRecord, jobDescription)) as unknown as ATSAnalysis; } };
