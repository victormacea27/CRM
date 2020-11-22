const sequelize = require('../conexion');

const BuscarCiudadPorNombre = async (body) => {

    return await sequelize.query(`SELECT * FROM crm.ciudades Where nombre = "${body.nombre}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarCiudadPorID = async (id) => {

    return await sequelize.query(`SELECT * FROM crm.ciudades Where ID = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};


module.exports = {
    BuscarCiudadPorNombre,
    BuscarCiudadPorID
};