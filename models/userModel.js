const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: String, //email
  eid:String, //employeeId
  name: String,
  pwd: String,
  dept: String,
  role: {
    type: String,
    default: "emp"
  },
  userTasks: {
    status: {
      type: String,
      enum: ["ongoing", "completed", "no tasks"],
      default: "no tasks"
    },
    task: {
      type: [String],  // array of strings
      default: []
    },
    compTasks: {
        type:[String],
        default:[]
    },
    deadline:{
        type:Date,
        default: Date.now // Setting a default value to the current time
    }
  },
  otp:String
});
userSchema.index({ _id: 1, eid: 1 }, { unique: true }) //for unique emails and empIds
const userModel = mongoose.model("userdb1", userSchema)
module.exports=userModel