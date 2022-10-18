const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// router 
const UserRoute = require('./routes/user');
const OrderRoute = require('./routes/order');
const AdminRoute = require('./routes/admin');

// configuration
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/user', UserRoute);
app.use('/api/order', OrderRoute);
app.use('/api/admin', AdminRoute);

app.get('/', (req, res) => {
    res.send("<h1 style=\"text-align:center; color:seagreen;\">Server Running....</h1>")
});


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => console.log("Server Running on port " + PORT))).catch(err => console.error(err));