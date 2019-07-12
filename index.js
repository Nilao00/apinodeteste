const express = require('express');
const app = express();
const consign = require('consign');

consign()
.include('conexao/db.js')
.then('models')
.then('libs')
.then('controllers')
.into(app);

app.listen(3000,'201.18.67.132',()=>{
    console.log('Servidor rodando');
})

