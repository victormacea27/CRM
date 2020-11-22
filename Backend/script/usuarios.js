const sequelize = require('../conexion');

const BuscarUsuarioPorUsuario = async (body) => {
    console.log(body.usuario);
    console.log('valdia email');
    return await sequelize.query(`SELECT * FROM crm.usuarios Where email = "${body.usuario}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarUsuarioPorEmail = async (body) => {
    console.log(body.email);
    console.log('valdia email');
    return await sequelize.query(`SELECT * FROM crm.usuarios Where email = "${body.email}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarUsuarioPorID = async (id) => {
    return await sequelize.query(`SELECT * FROM crm.usuarios Where id = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

module.exports = {
    BuscarUsuarioPorEmail,
    BuscarUsuarioPorUsuario, 
    BuscarUsuarioPorID
};