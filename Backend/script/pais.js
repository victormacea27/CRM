const sequelize = require('../conexion');

const BuscarPaisPorNombre = async (body) => {

    return await sequelize.query(`SELECT * FROM crm.paises Where nombre = "${body.nombre}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarPaisPorID = async (id) => {

    return await sequelize.query(`SELECT * FROM crm.paises Where ID = "${id}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};


module.exports = {
    BuscarPaisPorNombre,
    BuscarPaisPorID
};