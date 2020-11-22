const sequelize = require('../conexion');

const BuscarCompaniaPorNombre = async (body) => {

    return await sequelize.query(`SELECT * FROM crm.companias Where nombre = "${body.nombre}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarCompaniaPorID = async (id) => {

    return await sequelize.query(`SELECT * FROM crm.companias Where ID = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};


module.exports = {
    BuscarCompaniaPorNombre,
    BuscarCompaniaPorID
};