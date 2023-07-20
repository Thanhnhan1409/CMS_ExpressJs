const express = require('express');
const password_router = express.Router();
const { getUserByData } = require('../database/query/userQuery');
const changePassword = require('../database/query/passwordQuery');
const authentication = require('../middleware/authentication');

password_router.put("/changePassword/:id", [authentication], async (req, res) => {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;
        const user = await getUserByData("idCitizen", id);
        if(user){
            const result = await changePassword(id, { oldPassword, newPassword })
            return res.status(200).json({
                status: 'success',
                data: result
            })
        }  
        return res.status(200).json({
            status: 'failed',
            message: " Error"
        })
       
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retrieving password',
        });
    }
})

module.exports = password_router;
