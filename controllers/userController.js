const userModel = require("../models/userModel");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')

const reg = async(req,res)=>{
    try{
        let obj = await userModel.findById(req.body._id)
        if(!obj){
            let hashcode = await bcrypt.hash(req.body.pwd, Number(process.env.numberOfRounds))
            let data = new userModel({...req.body,"pwd":hashcode})
            await data.save()
            res.json({"msg":"Account created sucessfully"})
        }
        else{
            res.json({"msg":"User Already Exists please try again with different email"})
        }
    }
    catch{
        res.json({"msg":"Error while registering user"})
    }
}

const login = async(req,res)=>{
    try{
        let obj = await userModel.findById(req.body._id)
        if(obj){
            let f = await bcrypt.compare(req.body.pwd,obj.pwd)
            if(f){
                res.json({"token":jwt.sign({"_id":req.body._id},process.env.jwtSecretKey),"role":obj.role,"name":obj.name,"_id":obj._id,"eid":obj.eid})
            }
            else{
                res.json({"msg":"Please check your password and try again"})
            }
        }
        else{
            res.json({"msg":"Please check your email and try again"})
        }
    }
    catch{
        res.json({"msg":"Error while Logging user"})
    }
}
const getEmps=async(req,res)=>{
    try{
        let data = await userModel.find({"role":"emp"})
        res.json(data)
    }
    catch{
        res.json({"msg":"Error while Getting Employee data"})
    }

}
const getEmpData = async(req,res)=>{
    try{
        let data = await userModel.find({"eid":req.params.id})
        res.json(data[0].userTasks.task)
    }
    catch{
        res.json({"msg":"Error while getting Employee data"})
    }
}
const updTask = async (req, res) => {
  try {
    const { _id, task, deadline } = req.body;
    await userModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          "userTasks.task": task,          // array of strings
          "userTasks.status": "ongoing",   // matches enum
          "userTasks.deadline": deadline   // update deadline as well
        }
      }
    );
    res.json({ msg: "Emp data updated successfully" });
  } catch (err) {
    console.error("Error while updating data:", err);
    res.status(500).json({ msg: "Error while updating data" });
  }
};

const updDetails=async(req,res)=>{
    try{
        await userModel.findByIdAndUpdate(req.body._id,req.body)
        res.json({"msg":"Emp data Updated successfully"})
    }catch{
        res.json({"msg":"Error While Updating data"})
    }
}
const updStatus=async(req,res)=>{
    try{
        await userModel.findByIdAndUpdate(req.body._id,{"userTasks.status":req.body.status})
        res.json({"msg":"Emp data Updated successfully"})
    }catch{
        res.json({"msg":"Error While Updating data"})
    }
}
const editTask=async(req,res)=>{
    try{
        let data = await userModel.find({"eid":req.params.id})
        res.json(data)
    }catch{
        res.json({"msg":"Error While getting data"})
    }
}
const editDetails=async(req,res)=>{
    try{
        let data = await userModel.find({"eid":req.params.id})
        res.json(data)
    }catch{
        res.json({"msg":"Error While getting data"})
    }
}
const editStatus=async(req,res)=>{
    try{
        let data = await userModel.find({"eid":req.params.id})
        res.json(data)
    }catch{
        res.json({"msg":"Error While getting data"})
    }
}
const delUser=async(req,res)=>{
    try{
        await userModel.findByIdAndDelete(req.params.id)
        res.json({"msg":"Deleted User Successfully"})
    }
    catch{
        res.json({"msg":"Error While Deleting User"})
    }
}
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "v24hfs7p1@gmail.com",
    pass: process.env.appPassword,
  },
});
const sendOtp=async(req,res)=>{
    try{
        let obj = await userModel.findById(req.params.id)
        if(obj){
            let num = Math.floor(Math.random()*100000)+""
            let otp = num.padEnd(5, "0")
            await userModel.findByIdAndUpdate({"_id":obj._id},{"otp":otp})
            const info = await transporter.sendMail({
                from: '"Backend Team" <v24hfs7p1@gmail.com>',
                to: obj._id,
                subject: "Password Reset OTP",
                html: `OTP for resetting password : ${otp}` // HTML body
            });
            if(info.accepted.length!=0){
                res.json({"msg":"otp sent"})
            }
            else{
                res.json({"msg":"Error in sending OTP please try again"})
            }
        }
        else{
            res.json({"msg":"Account doesn't exists please continue with register"})
        } 
    }
    catch{
        res.json({"msg":"Error while sending OTP"})
    }
}
const validateOtp=async(req,res)=>{
    try{
        let obj = await userModel.findById(req.params.id)
        if(obj?.otp==req.params.otp){
            await userModel.findByIdAndUpdate({"_id":obj._id},{$unset:{"otp":""}}) 
            res.json({"msg":"otpvalid"})
        }
        else{
            res.json({"msg":"Incorrect OTP"})
        }
    }
    catch{
        res.json({"msg":"Error while Validating OTP"})
    }
}
const resetPwd=async(req,res)=>{
    try{
        const hash = await bcrypt.hash(req.body.pwd,10)
        await userModel.findByIdAndUpdate({"_id":req.body._id},{"pwd":hash})
        res.json({"msg":"Password has been resetted successfully"})
    }
    catch(err){
        res.json({"msg":"Error while Resetting Password","err":err})
    }
}
module.exports={reg,login,getEmps,editDetails,editStatus,editTask,updDetails,updStatus,updTask,delUser,getEmpData,validateOtp,sendOtp,resetPwd}