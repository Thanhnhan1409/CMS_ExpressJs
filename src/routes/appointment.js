const express = require('express');
const appointment_router = express.Router();
const authentication = require('../middleware/authentication')
const { getAppointments, getAppointmentsByData, addAppointment, updateAppointment, deleteAppointment } = require('../database/query/appointmentQuery');
const { isPolitician } = require('../middleware/authorization');

appointment_router.get('/', authentication, async(req, res) => {
    try {
        const page_Size = parseInt(req.query.pageSize) || 10;
        const { page = 1, type = 'idAppointment', data ='' } = req.body;

        const { appointments, totalPage, totalPageData } = await getAppointments(
            page,
            page_Size,
            type,
            data,
        );
        return res.status(200).json({
            status: 'success',
            data: appointments,
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
            status: "failed",
            message: 'Error retrieving appointments',
        })
    }
})

appointment_router.get('/:type/:data', [authentication, isPolitician],  async (req, res) => {
    try {
        const data = req.params.data;
        const type = req.params.type;
        const appointment = await getAppointmentsByData(type, data);
        if(appointment){
            return res.status(200).json({
                status: "success",
                data: appointment
            })
        } else {
            return res.status(404).json({
                status: "failed",
                message: "Not found Appointment"
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            message: 'Error retrieving appointments',
        })
    }
})

appointment_router.post('/', authentication, async (req, res) => {
    try {
        const { 
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        } = req.body;
        const appointment = await addAppointment({
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description
        })
        if(appointment) {
            return res.status(200).json({
                status: 'success',
                data: appointment
            })
        }
        return res.status(400).json({
            status: 'failed',
            message: "Add Appointment failed"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            message: 'Error retrieving appointments',
        })
    }
})

appointment_router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { 
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description 
        } = req.body;

        const appointment = await updateAppointment(id, { 
            idCitizen,
            idPolitician,
            appointmentDate,
            startTime,
            endTime,
            description 
        });
        if (appointment) {
            return res.status(200).json({
                status: 'success',
                data: appointment
            })
        }
        return res.status(400).json({
            status: 'failed',
            message: 'Update Appointment Failed'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retreing appointment'
        })
    }
})

appointment_router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await deleteAppointment(id);
        if(appointment) {
            return res.status(200).json({
                status: 'success',
                message: 'Delete Appointment successfully!'
            })
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'Delete Appointment failed!'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Error retreing Appointment'
        })
    }
})



module.exports = appointment_router