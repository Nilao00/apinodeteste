module.exports = (app) =>{
 //declare version api
 const version = "/v1/uploadImg";
  //import libs
  const upload = app.libs.libs[5];
  const unlinkAsync = app.libs.libs[9];
  const passport = app.libs.libs[4];
  //upload image
    app.post(version+'/upload',upload.single('file'),passport.authenticate('jwt', { session: true }),(req, res) => {
        const arrayImg = ['image/jpeg','image/jpg','image/PNG','image/png','image/gif'];
        if(res.statusCode == 401){
            unlinkAsync(req.file.path);
        }
           if(req.file.size > 5000000) {
                res.json({
                error:true,
                message:"Tamanho do arquivo maior que o permitido",
            
            })
            unlinkAsync(req.file.path);
        
        }else if(arrayImg.includes(req.file.mimetype) == false){
           
            res.json({
                error:true,
                message:"Formato incorreto para upload",
                           
            })
            unlinkAsync(req.file.path);
        }
        else{
            res.json({
                error:false,
                message:req.file
            })
            unlinkAsync(req.file.path);
        }
        
    })  



}