module.exports = (app) =>{
const Sequelize = require('sequelize')
const sequelize = new Sequelize('acai','root','',{
    port: '3306',
    host: 'localhost',
    dialect: 'mysql'
   
})
let conect = false;


sequelize.authenticate().then(()=>{
    conect = true;
   // console.log("conectado com sucesso")
   
  }).catch((erro)=>{
       conect = false;
       console.log("erro ao conectar" + erro)
   })

   return [conect,sequelize];
}

