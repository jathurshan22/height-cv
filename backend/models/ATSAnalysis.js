import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},cv:{type:mongoose.Schema.Types.ObjectId,ref:'CV',default:null,index:true},score:{type:Number,default:0},keywords:{type:[String],default:[]},missingKeywords:{type:[String],default:[]},suggestions:{type:[String],default:[]}},{timestamps:true});
export default mongoose.model('ATSAnalysis',schema);
