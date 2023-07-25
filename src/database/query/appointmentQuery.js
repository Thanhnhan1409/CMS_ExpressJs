const knex = require('../connection');

const getAppointments = async (page, pageSize, type, data) => {
    const offset = (page - 1) * pageSize;

    let appointments = await knex('appointments')
        .select('*')
        .where(type, 'like', `%${data}%`)
        .offset(offset)
        .limit(pageSize);

    // Sử dụng Promise.all để đợi tất cả các câu truy vấn trong vòng lặp hoàn thành
    appointments = Object.values(JSON.parse(JSON.stringify(appointments)));
    await Promise.all(
        appointments.map(async (appointment) => {
            const idPolitician = appointment.idPolitician;
            const politicianInfo = await knex('politicians')
                .select("*")
                .where('idPolitician', idPolitician);
            if (politicianInfo.length > 0) {
                appointment.politician  = politicianInfo[0];
            } else {
                appointment.politician  = null
            }
            console.log(" politicianInfo",  politicianInfo);
            console.log(" appointment.politicianInfo",  appointment.politician);
            const idCitizen = appointment.idCitizen;
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
                appointment.citizen = user;
            } else {
                appointment.citizen = null;
            }
        }),
    );

    const totalPageData = await knex('appointments')
        .count('idAppointment as count')
        .where(type, 'like', `%${data}%`);
    const totalPages = Math.ceil(totalPageData[0].count / pageSize);
    
    return {
        appointments,
        totalPages,
        totalPageData: totalPageData[0].count,
    };
};

const getAppointmentsByData = async (type1, data1, type2, data2, type3, data3) => {
    try {
        let query = knex('appointments').select('*').where(type1, data1);
    
        if (type2 && data2) {
            query = query.andWhere(type2, data2);
        }
    
        if (type3 && data3) {
            query = query.andWhere(type3, data3);
        }
        let appointments = await query;
    
        // Sử dụng vòng lặp for...of để lặp qua mảng appointments và sử dụng await trong mỗi lượt lặp
        for (const appointment of appointments) {
            const idPolitician = appointment.idPolitician;
            const politicianInfo = await knex('politicians')
            .select("*")
            .where('idPolitician', idPolitician)
            .first();
            if (politicianInfo) {
            appointment.politician = politicianInfo;
            } else {
            appointment.politician = null;
            }
    
            const idCitizen = appointment.idCitizen;
            let user = await knex('citizens').select("*").where("idCitizen", idCitizen).first();
            if (user) {
            const idLocation = user.idLocation;
            const locationInfo = await knex('locations')
                .select('*')
                .where('idLocation', idLocation);
            if (locationInfo.length > 0) {
                user.city = locationInfo[0].city;
                user.district = locationInfo[0].district;
                user.town = locationInfo[0].town;
                user.quarter = locationInfo[0].quarter;
            } else {
                user.location = null;
            }
            user = { ...user }
            console.log('user', user);
            appointment.citizen = user;
            } else {
            appointment.citizen = null;
            }
        }
        return appointments;
        } catch (error) {
        console.log(error);
        return null;
        }
    };

// const getAppointmentsByData = async (type1, data1, type2, data2, type3, data3) => {
//     try {
//         let query = knex('appointments').select('*').where(type1, data1);

//         if (type2 && data2) {
//             query = query.andWhere(type2, data2);
//         }

//         if (type3 && data3) {
//             query = query.andWhere(type3, data3);
//         }
//         let appointments = await query;
//         console.log('appointments', appointments);

//         if (appointments) {
//             appointments.map(async (appointment) => {
//                 console.log(appointments);
//                 appointment = { ...appointment };
//                 console.log('appointment ', appointment);
//                 const idPolitician = appointment.idPolitician;
//                 console.log('idPolitician', idPolitician);
//                 let politicianInfo = await knex('politicians')
//                     .select("*")
//                     .where('idPolitician', idPolitician).first();
//                 politicianInfo = { ...politicianInfo }
//                 if (politicianInfo) {
//                     appointment.politician  = politicianInfo;
//                 } else {
//                     appointment.politician  = null
//                 }
//                 const idCitizen = appointment.idCitizen;
//                 console.log("appointment.idCitizen", appointment.idCitizen);
//                 let users = await knex('citizens').select("*").where("idCitizen", idCitizen);
//                 users = Object.values(JSON.parse(JSON.stringify(users)));
//                 if (users) {
//                     console.log(users);
//                     const user = users[0];
//                     console.log('user ', user);
//                     const idLocation = user.idLocation;
//                     let locationInfo = await knex('locations')
//                         .select('*')
//                         .where('idLocation', idLocation);
//                     console.log('idLocation', idLocation);
//                     locationInfo = locationInfo.map((location) => ({ ...location }))
//                     console.log('locationInfo', locationInfo);
//                     if (locationInfo.length > 0) {
//                         user.city = locationInfo[0].city;
//                         user.district = locationInfo[0].district;
//                         user.town = locationInfo[0].town;
//                         user.quarter = locationInfo[0].quarter;
//                     } else {
//                         user.location = null;
//                     }
//                     user.gender = user.gender.data[0];
//                     user.married = user.married.data[0];
//                     user.militaryService = user.militaryService.data[0];
//                     console.log('user', user);
//                     appointment.citizen = user;
//                     console.log('appointment', appointment);
//                 } else {
//                     appointment.citizen = null;
//                 }
//             })
//             return appointments;
//         } else {
//             return;
//         }
//         // console.log('appointments',appointments);
//         // return appointments;
//     } catch (error) {
//         console.log(error);
//     }
// }

const addAppointment = async (newAppointment) => {
    try {
        const {
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        } = newAppointment;

        const appointment = await knex('appointments').insert({
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        });
        
        return appointment;
    } catch (error) {
        console.log(error);
    }
};

const updateAppointment = async (id, newAppointment) => {
    try {
        const {
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        } = newAppointment;

        const appointment = await knex('appointments').where('idAppointment', id).update({
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        })
        return appointment;
    } catch (error) {
        console.log(error);
    }
}

const deleteAppointment = async (id) => {
    try {
        const appointment = knex('appointments').where('idAppointment', id).del();
        if(appointment) 
            return appointment;
        else 
            return;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAppointments,
    getAppointmentsByData,
    addAppointment,
    updateAppointment,
    deleteAppointment
}