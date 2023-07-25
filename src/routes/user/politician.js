const express = require('express');
const { addPolitician, updatePolitician, getPoliticianByData, getPoliticians } = require('../../database/query/politicianQuery');
const { deleteUserById } = require('../../database/query/userQuery');
const authentication = require('../../middleware/authentication');
const { isAdmin } = require('../../middleware/authorization');
const politician_router = express.Router();

politician_router.get('/', authentication, async (req, res) => {
    try {
        const page_Size = parseInt(req.query.pageSize) || 10;
        const { page = 1, type='', data='', type2='', data2=''} = req.body;

        const { users, totalPage, totalPageData } = await getPoliticians(
            page,
            page_Size,
            type, 
            data, 
            type2, 
            data2
        );
        console.log("api",users);
        if(!users){
            return res.status(404).json({
                status: 'failed',
                message: 'Not found politicians',
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
            message: 'Error retrieving politicians',
        });
    }
});

politician_router.get('/:id', [authentication], async (req, res) => {
    try {
        const id = req.params.id;
        const politician = await getPoliticianByData('idCitizen', id);
        if(politician) {
            return res.status(200).json({
                status: "success",
                data: politician
            })
        } else {
            return res.status(404).json({
                status: "failed",
                message: "Not found Politician"
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            message: " Error retrieing politician"
        })
    }
})

politician_router.put('/:id',[authentication, isAdmin], async (req, res) =>{
    try {
        const id = req.params.id;
        const {  
            position,
            levelManagement,
            areaManagement 
        } = req.body;
        const politician = await updatePolitician(id, { position, levelManagement, areaManagement });
        if(politician) {
            return res.status(200).json({
                status: "success",
                data: politician
            })
        } else {
            return res.status(404).json({
                status: "failed",
                message: "Update politician failed!"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            message: " Error retrieing politician"
        })
    }
})

politician_router.post('/', [authentication], async (req, res) => {
    try {
        const id = req.body.idCitizen;
        const { 
            position,
            levelManagement,
            areaManagement 
        } = req.body;
        const politician = await addPolitician(id, { position, levelManagement, areaManagement });
        if(politician) {
            return res.status(200).json({
                status: "success",
                data: politician
            })
        } else {
            return res.status(404).json({
                status: "failed",
                message: "Add politician failed!"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: "Error retrieving politician"
        })
    }
})

politician_router.delete('/:id', [authentication, isAdmin], async (req, res) => {
    try {
        const id = req.params.id;
        const politician = await deleteUserById(id, 'idPolitician', 2);
        if(politician) 
            return res.status(200).json({
                status: "success",
                message: "delete politician successfully!"
            })
        else 
            return res.status(200).json({
                status: "failed",
                message: "delete politician failed!"
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retreing Politician'
        })
    }
})

module.exports = politician_router;