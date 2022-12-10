const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// router
const OrderRoute = require('./routes/order');
const AdminRoute = require('./routes/admin');
const ProductRoute = require('./routes/product');
const StockRoute = require('./routes/stock');
const analyticsRoute = require('./routes/analytics');
const usersRoute = require('./routes/user');

// configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/order', OrderRoute);
app.use('/api/admin', AdminRoute);
app.use('/api/admin/user', usersRoute);
app.use('/api/product', ProductRoute);
app.use('/api/stock', StockRoute);
app.use('/api/', analyticsRoute);

app.get('/', (req, res) => {
    res.send("<h1 style=\"text-align:center; color:seagreen;\">Server Running....</h1>")
});


const PORT = process.env.PORT || 3033;

mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => console.log("Server Running on port " + PORT))).catch(err => console.error(err));