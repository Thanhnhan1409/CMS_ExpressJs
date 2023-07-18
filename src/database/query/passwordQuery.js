const knex = require('../connection');
const hashPassword = require('../../middleware/hashPassword');
const { getUserByData } = require('./userQuery');

const changePassword = async (id, password) => {
    try {
        const {  oldPassword, newPassword } = password;
        const user = await getUserByData('idCitizen', id);
        if(user){
            const hashedOldPassword = hashPassword(oldPassword, user[0].salt).pass;
            if( hashedOldPassword === user[0].password ){
                const hashedNewPassword = hashPassword(newPassword).pass;
                const newSalt = hashPassword(newPassword).salt;
                const user = await knex('citizens').where("idCitizen", id).andWhere('status',1).update({
                    password:  hashedNewPassword,
                    salt: newSalt
                })
                return user
            } else {
                throw new Error('The old password wrong');
            }
        } else {
            throw new Error(`User with id ${id} not found`);
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = changePassword;