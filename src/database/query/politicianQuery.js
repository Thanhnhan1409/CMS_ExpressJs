const knex = require('../connection');
const { getUserByData } = require('./userQuery');

const getPoliticians = async (page, pageSize, type, data, type2, data2) => {
    const offset = (page - 1) * pageSize;

    let query = knex('politicians')
        .select('*')
        .offset(offset)
        .limit(pageSize);
    if (type && data) {
        query = query.where(type, data);
    }
    if (type2 && data2) {
        query = query.andWhere(type2, data2);
    }
    let users = await query;
    if (!users) 
        return;
    // Sử dụng Promise.all để đợi tất cả các câu truy vấn trong vòng lặp hoàn thành
    // users = Object.values(JSON.parse(JSON.stringify(users)));
    users = Object.values(JSON.parse(JSON.stringify(users)));
    // await Promise.all(
    // users.map(async (user) => {
    //     user = { ...user };
    //     console.log('politician', user);
    //     const idCitizen = user.idCitizen;
    //     let citizenInfo = await knex('citizens')
    //         .where('idCitizen', idCitizen)
    //         .first();
    //     const idLocation = citizenInfo.idLocation;
    //     const locationInfo = await knex('locations')
    //         .select('city', 'district', 'quarter', 'town')
    //         .where('idLocation', idLocation)
    //         .first();
    //     if (locationInfo) {
    //         citizenInfo.city = locationInfo.city;
    //         citizenInfo.district = locationInfo.district;
    //         citizenInfo.town = locationInfo.town;
    //         citizenInfo.quarter = locationInfo.quarter;
    //     } else {
    //         citizenInfo.location = null;
    //     }
    //     citizenInfo = { ...citizenInfo }
    //     console.log('citizenInfo.gender',citizenInfo.gender);
    //     // citizenInfo.gender = citizenInfo.gender.data[0];
    //     // citizenInfo.married = citizenInfo.married.data[0];
    //     // citizenInfo.militaryService = citizenInfo.militaryService.data[0];
    //     console.log('infor citizen', citizenInfo);
    //     user.citizen = citizenInfo;
    //     console.log(user);
    // }),
    // )

    let query2 = knex('politicians').count('idPolitician as count');
    if (type && data) {
        query2 = query2.where(type, data);
    }
    if (type2 && data2) {
        query = query.andWhere(type2, data);
    }
    const totalPageData = await query2;
    const totalPages = Math.ceil(totalPageData[0].count / pageSize);

    console.log('users', users);
    return {
        users,
        totalPages,
        totalPageData: totalPageData[0].count,
    };
};

const addPolitician = async (idCitizen, newPolitician) => {
    try {
        const user = await getUserByData('idCitizen', idCitizen);
        console.log('user', user);
        if (user) {
            const { position, levelManagement, areaManagement } = newPolitician;

            const politician = await knex('politicians').insert({
                position,
                levelManagement,
                areaManagement,
                idCitizen,
            });
            return politician;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error);
    }
};

const getPoliticianByData = async (type, data) => {
    try {
        const [politician] = await knex('politicians')
            .select('*')
            .where(type, data);
        if (!politician) {
            return;
        }
        return politician;
    } catch (error) {
        console.log(error);
    }
};

const updatePolitician = async (id, newPolitician) => {
    try {
        const politician = await getPoliticianByData('idPolitician', id);
        console.log('politician', politician);
        if (politician) {
            const { position, levelManagement, areaManagement } = newPolitician;

            const politician = await knex('politicians').update({
                position,
                levelManagement,
                areaManagement,
            });
            return politician;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getPoliticians,
    addPolitician,
    getPoliticianByData,
    updatePolitician,
};
