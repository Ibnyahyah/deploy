const express = require('express');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
require('dotenv').config();

const User = require('../model/user');


function generateToken(data) {
    return JWT.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5y",
    });
}


const registerAdmin = async (req, res) => {
    let newUser;
    const { name, email, phone, gender, password, role } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.decode(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin') {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'user already exist' });
            const isFirstUser = await User.countDocuments() === 0;
            const _role = isFirstUser ? 'admin' : role;
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt)
            if (isFirstUser) {
                newUser = await User.create({ email, name, phone, password: hashedPassword, role: 'admin' });
            }
            newUser = await User.create({ email, name, phone, gender, password: hashedPassword, role: _role.toLowerCase() });
            res.status(201).json({ message: 'Admin details are:', password: password, email: newUser.email, name: newUser.name, role: newUser.role });
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
};

const adminSignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) return res.status(404).json({ message: 'Password incorrect' });

        const token = generateToken(user);
        res.status(200).json({ message: 'Successfully logged in', token: token, user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const updateAdmin = async (req, res) => {
    const { email, name, phone, role } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const user = await User.findOneAndUpdate(email);
        if (!user) return res.status(401).json({ message: 'User not found' });
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }

}

const getAllAdmins = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin') {
            const users = await User.find();
            res.status(200).json(users);
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error)
    }
}

const getAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin') {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: 'user not found' });
            res.status(200).json(user);
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}



module.exports = { getAdmin, getAllAdmins, adminSignIn, updateAdmin, registerAdmin, };