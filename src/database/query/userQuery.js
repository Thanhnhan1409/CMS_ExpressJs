const knex = require('../connection');
const hashPassword = require('../../middleware/hashPassword');

const getUsers = async (page, pageSize, type, data, type2, data2) => {
    const offset = (page - 1) * pageSize;

    let query =  knex('citizens')
        .select('*')
        .offset(offset)
        .limit(pageSize);
    if ( type && data) {
        console.log("testt1");
        query = query.where(type, data)
    } 
    if(type2 === 'criminalRecord'){
        console.log("testt2");
        console.log(type2);
        query =  query.whereNotNull(type2);
        // console.log(query);
    }
    if( type2 && data2 && type2 !== 'criminalRecord') {
        query= query.andWhere(type2, data2);
    }
    let users = await query;
    if(!users)
        return;
    // Sử dụng Promise.all để đợi tất cả các câu truy vấn trong vòng lặp hoàn thành
    users = Object.values(JSON.parse(JSON.stringify(users)));
    await Promise.all(
        users.map(async (user) => {
            const idLocation = user.idLocation;
            const locationInfo = await knex('locations')
                .select('city', 'district', 'quarter', 'town')
                .where('idLocation', idLocation);
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
        }),
    );

    let query2 = knex('citizens')
        .count('idCitizen as count')
        if ( type && data) {
            console.log("test1");
            query2 = query2.where(type, data)
        } 
        if(type2 === 'criminalRecord'){
            console.log("test2");
            query = query.andWhere(type2 + ' IS NULL');
        }
        if( type2 && data2 && type2 !== 'criminalRecord') {
            console.log("test3");
            query= query.andWhere(type2, data);
        }
    const  totalPageData = await query2;
    const totalPages = Math.ceil(totalPageData[0].count / pageSize);

    console.log('citizen', users);
    return {
        users,
        totalPages,
        totalPageData: totalPageData[0].count,
    };
};

const getUserByData = async (type1, data1, type2, data2, type3, data3) => {
    try {
        let query = knex('citizens').select('*').where(type1, data1);

        if (type2 && data2) {
            console.log("test4");
            query = query.andWhere(type2, data2);
        }

        if (type3 && data3) {
            console.log("test5");
            query = query.andWhere(type3, data3);
        }

        let users = await query;
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
        }
        return users;
    } catch (error) {
        console.log(error);
    }
};

const deleteUserById = async (id, type, role) => {
    try {
        let user;
        await knex('appointments').where(type, id).del();
        await knex('requirements').where(type, id).del();
        if(role && role !== 1 && type === 'idPolicitian'){
            await knex('notification_citizen')
            .join(
                'notifications',
                'notifications.idNotification',
                'notification_citizen.idNotification',
            )
            .where('notifications.idPolitician', id)
            .del();
            await knex('notifications').where(type, id).del();
            user = await knex('politicians').where(type, id).del()
        } else if(type === 'idCitizen') {
            await knex('notification_citizen')
            .where(type, id)
            .del();
            knex('notifications')
            .whereNotIn('idNotification', function() {
                this.select('idNotification').from('notification_citizen');
            })
            .del()
            await knex('politicians').where(type, id).del()
            user = await knex('citizens').where(type, id).del()
        }
        if (user === 0) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.log(error);
    }
};

const updateUserById = async (id, newUser) => {
    const {
        name,
        birth,
        idFamily,
        gender,
        ethnic,
        religion,
        address,
        quarter,
        town,
        district,
        city,
        profession,
        criminalRecord,
        homeOwnerRelationship,
        email,
        phone,
        married,
    } = newUser;

    try {
        const result = await knex('citizens').where('idCitizen', id).update({
            name,
            birth,
            idFamily,
            gender,
            ethnic,
            religion,
            address,
            profession,
            criminalRecord,
            homeOwnerRelationship,
            email,
            phone,
            married,
        });

        await knex('locations')
            .join('citizens', 'citizens.idLocation', 'locations.idLocation')
            .where('idCitizen', id)
            .update({
                city,
                district,
                quarter,
                town,
            });
        if (result === 0) {
            throw new Error(`User with id ${id} not found`);
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error updating user');
    }
};

const addUser = async (newUser) => {
    try {
        const {
            name,
            password = '12345678',
            birth,
            idFamily,
            homeOwnerRelationship,
            gender,
            ethnic,
            religion,
            address,
            quarter,
            town,
            district,
            city,
            profession,
            email,
            phone,
            criminalRecord,
        } = newUser;

        const hashedPassword = hashPassword(password);

        const location = await knex('locations').insert({
            city,
            district,
            quarter,
            town,
        });
        const user = await knex('citizens').insert({
            name,
            password: hashedPassword.pass,
            salt: hashedPassword.salt,
            birth,
            idFamily,
            idLocation: location[0],
            homeOwnerRelationship,
            gender,
            ethnic,
            religion,
            address,
            profession,
            email,
            phone,
            criminalRecord,
        });
        return user;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getUsers,
    getUserByData,
    deleteUserById,
    updateUserById,
    addUser,
};


