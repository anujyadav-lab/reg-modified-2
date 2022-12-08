const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
    
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:true
  },
  confirmpassword:{
    type:String,
    required:true,
    unique:true
  }
})

// creating collections:table,documents:rows
const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;