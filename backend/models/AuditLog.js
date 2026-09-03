import mongoose from 'mongoose';
const schema=new mongoose.Schema({admin:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},action:{type:String,required:true,index:true},targetType:{type:String,default:''},targetId:{type:String,default:''},description:{type:String,default:''},ipAddress:{type:String,default:''}},{timestamps:true});
export default mongoose.model('AuditLog',schema);
