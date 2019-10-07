const express = require('express');
const app = express();
const path = require('path');
const consign = require('consign');

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./src/index.html'));
})

consign()
.include('conexao/db.js')
.then('models')
.then('libs')
.then('controllers')
.into(app);

app.listen(process.env.PORT || 3000,()=>{
    console.log('Servidor rodando');
})

