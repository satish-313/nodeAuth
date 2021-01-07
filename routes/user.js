const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// model
const User = require('../models/User')

router.get('/login',(req,res) => {
  res.render('login')
})

router.get('/register',(req,res) => {
  res.render('register')
})

// register
router.post('/register', async (req,res) => {
  const {name, email, password, password2} = req.body
  let errors = []
  // check required fields
  if(!name || !email || !password || !password2){
    errors.push({msg:'fill the fields'})
  }

  if(password !== password2){
    errors.push({msg:'password do not match'})
  }
  if(password.length < 6){
    errors.push({msg:"password should be atleast 6 character"})
  }

  if(errors.length > 0){
    res.render('register',{
      errors,name,email,password,password2
    })
  }
  else{
    // user adding
    const user = await User.findOne({email:email})
    if(user){
      errors.push("Email is exist")
      res.render('/register',{
        errors,name,email,password,password2
      })
    }
    else{
      // hash password 
      const salt = await bcrypt.genSalt(13)
      const hashedPassword = await bcrypt.hash(password,salt)
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      })
      await newUser.save()

      res.redirect('/user/login')
    }
  }
  
})

// login post
router.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req,res,next)
})

// logout handle 
router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/user/login')
})


module.exports = router