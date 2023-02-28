
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');



const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
       console.log(error.message);
    }
}

//2down
//Send Mail
const sendVerifyMail = async(fname,email,user_id)=>{
    try{
     const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'dispensaryperry288@gmail.com',
                pass:'bqbfchbpbhhebvtc'
            }
        });
        const mailOptions = {
            from:'dispensaryperry288@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hi '+fname+',please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'">Verify</a>your mail.</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:-",info.response);
            }
        })

    }catch(error){
          console.log(error.message);
    }
}

//2up

const loadRegister = async(req,res)=>{
    try{
        res.render('registration');
    }catch(error){
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password);
        const user = new User({
            fname:req.body.fname,
            lname:req.body.lname,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
           

        });

        const userData = await user.save();

        if(userData){
            
           sendVerifyMail(req.body.fname,req.body.email,userData._id);
            
            res.render('registration',{message:"Your registration has been completed successfully.Please verify your mail"});
        }
        else{
            res.render('registration',{message:"Your registration has been failed"});
        }
    }catch(error){
        console.log(error.message);
    }
}

const verifyMail = async(req,res)=>{
    try{
        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});
        console.log(updateInfo);
        res.render("email-verifies");
    }catch(error){
        console.log(error.message);
    }
}

//3d
//login
const loginLoad = async(req,res)=>{
    try{
         res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
           const passwordMatch = await bcrypt.compare(password,userData.password);
           if(passwordMatch){
              if(userData.is_varified === 0){
                res.render('login',{message:"Please verify your mail."});
              }else{
                req.session.user_id = userData._id;
              
                res.render('home');
              }
             
           }
           else{
            res.render('login' , {message:"Email and password is incorrect"});
           }
        }
        else{
            res.render('login' , {message:"Email and password is incorrect"});
        }

    }catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
       
       // const userData = await User.findById({_id:req.session.user_id});
        res.render('home');
    }catch(error){
        console.log(error.message);
    }
}



const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
   
}