const express = require('express');
const jwt = require('jsonwebtoken');
const auth_router = express.Router();
const { getUserByData } = require('../database/query/userQuery');
const hashPassword = require('../middleware/hashPassword');

auth_router.post('/login', async (req, res) => {
    const { idCitizen, password } = req.body;
    try {
        const user = await getUserByData('idCitizen', idCitizen);
        if (!user) {
            return res.status(404).json({
                message: 'Username is not exists',
            });
        } else {
            const hashedPassword = hashPassword(password, user[0].salt);
            console.log("user", user);
            console.log("user salt",  user[0].salt);
            console.log("pass", hashedPassword.pass);
            if (hashedPassword.pass === user[0].password) {
                const token = jwt.sign(
                    {
                        idCitizen: idCitizen,
                        role: user[0].role,
                    },
                    process.env.SECRET,
                    {
                        algorithm: 'HS256',
                        expiresIn: '1d',
                        issuer: 'ThanhNhan',
                    },
                );
                return res.status(200).json({
                    access_token: token,
                    message: 'Login susscess',
                });
            } else {
                return res.status(400).json({
                    message: 'Invalid username or password',
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error retrieving user',
        });
    }
});

module.exports = auth_router;
