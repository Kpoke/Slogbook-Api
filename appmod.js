require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Admin = require("./models/admin"),
      jwt = require('jsonwebtoken'),
      bcrypt = require("bcrypt"),
      app = express();


app.use(bodyParser.json());
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.post("/signup", async (req, res) => {
        let username =  req.body.username;
        let password = req.body.password;
        const user = new Admin({username, password, isAdmin: true})
        let flag = await Admin.exists({username: username})
        if(!flag){
            await user.save()
            const token = jwt.sign({userid: user._id}, process.env.ADMINKEY)
            res.send({token});
        }else{
            res.status(422).send({error: "Username already exists"});
        }

});

app.post("/signin", async (req, res) => {
    let username =  req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(422).send({error: "Must provide Username and Password"});
    };

    let admin = await Admin.findOne({username});
    if(!admin){
        return res.status(422).send({error: "Invalid Username and Password"});
    };
    

    let flag = await bcrypt.compare(password, admin.password);
    if(!flag){
        return res.status(422).send({error: "Invalid Username and Password"});
    };

    const token = jwt.sign({userid: admin._id}, process.env.ADMINKEY);
    res.send({ token });
});

app.get("/", isAdminLogged, (req, res) => {
    res.send("Gotten here can deploy");
});



app.listen(3000, function(){
    console.log("Up and running");
 });



 //middlewares
 function isAdminLogged(req, res, next){
    let authorization = req.headers.authorization;

    if(!authorization){
        return res.status(401).send({error: "You must be logged in"});
    };

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.ADMINKEY, async (err, payload) => {
        if(err){
            return res.status(401).send({error: "You must be logged in"});
        };
        let adminId = payload.userid;
        let admin = await Admin.findById(adminId);
        req.user = admin;
        next();
    });

 };

