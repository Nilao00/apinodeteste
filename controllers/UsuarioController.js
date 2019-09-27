module.exports = (app) =>{
    //declare version api
    const version = "/v1/usuario";
    //declare model usuario
    const usuario = app.models.usuario;
    //imports libs
    const jwt = app.libs.libs[0];
    const jwtOptions = app.libs.libs[1];
    const bcrypt = app.libs.libs[2];
    const passport = app.libs.libs[4];
    const getUser = app.libs.libs[7];
     
    //function check carateres especiais
   var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
   var checkForSpecialChar = function(string){
   for(i = 0; i < specialChars.length;i++){
   if(string.indexOf(specialChars[i]) > -1){
       return true
    }
   }
   return false;
   }

 /*
 #########################
         Rotas  
 #########################
  */  
//cadastro de usuario
    app.post(version+'/usuario',(req,res)=>{
    
        
        if(req.body.nome == undefined || req.body.nome== null || req.body.nome == ''){
            res.json({
                error:true,
                data:"Favor Preencha o nome",
                nome:true
            })
        }
        else if(!req.body.email || req.body.email == null || req.body.email == ''){
            res.json({
                error:true,
                data:"Favor Preencha o email",
                email:true
            })
        }
    else if(!req.body.telefone || req.body.telefone == null || req.body.telefone == ''){
            res.json({
                error:true,
                data:"Favor Preencha o telefone",
                telefone:true
            })
        }
    else if(!req.body.password || req.body.password == null || req.body.password== ''){
            res.json({
                error:true,
                data:"Favor Preencha a senha",
                password:true
            })
        }
    else if(req.body.password.length < 6 ){
            res.json({
                error:true,
                data:"A senha precisa ter pelo menos 6 digitos",
                password:true
            })
        }
        else if(!checkForSpecialChar(req.body.password)){
            res.json({
                error:true,
                data:"A senha precisa ter pelo menos 1 caratere especial",
                password:true
            })
            
        }else{

        
        usuario.findAndCountAll({where :{email:req.body.email}}).then(result=>{
            if(result.count == 0){
                let payload = { id: result.rows.id };
                let token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 600});
        const{
            nome,
            email,
            telefone,
            password        
        } = req.body;
        let hash = bcrypt.hashSync(password, 10);
        usuario.create({
            nome:nome,
            email:email,
            telefone:telefone,
            password:hash
            }).then(user => res.status(201).json({
            error : false,
            message:'Cadastro realizado com sucesso',
            id:user.get('id'),
            name:user.get('nome'),
            token:token
        })).catch(error => res.json({
            error: true,
            data: [],
            error: error
        }))
    }else{
        res.json({
            error:true,
            data:"Usuario ja existe"
        })
    }

    })
        }
    });
    
  //login user
  app.post(version+'/login', async (req, res)=> {
    const { email, password } = req.body;
   
     if(req.body.email == null || req.body.email == '' || req.body.email == undefined){
         res.json({
             error:true,
             data:'Favor preencha o email'
         })
     }else if(req.body.password == null || req.body.password == '' || req.body.password == undefined){
        res.json({
            error:true,
            data:'Favor preencha a senha'
        })
     }else{
    if (email && password) {
      let user = await getUser({ email: email });
      if (!user) {
        res.json({
            error:true,
            data:"O usuario não encontrado"
        })
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        let payload = { id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 600});
        res.json({ msg: 'Você esta logado!', token: token,id:user.id, name:user.get('nome'),});
      } else {
        res.json({
            error:true,
            data:"A senha esta incorreta"
        })
      }
    }
}
  });
    //get all usuario
    app.get(version+'/usuarios',passport.authenticate('jwt', { session: false }),(req,res)=>{
        usuario.findAll({order:[['nome']],attributes: ['nome', 'email','telefone','datecreate']})
        .then(users=>res.json({
            error: false,
            data: users
        }))
        .catch(error => res.json({
            error:true,
            data: [],
            error: error
        }));
    });
   //Atualiza usuario
    app.put(version+'/usuarios/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
        usuario.findOne({id:req.params.id}).then((user)=>{
        user.nome = req.body.nome
        user.email = req.body.email
        user.telefone = req.body.telefone
        user.save().then(res.json({
        error:false,
        data:'Atualização realizada'
        })).catch(res.json({
            error:true,
            data:'Erro ao atualizar'
        }))
        }).catch((erro)=>{
          //  res.send("erro ao atualiza"+erro)
        });
        
    
    });
    //email forgot password
    app.post(version+'/forgotPassword',(req,res,next)=>{
        if(req.body.email == ''){
            req.json('email obrigatório');
        }
        usuario.findOne({
            where:{
                email:req.body.email,
            },   
    }).then(user=>{
        if(user == null){
            res.json('email não encontrado');
        }else{
            const token = bcrypt.hashSync("acaivenda", 10);
            
    
            const transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: `nilao1256@gmail.com`,
                    pass: `nilo030389`,
                },
            });

            const mailOptions = {
                from:'nilao1256@gmail.com',
                to:req.body.email,
                subject:`Link para troca de senha`,
                text:
                `Segue o link para troca de senha\n\n`+
                `http://localhost:8081/reset/${token}\n\n`
            };
            transporter.sendMail(mailOptions,function(err, response){
                if(err){
                    res.json({
                        data:'Erro ao enviar o email',
                        error:true 
                    });
                }else{
                    res.json({
                    data:'Email enviado!',
                    error:false
                    });
                    req.body.tokenPassword = token;
                    req.body.passwordExpired = Date.now() + 36000;
                    usuario.update(req.body,{
                    where: {
                        email:req.body.email
                    }})
                }
            });
        }
    }).catch((error)=>{
        res.json('Houve um erro no envio do email' + error);
    })
    });
    //get User for id
    app.get(version+'/usuarios/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
        usuario.findAndCountAll({where :{id:req.params.id},attributes: ['nome', 'email','telefone','datecreate']}).then(result=>{
    
        if(result.count > 0){
        res.json({
            error:false,
            data:result
        })
    }else{
        res.json({
            error:true,
            data:"Nenhum dado encontrado"
        })
    }  
    });
    });
    //deletar usuario
    app.delete(version+'/usuarios/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
        usuario.destroy({where: {id :req.params.id}}).then(res.json({
            error:false,
            data:'Exclusão realizada'
        })).catch(res.json({
            error:true,
            data:'Erro ao excluir'
        }))
        
    });
    //logout
    app.post(version+'/logout',(req,res,next)=>{
        res.status(200).send({ auth: false, token: null,data:'Você esta deslogado' });
        
    });
}