import mongoose from 'mongoose';
const schema=new mongoose.Schema({key:{type:String,unique:true,required:true},appName:{type:String,default:'Height AI'},maintenanceMode:{type:Boolean,default:false},registrationEnabled:{type:Boolean,default:true},aiEnabled:{type:Boolean,default:true},defaultTemplate:{type:String,default:'minimal'},maxCVs:{type:Number,default:20},maxAIRequests:{type:Number,default:100},announcement:{type:String,default:''}},{timestamps:true});
export default mongoose.model('SystemSettings',schema);
