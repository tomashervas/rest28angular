const Product = require("../models/Products");

const getProducts = async (req, res) => {

    try {
        const products = await Product.findAll();
        return res.status(200).send(products);
    } catch (error) {
        return res.status(404).send(error);
    }
}

const getProduct = async (req, res) => {

    try {
        const product = await Product.findByPk(req.params.id);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(404).send(error);
    }
}

const addProduct = async (req, res) => {

    try {
        const { name, price, description } = req.body;
        const product = await Product.create({ name, price, description });
        return res.status(201).send(product);
    } catch (error) {
        return res.status(404).send(error);
    }
}

const updateProduct = async (req, res) => {

    try {
        const { name, price, description } = req.body;
        const product = await Product.update({ name, price, description }, { where: { id: req.params.id } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        return res.status(200).send({ message: "Product updated" });
    } catch (error) {
        return res.status(404).send(error);
    }
}

const deleteProduct = async (req, res) => {

    try {

        const product = await Product.destroy({ where: { id: req.params.id } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        return res.status(200).send({ message: "Product deleted" });
    } catch (error) {
        return res.status(404).send(error);
    }
}

module.exports = {
    getProducts,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
}