const express = require('express');
const app = express();
const productRoutes = require('./routes/products');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 3437;
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/products', productRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})