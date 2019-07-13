
module.exports = (app) =>{
    const helmet = require('helmet');
    const body = require('body-parser');
    //use body parser
    app.use(body.urlencoded({extended:false}));
    app.use(body.json());
    const passport = require('passport');
    const jwt = require('jsonwebtoken');
    const passportJWT = require('passport-jwt');
    const fs = require('fs')
    const { promisify } = require('util')
    //conferte excel
    const json2csv = require('json2csv');
    //bcrypt
    const bcrypt = require('bcrypt');
     //config email
     const nodemailer = require('nodemailer');
     //upload image
     const upload = require('../uploadImage/upload');

 //use body parser
 app.use(body.urlencoded({extended:false}));
 app.use(body.json());
//habilitar helmet
app.use(helmet());
 //const get user
 const getUser = async obj => {
    return await usuario.findOne({
      where: obj,
    });
    };

 //unlik image
const unlinkAsync = promisify(fs.unlink)


//passport
app.use(passport.initialize())
app.use(passport.session())


  let ExtractJwt = passportJWT.ExtractJwt;
  let JwtStrategy = passportJWT.Strategy;
  let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'token'
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    //console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });
  
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  // use the strategy
passport.use(strategy);
 
//cors habilitada
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

 

  return [jwt,jwtOptions,bcrypt,strategy,passport,upload,body,getUser,nodemailer,unlinkAsync];
}
