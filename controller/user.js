const express = require('express');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const User = require('../model/user');


function generateToken(data) {
    return JWT.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5y",
    });
}


const signUp = async (req, res) => {
    let newUser;
    const { name, email, phone, agentCode, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'user already exist' });
        const isFirstUser = await User.countDocuments() === 0;
        const role = isFirstUser ? 'admin' : 'user';
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt)
        if (isFirstUser) {
            newUser = await User.create({ email, name, phone, password: hashedPassword, role: 'admin' });
        }
        newUser = await User.create({ email, name, phone, agentCode, password: hashedPassword, role });
        const token = generateToken(newUser);
        res.status(201).json({ message: 'user created successfully', token: token, user: newUser });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
};

const signIn = async (req, res) => {
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

const updateUser = async (req, res) => {
    const { email, name, phone } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    try {
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const user = await User.findOneAndUpdate(email);
        if (!user) return res.status(401).json({ message: 'User not found' });
        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }

}

const getUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error)
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const user = await User.findById({ id });
        if (!user) return res.status(404).json({ message: 'user not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}



module.exports = { getUser, getUsers, signIn, updateUser, signUp, };