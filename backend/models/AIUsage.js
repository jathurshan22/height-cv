import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},feature:{type:String,required:true,index:true},model:{type:String,default:'local-fallback'},status:{type:String,enum:['success','error'],default:'success'},tokensUsed:{type:Number,default:0},responseTime:{type:Number,default:0},error:{type:String,default:''}},{timestamps:true});
export default mongoose.model('AIUsage',schema);
