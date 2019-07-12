module.exports = (app) =>{
  //import libs
  const upload = app.libs.libs[5];
  const unlinkAsync = app.libs.libs[9];
  //upload image
    app.post('/upload',upload.single('file'),(req, res) => {
        const arrayImg = ['image/jpeg','image/jpg','image/PNG','image/png','image/gif']
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
        }
        
    })  



}