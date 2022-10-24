const bcrypt = require('bcryptjs');
const User = require('../model/user');
const JWT = require('jsonwebtoken');


function generateToken(data) {
    return JWT.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5y",
    });
}


const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(404).json({ message: 'Password incorrect' });
        const token = generateToken(user);
        res.status(200).json({ message: 'Successfully logged in', token: token, user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}


module.exports = {  signIn };