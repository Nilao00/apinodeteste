const Sequelize = require('sequelize');
module.exports = (sequelize)=>{
const Usuario = sequelize.conexao.db[1].define('usuarios',{
   id:{
   type: Sequelize.INTEGER,
   primaryKey:true,
   autoIncrement:true
   },
    nome:{
        type: Sequelize.STRING(150),
        required:true
     },
     email:{
        type: Sequelize.STRING(200),
        validate:{
         isEmail:true
      }
     },
     telefone:{
        type: Sequelize.STRING(40),
      
     },
     password:{
        type: Sequelize.STRING(200),
        allowNull:false,
              
      
     },
     tokenPassword:{
      type: Sequelize.STRING(250),
      allowNull:true,
            
    
   },
     datecreate:{
         type:Sequelize.DATE,
         
         defaultValue: Sequelize.NOW
     },
     passwordExpired:{
         type:Sequelize.DATE,
                 
     }
})
//Usuario.sync({force:true})


return Usuario;
}

