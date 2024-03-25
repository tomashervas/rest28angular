const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const cors = require('cors');
const db = require('./config/db');
require('./models/Products');
db.sync().then(() => console.log('DB connected')).catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use('/api/products', productRoutes);

module.exports = app