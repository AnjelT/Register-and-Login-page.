if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt")
const passport = require("passport");
const flash = require("express-flash")
const session = require("express-session") //just only library
const methodOverride = require('method-override')

const initializePassport = require("./passport-config");
initializePassport( //call fanction
    passport,
    email=> users.find(user => user.email === email), //return and find the user
    id => users.find(user => user.id === id)
) 


const users = [];

app.set("view-engine", "ejs")
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, //it's a key for information
    resave: false, //verapahel
    saveUninitialized: false
}))
app.use(passport.initialize()) //?
app.use(passport.session())
app.use(methodOverride("_method"))

app.get("/", checkAuthenticated, (req,res)=>{ //checkAuthenticated cankanum enq vaveracnel, kuxordi mer mutqi ej qani der menq mutq chenq gordzel
    res.render("index.ejs",{name: req.user.name}) 
});

app.get("/login", checkNotAuthenticated, (req,res)=>{ //checkNotAuthenticated-i mijocov chenq tuyl talis chstugvac ogtvoxner@ mutq gordzel 
    res.render("login.ejs") 
})

app.post("/login", checkNotAuthenticated, passport.authenticate("local",{ //what we want to change
    successRedirect:"/",
    failureRedirect: "/login",
    failureFlash: true //= message
}))

app.get("/register", checkNotAuthenticated, (req,res)=>{
    res.render("register.ejs") 
})

app.post("/register", checkNotAuthenticated, async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email:req.body.email,
            password: hashedPassword
        })
        res.redirect("/login")
    }catch{
        res.redirect("/register")
    }
})

app.delete("/logout",(req,res)=>{
    req.logOut() //metod
    res.redirect("/login")
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next() //ete vaveracvac e true, hakarak depqum false
    }

    res.redirect("/login")
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
     return res.redirect("/")
    }
    next();
}

app.listen(4000);