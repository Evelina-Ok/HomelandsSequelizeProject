import express from 'express'
import { staffModel } from '../models/staffModel.js'

export const staffController = express.Router()

// Route to list (READ)
staffController.get('/staffs', async (req, res) => {
    try {
        const data = await staffModel.findAll({
            attributes: ['id', 'firstname', 'lastname']
        })

        if (!data || data.length === 0) {
            return res.json({ message: 'No data found' })
        }
        res.json(data)
    } catch (error) {
        console.error(`Could not get staff list: ${error}`)
    }
})

// Route to details (READ)
staffController.get('/staffs/:id([0-9]*)', async (req, res) => {
    try {
        const { id } = req.params
        const data = await staffModel.findOne({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.json({ message: `Could not find staff on id #${id}` })
        }

        return res.json(data);

    } catch (error) {
        console.error(`Could not get staff details: ${error}`)
    }
})

// Route to create (CREATE)
staffController.post('/staffs', async (req, res) => {
    const { firstname, lastname, position, image, phone, email } = req.body;

    if (!firstname || !lastname || !email || !position || !image || !phone) {
        return res.json({ message: 'Missing required data' })
    }

    try {
        const result = await staffModel.create({
            firstname, lastname, position, image, phone, email
        })

        res.status(201).json(result)
    } catch (error) {
        return res.json({ message: `Could not create staff: ${error.message}` })
    }
})

// Route to update (UPDATE)
staffController.put('/staffs', async (req, res) => {
    const { id, firstname, lastname, email, position, image, phone } = req.body;

    if (!id || !firstname || !lastname || !email || !position || !image || !phone) {
        return res.json({ message: 'Missing required data' })
    }

    try {
        const result = await staffModel.create({
            firstname, lastname, email, position, image, phone
        }, {
            where: { id }
        })

        res.status(201).json(result)
    } catch (error) {
        return res.json({ message: `Could not create staff: ${error.message}` })
    }
})

// Route to delete (DELETE)
staffController.delete('/staffs/:id([0-9]*)', async (req, res) => {
    const { id } = req.params
    if(id) {
        try {
            await staffModel.destroy({
                where: { id }
            })
            res.send({
                message: `Record #${id} deleted`
            })
        } catch (error) {
            res.send(`Error! Could not delete staff: ${error}`)
        }
    } else {
        res.send({
            message: 'Id not valid'
        })
    }
    
    
})