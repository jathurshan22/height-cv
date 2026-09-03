import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},slug:{type:String,required:true,unique:true,index:true},description:{type:String,default:''},accent:{type:String,default:'#4F46E5'},preview:{type:String,default:''},category:{type:String,default:'professional'},isActive:{type:Boolean,default:true,index:true},isFeatured:{type:Boolean,default:false},usageCount:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Template',schema);
