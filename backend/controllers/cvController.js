import CV from '../models/CV.js';
import { mapCV } from '../utils/cvMapper.js';
import SystemSettings from '../models/SystemSettings.js';
import Template from '../models/Template.js';

const emptyCV = () => ({
  title: 'Untitled CV', template: 'professional',
  personalInfo: { fullName:'', professionalTitle:'', email:'', phone:'', location:'', linkedin:'', github:'', portfolio:'' },
  summary:'', workExperience:[], education:[], skills:[], projects:[], certifications:[], languages:[], achievements:[], references:[], atsScore:0, status:'draft', lastAutosavedAt:null
});

export async function listCVs(req,res){ const cvs=await CV.find({user:req.user._id}).sort({updatedAt:-1}); res.json({ cvs:cvs.map(mapCV) }); }
export async function getCV(req,res){ const cv=await CV.findOne({_id:req.params.id,user:req.user._id}); if(!cv)return res.status(404).json({message:'CV not found'}); res.json({cv:mapCV(cv)}); }
export async function createCV(req,res){ const config=await SystemSettings.findOne({key:'global'}); const count=await CV.countDocuments({user:req.user._id}); if(config && count >= config.maxCVs) return res.status(403).json({message:`CV limit reached (${config.maxCVs}).`}); const cv=await CV.create({...emptyCV(),...req.body,user:req.user._id}); await Template.findOneAndUpdate({slug:cv.template},{$inc:{usageCount:1}}); res.status(201).json({cv:mapCV(cv)}); }
export async function updateCV(req,res){ const {id,...data}=req.body; const cv=await CV.findOneAndUpdate({_id:req.params.id,user:req.user._id},{...data,user:req.user._id,lastAutosavedAt:new Date()},{new:true,runValidators:true}); if(!cv)return res.status(404).json({message:'CV not found'}); res.json({cv:mapCV(cv)}); }
export async function deleteCV(req,res){ const cv=await CV.findOneAndDelete({_id:req.params.id,user:req.user._id}); if(!cv)return res.status(404).json({message:'CV not found'}); res.json({message:'CV deleted'}); }
