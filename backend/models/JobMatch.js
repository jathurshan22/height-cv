import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},cv:{type:mongoose.Schema.Types.ObjectId,ref:'CV',default:null,index:true},jobTitle:{type:String,default:''},company:{type:String,default:''},jobDescription:{type:String,default:''},matchScore:{type:Number,default:0},matchedSkills:{type:[String],default:[]},missingSkills:{type:[String],default:[]},recommendations:{type:[String],default:[]}},{timestamps:true});
export default mongoose.model('JobMatch',schema);
