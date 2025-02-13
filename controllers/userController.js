import express from 'express'
import { userModel } from '../models/userModel.js'

export const userController = express.Router()

// Route to list (READ)
userController.get('/users', async (req, res) => {
    try {
        const data = await userModel.findAll({
            attributes: ['id', 'firstname', 'lastname']
        })

        if (!data || data.length === 0) {
            return res.json({ message: 'No data found' })
        }
        res.json(data)
    } catch (error) {
        console.error(`Could not get user list: ${error}`)
    }
})

// Route to details (READ)
userController.get('/users/:id([0-9]*)', async (req, res) => {
    try {
        const { id } = req.params
        const data = await userModel.findOne({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.json({ message: `Could not find user on id #${id}` })
        }

        return res.json(data);

    } catch (error) {
        console.error(`Could not get user details: ${error}`)
    }
})

// Route to create (CREATE)
userController.post('/users', async (req, res) => {
    const { firstname, lastname, email, password, refresh_token, is_active } = req.body;

    if (!firstname || !lastname || !email || !password || !refresh_token || !is_active) {
        return res.json({ message: 'Missing required data' })
    }

    try {
        const result = await userModel.create({
            firstname, lastname, email, password, refresh_token, is_active
        })

        res.status(201).json(result)
    } catch (error) {
        return res.json({ message: `Could not create user: ${error.message}` })
    }
})

// Route to update (UPDATE)
userController.put('/users', async (req, res) => {
    const { id, firstname, lastname, email, password, refresh_token, is_active } = req.body;

    if (!id || !firstname || !lastname || !email || !password || !refresh_token || !is_active) {
        return res.json({ message: 'Missing required data' })
    }

    try {
        const result = await userModel.create({
            firstname, lastname, email, password, refresh_token, is_active
        }, {
            where: { id }
        })

        res.status(201).json(result)
    } catch (error) {
        return res.json({ message: `Could not create user: ${error.message}` })
    }
})

// Route to delete (DELETE)
userController.delete('/users/:id([0-9]*)', async (req, res) => {
    const { id } = req.params
    if(id) {
        try {
            await userModel.destroy({
                where: { id }
            })
            res.send({
                message: `Record #${id} deleted`
            })
        } catch (error) {
            res.send(`Error! Could not delete user: ${error}`)
        }
    } else {
        res.send({
            message: 'Id not valid'
        })
    }
    
    
})