const express = require('express');
const user_router = express.Router();
const {
    getUsers,
    getUserByData,
    addUser,
    updateUserById,
    deleteUserById,
} = require('../../database/query/userQuery');
const authentication = require('../../middleware/authentication');
const { isAdmin, isPolitician } = require('../../middleware/authorization');

user_router.get('/', authentication, async (req, res) => {
    try {
        const page_Size = parseInt(req.query.pageSize) || 10;
        const { page = 1, type='', data='', type2='', data2=''} = req.body;

        const { users, totalPage, totalPageData } = await getUsers(
            page,
            page_Size,
            type, 
            data, 
            type2, 
            data2
        );
        if(!users){
            return res.status(404).json({
                status: 'failed',
                message: 'Not found users',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: users,
            meta: {
                currentPage: parseInt(page),
                totalPage,
                pageSize: page_Size,
                totalPageData,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
});

user_router.get('/listUsers/:role', authentication, async (req, res) => {
    try {
        const role = req.params.role;
        const page_Size = parseInt(req.query.pageSize) || 10;
        const { page = 1 } = req.body;

        const { users, totalPage, totalPageData } = await getUsers(
            page,
            page_Size,
            'role',
            role,
        );

        return res.status(200).json({
            status: 'success',
            data: users,
            meta: {
                currentPage: parseInt(page),
                totalPage,
                pageSize: page_Size,
                totalPageData,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
});

user_router.get('/:id',authentication,  async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await getUserByData('idCitizen', id);
        return res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: 'failed',
            message: 'User not found',
        });
    }
});

user_router.post('/',  async (req, res) => {
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
    } = req.body;
    const user = await getUserByData('email', email);
    if (user) {
        res.status(400).json({
            status: 'failed',
            message: 'User already exists',
        });
    } else {
        try {
            const user = await addUser({
                name,
                password,
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
            });
            return res.status(200).json({
                status: 'success',
                data: user,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                status: 'failed',
                message: 'Error retrieving users',
            });
        }
    }
});

user_router.put('/:id', [authentication, isAdmin, isPolitician], async (req, res) => {
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
    } = req.body;
    const id = req.params.id;
    try {
        const user = await updateUserById(id, {
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
        });
        return res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
});

user_router.delete('/:id',[authentication, isAdmin, isPolitician], async (req, res) =>{
    try {
        const id = req.params.id;
        const user = await deleteUserById(id, 'idCitizen');
        if(user)
            return res.status(200).json({
                status: 'success',
                message: 'delete user successfully!',
            })
        else 
            return res.status(200).json({
                status: 'failed',
                message: 'delete user failed!',
            })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
})

module.exports = user_router;
