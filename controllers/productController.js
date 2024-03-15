const getProducts = async (req, res) => {

    try {
        const products = [
            {
                id: 1,
                name: 'Product 1'
            },
            {
                id: 2,
                name: 'Product 2'
            }
        ]
        return res.send(products);
    } catch (error) {
        return res.status(404).send(error);
    }
}

module.exports = {
    getProducts
}