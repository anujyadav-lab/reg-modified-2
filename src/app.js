require("dotenv").config();
const express = require("express");
const path = require("path");
require("./db/conn");
const hbs = require("hbs");
const app = express();
const Register = require("./models/registers");

const bcrypt = require("bcryptjs");

const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 12);
    // console.log(passwordHash);

    // const passwordMatch = await bcrypt.compare(password,passwordHash);
    // console.log(passwordMatch);

}
securePassword("yadav@12");


const port = process.env.PORT || 1200;

// const staticPath = path.join(__dirname,"../public")
const templatePath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")
// console.log(path.join(__dirname,"../public"));
app.use(express.static(templatePath))
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath)
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// console.log(process.env.SECRET_KEY);
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("index");
})


app.post("/register", async (req, res) => {
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname)
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmploye = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            console.log("the success part" + registerEmploye);
            const token = await registerEmploye.generateAuthToken();
            //   console.log("the token part" + token);
            const registered = await registerEmploye.save();
            res.status(201).render("index");
            //to view on browser  res.send(registered);
        } else {
            res.send('password not same ❌')
        }

    } catch (error) {
        res.status(400).send(error);

    }
})

app.get("/login", (req, res) => {
    res.render("login");
})

// login check
app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and password is${password}`);
        const useremail = await Register.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("The token part" + token);
       
        if (isMatch) {
            res.status(201).render("login");

        } else {
            res.send("Invalid Details ❌")
        }
    } catch (error) {
        res.status(400).send("Invalid Email");
    }
})

const jwt = require("jsonwebtoken");

const createToken = async () => {
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])

    const token = await jwt.sign({ _id: "63a546fb9fdf1cf6d3a71c82" }, "anujyadavishereanujyadadvjourneyhasbegunnownobodycanstopanujyadavexceptanujyadavhimself", {
        expiresIn: "2 seconds"
    });
    console.log(token);
    //   jwt.verify(token, secretOrPublicKey, [options, callback])

    const userVerify = await jwt.verify(token, "anujyadavishereanujyadadvjourneyhasbegunnownobodycanstopanujyadavexceptanujyadavhimself");
    console.log(userVerify);

}
createToken();

app.listen(port, () => {
    console.log(`listening at port ${port}`);
})
