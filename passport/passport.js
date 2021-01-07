const LocalStratergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

// load user model
const User = require('../models/User')

module.exports = function(passport){
  passport.use(
    new LocalStratergy({usernameField: 'email'},(email,password,done) => {
      // match User
      User.findOne({email})
        .then(user => {
          if(!user){
            return done(null,false,{message: 'that email is not register'})
          }
          // match the password
          bcrypt.compare(password,user.password, (err, isMatch) => {
            if(err) throw err
            if(isMatch){
              return done(null, user)
            }
            else{
              return done(null,false,{message:"incorrent password"})
            }
          })
        })
        .catch(err => console.log(err))
    })
  )
  passport.serializeUser(function(user,done){
    done(null,user.id)
  })
  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user)
    })
  })
}