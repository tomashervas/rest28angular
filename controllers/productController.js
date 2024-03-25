const Product = require("../models/Products");

const getProducts = async (req, res) => {

    try {
        const products = await Product.findAll();
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getProduct = async (req, res) => {

    try {
        const id = +req.params.id
        if (isNaN(id) || id <= 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addProduct = async (req, res) => {

    try {
        const { name, price, description } = req.body;
        if(!name || !price) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        if( isNaN(price)) {
            return res.status(400).json({ message: "Price must be a number" });
        }

        if( price < 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }
        if(name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }
        
        const product = await Product.create({ name, price, description });
        return res.status(201).send(product);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateProduct = async (req, res) => {

    try {
        const { name, price, description } = req.body;
        //update returns an array with the number of affected rows [0] [1]
        const [ updated ] = await Product.update({ name, price, description }, { where: { id: +req.params.id } });
        if (!updated) {
            return res.status(404).send({ message: "Product not found" });
        }
        return res.status(200).send({ message: "Product updated" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteProduct = async (req, res) => {

    try {
        //destroy returns 0 or 1
        const product = await Product.destroy({ where: { id: +req.params.id } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        return res.status(204).send({ message: "Product deleted" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getProducts,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}