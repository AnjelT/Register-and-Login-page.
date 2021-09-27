const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")


function initialize(passport,getUserByEmail,getUserById){
    const authenticateUser = async (email, password, done)=>{
        const user = getUserByEmail(email)    //will sure that user is true
        if(user == null) {//if we have not a that user's email
                return done(null, false, {message: "No user with that email"})
         }

        try{
            if(await bcrypt.compare(password,user.password)){ //we take user's password, and is it compare to that password wich user give us
              return done(null, user)  // if password is correct
            } else{
                return done(null, false, { message: "Password incorrect" }) //if password is incorrect
            }
        } catch (e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: "email"}, 
    authenticateUser))
    passport.serializeUser((user, done)=> done(null, user.id));
    passport.serializeUser((id, done)=> {
        return done(null,getUserById(id))
    })
}

module.exports = initialize