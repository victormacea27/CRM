const sequelize = require('../conexion');

const BuscarRegionPorNombre = async (body) => {

    return await sequelize.query(`SELECT * FROM crm.regiones Where nombre = "${body.nombre}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarRegionPorID = async (id) => {

    return await sequelize.query(`SELECT * FROM crm.regiones Where ID = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};


module.exports = {
    BuscarRegionPorNombre,
    BuscarRegionPorID
};