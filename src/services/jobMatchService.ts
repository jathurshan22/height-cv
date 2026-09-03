import type { CVData, JobMatchResult } from '../types';
import { api, type JsonRecord } from './api';
export const jobMatchService = { async analyze(cv: CVData, jobDescription: string): Promise<JobMatchResult> { return (await api.jobMatch(cv as unknown as JsonRecord, jobDescription)) as unknown as JobMatchResult; } };
