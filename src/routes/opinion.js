const express = require('express');
const { getOpinions, deleteOpinion, addOpinion } = require('../database/query/opinionQuery');
const opinion_router = express.Router();

opinion_router.get('/', async (req, res) => {
    try {
        const page_Size = parseInt(req.query.pageSize) || 10;
        const { page = 1, type = 'idCitizen', data='' } = req.body;

        const { opinions, totalPage, totalPageData } = await getOpinions(
            page,
            page_Size,
            type,
            data,
        );

        return res.status(200).json({
            status: 'success',
            data: opinions,
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
})

opinion_router.post('/', async (req, res) => {
    try {
        const { idCitizen, content } = req.body
        const opinion = await addOpinion({ idCitizen, content });
        if(opinion)
            return res.status(200).json({
                status: 'success',
                message: 'Add opinion successfully!'
            })
        else 
            return res.status(200).json({
                status: 'failed',
                data: opinion
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
})

opinion_router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const opinion = await deleteOpinion(id);
        if(opinion)
            return res.status(200).json({
                status: 'success',
                message: 'Delete opinion failed!'
            })
        else 
            return res.status(200).json({
                status: 'failed',
                message: 'Delete opinion failed!'
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retrieving users',
        });
    }
})



module.exports = opinion_router