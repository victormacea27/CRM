const sequelize = require('../conexion');

const BuscarContactoPorEmail = async (body) => {
    return await sequelize.query(`SELECT * FROM crm.contactos Where email = "${body.email}";`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};

const BuscarcontactoPorID = async (id) => {
    return await sequelize.query(`SELECT * FROM crm.contactos Where ID in (${id});`,
    {
        type: sequelize.QueryTypes.SELECT
    });
};


module.exports = {
    BuscarContactoPorEmail,
    BuscarcontactoPorID
};