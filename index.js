const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
require('./models/Products');
sequelize.sync().then(() => console.log('DB connected')).catch(err => console.log(err));

const port = 3437;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.use('/api/products', productRoutes);


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})