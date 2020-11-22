const Sequelize = require('sequelize');

require('dotenv').config();

const seq = new Sequelize('crm',process.env.USER, process.env.PASS,
{
    dialect:process.env.DIALECT,
    host: '127.0.0.1'
});

seq.authenticate().then(()=>{
    console.log('Conectado');
}).catch(err=>{
    console.log(err);
});

module.exports = seq;