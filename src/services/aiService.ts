import { api } from './api';
type ImproveTarget='summary'|'experience'|'project'|'skills'|'ats';
export const aiService={ async improve(target:ImproveTarget,input:string):Promise<string>{ const r=await api.improve(target,input); return String(r.result ?? ''); } };
