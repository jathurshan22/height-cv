import { api } from './api';
export const userService = {
  updateProfile: (name:string,email:string)=>api.updateProfile({name,email}),
  updatePreferences: (preferences:any)=>api.updatePreferences(preferences),
  changePassword: (currentPassword:string,newPassword:string)=>api.changePassword({currentPassword,newPassword}),
  updateAvatar: (avatar:string)=>api.updateAvatar(avatar),
  deleteAccount: ()=>api.deleteAccount(),
};
