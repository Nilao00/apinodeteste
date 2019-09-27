const express = require('express');
const app = express();
const consign = require('consign');

consign()
.include('conexao/db.js')
.then('models')
.then('libs')
.then('controllers')
.into(app);

app.listen(process.env.PORT || 3000,()=>{
    console.log('Servidor rodando');
})

