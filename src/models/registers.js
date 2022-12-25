const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true

  },
  confirmpassword: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})
// generating tokens.
employeeSchema.methods.generateAuthToken = async function () {
  try {
    
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    // token:token both key & value are some so by object destructuring.
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token;
  } catch (error) {
    res.send("The error part" + error);
    console.log("The error part" + error);
  }
}


// converting password to hash format.
employeeSchema.pre("save", async function (next) {

  if (this.isModified('password')) {
    // console.log(`the current password is ${this.password}`);

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmpassword = await bcrypt.hash(this.password, 12)

    // console.log(`the current password is ${this.confirmpassword}`);
    // this.confirmpassword = undefined;
    // console.log(`the current password is ${this.password}`);

  }


  next();
})



// creating collections:table,documents:rows
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;