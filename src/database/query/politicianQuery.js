const knex = require('../connection');
const { getUserByData } = require('./userQuery');

const addPolitician = async (idCitizen, newPolitician) => {
    try {
        const user = await getUserByData('idCitizen', idCitizen);
        console.log("user", user);
        if(user){
            const {
                position,
                levelManagement,
                areaManagement
            } = newPolitician;

            const politician = await knex('politicians').insert({
                position,
                levelManagement,
                areaManagement,
                idCitizen
            })
            return politician;
        } else{
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error);
    }
}

const getPoliticianByData = async (type, data) => {
    try {
        const [politician] = await knex('politicians').select('*').where(type,data);
        if (!politician) {
            return;
        }
        return politician;
    } catch (error) {
        console.log(error);
    }
}

const updatePolitician = async (id, newPolitician) => {
    try {
        const politician = await getPoliticianByData('idPolitician', id);
        console.log("politician", politician);
        if(politician){
            const {
                position,
                levelManagement,
                areaManagement
            } = newPolitician;

            const politician = await knex('politicians').update({
                position,
                levelManagement,
                areaManagement,
            })
            return politician;
        } else{
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addPolitician,
    getPoliticianByData,
    updatePolitician
}