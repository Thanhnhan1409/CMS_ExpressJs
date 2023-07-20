const knex = require('../connection');

const getOpinions = async (page, pageSize, type, data) => {
    const offset = (page - 1) * pageSize;

    let opinions = await knex('opinions')
        .select('*')
        .where(type, 'like', `%${data}%`)
        .offset(offset)
        .limit(pageSize);

    opinions = Object.values(JSON.parse(JSON.stringify(opinions)));
    await Promise.all(
        opinions.map(async (opinion) => {
            const idCitizen = opinion.idCitizen;
            let users = await knex('citizens').select("*").where("idCitizen", idCitizen);
            users = Object.values(JSON.parse(JSON.stringify(users)));
            if (users) {
                console.log(users);
                const user = users[0];
                console.log('user ', user);
                const idLocation = user.idLocation;
                const locationInfo = await knex('locations')
                    .select('*')
                    .where('idLocation', idLocation);
                console.log('idLocation', idLocation);
                console.log('locationInfo', locationInfo);
                if (locationInfo.length > 0) {
                    user.city = locationInfo[0].city;
                    user.district = locationInfo[0].district;
                    user.town = locationInfo[0].town;
                    user.quarter = locationInfo[0].quarter;
                } else {
                    user.location = null;
                }
                user.gender = user.gender.data[0];
                user.married = user.married.data[0];
                user.militaryService = user.militaryService.data[0];
                opinion.citizen = user;
            } else {
                opinion.citizen = null;
            }
        }),
    );
        console.log("opinions", opinions);
    const totalPageData = await knex('opinions')
        .count('idOpinion as count')
        .where(type, 'like', `%${data}%`);
    const totalPages = Math.ceil(totalPageData[0].count / pageSize);

    return {
        opinions,
        totalPages,
        totalPageData: totalPageData[0].count,
    };
};

const getOpinionByData = async (type, data) => {
    try {
        const [options] = await knex('options').select('*').where(type, data);
        if( options ) {
            return options;
        }
        return;
    } catch (error) {
        console.log(error);
    }
}

const deleteOpinion= async (id) => {
    try {
        const opinion = await knex('opinions').where('idOpinion',id).del();
        if(opinion) {
            return opinion;
        }
        return;
    } catch (error) {
        console.log(error);       
    }
}

const addOpinion = async (newOpinion) => {
    try {
        const { idCitizen, content } = newOpinion;
        const opinion = await knex('opinions').insert({
            idCitizen,
            content,
            createdAt: new Date()
        })

        if(opinion) {
            return opinion;
        } return;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getOpinions,
    getOpinionByData,
    deleteOpinion,
    addOpinion
}