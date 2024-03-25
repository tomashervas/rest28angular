const app = require('../app');
const request = require('supertest');
const Product = require('../models/Products');

const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
]

jest.mock('../config/db', () => ({
    sync: jest.fn().mockResolvedValue(true)
}));

jest.mock('../models/Products', () => {
    return {
        findAll: jest.fn(() =>products),
        findByPk: jest.fn((id) => products.find(product => product.id === id)),
        // findByPk: jest.fn(() => products[0]),
        create: jest.fn((product) => ({ ...product, id: 3 })),
        update: jest.fn((body, {where}) => {
            const id = where.id
            // console.log(body)
            // console.log(where.id)
            const product = products.find(product => product.id === id);
            
            if(!product) return [0]

            return [1];
        }),
        destroy: jest.fn(({where}) => {
            console.log(where.id)
            const product = products.find(product => product.id === where.id);
            if(!product) return 0
            return 1;
        }),
    }
});


describe('GET /api/products', () => {

    it('should return status 200', async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
    })

    it('should return an array of products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.body).toHaveLength(2);
    })

    it('should return status 500 with "Internal Server Error" when throw error', async () => {
        jest.spyOn(Product, 'findAll').mockRejectedValue (new Error('Error'));
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(500);
        expect(response.text).toEqual(JSON.stringify({ error: 'Internal Server Error' }));
    })


})

describe('GET /api/products/:id', () => {

    it('should return status 200', async () => {
        const response = await request(app).get('/api/products/1');
        expect(response.statusCode).toBe(200);
    })

    it('should return a product with id 1', async () => {
        const response = await request(app).get('/api/products/1');
        expect(response.body).toEqual({ id: 1, name: 'Product 1', price: 100 });
    })

    it('should return status 404 when product not found', async () => {
        const response = await request(app).get('/api/products/20');
        expect(response.statusCode).toBe(404);
    })

    it('should return status 404 when id is not a number', async () => {
        const response = await request(app).get('/api/products/a');
        expect(response.statusCode).toBe(404);
    })

    it('should return status 404 when id is negative', async () => {
        const response = await request(app).get('/api/products/-1');
        expect(response.statusCode).toBe(404);
    })
    it('shold return status 500 with "Internal Server Error" when throw error', async () => {
        jest.spyOn(Product, 'findByPk').mockRejectedValue (new Error('Error'));
        const response = await request(app).get('/api/products/1');
        expect(response.statusCode).toBe(500);
        expect(response.text).toEqual(JSON.stringify({ error: 'Internal Server Error' }));
        // expect(response.text).toBe('Internal Server Error');
    })


})

describe('POST /api/products', () => {

    it('should return status 201', async () => {
        const response = await request(app).post('/api/products').send({ name: 'Product 3', price: 300 });
        expect(response.statusCode).toBe(201);
    })

    it('should return status 400 with "Name and price are required" when name is empty', async () => {
        const response = await request(app).post('/api/products').send({ name: '', price: 300 });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(JSON.stringify({ message: 'Name and price are required' }));
    })

    it('should return status 400 with "Price must be a number" when price is not a number', async () => {
        const response = await request(app).post('/api/products').send({ name: 'Product 3', price: 'a' });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(JSON.stringify({ message: 'Price must be a number' }));
    })

    it('should return status 400 with "Price must be greater than 0" when price is less than 0', async () => {
        const response = await request(app).post('/api/products').send({ name: 'Product 3', price: -1 });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(JSON.stringify({ message: 'Price must be greater than 0' }));
    })

    it('should return status 400 with "Name must be at least 3 characters long" when name is less than 3 characters', async () => {
        const response = await request(app).post('/api/products').send({ name: 'Pr', price: 300 });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual(JSON.stringify({ message: 'Name must be at least 3 characters long' }));
    })

    it('should return a product with id 3', async () => {
        const response = await request(app).post('/api/products').send({ name: 'Product 3', price: 300 });
        expect(response.body).toEqual({ id: 3, name: 'Product 3', price: 300 });
    })

    it('should return status 500 with "Internal Server Error" when throw error', async () => {
        jest.spyOn(Product, 'create').mockRejectedValue (new Error('Error'));
        const response = await request(app).post('/api/products').send({ name: 'Product 3', price: 300 });
        expect(response.statusCode).toBe(500);
        expect(response.text).toEqual(JSON.stringify({ error: 'Internal Server Error' }));
    })
    
})

describe('PUT /api/products/:id', () => {

    it('should return status 404 when product not found', async () => {
        const response = await request(app).put('/api/products/20').send({ name: 'Product 1', price: 200 });
        expect(response.statusCode).toBe(404);
    })

    it('should return status 200', async () => {
        const response = await request(app).put('/api/products/2').send({ name: 'Product 1', price: 200 });
        expect(response.statusCode).toBe(200);
    })

    it('should return "Product updated" when success', async () => {
        const response = await request(app).put('/api/products/2').send({ name: 'Product 1', price: 200 });
        expect(response.text).toEqual(JSON.stringify({ message: 'Product updated' }));
    })

    it('should return status 500 with "Internal Server Error" when throw error', async () => {
        jest.spyOn(Product, 'update').mockRejectedValue (new Error('Error'));
        const response = await request(app).put('/api/products/1').send({ name: 'Product 2', price: 300 });
        expect(response.statusCode).toBe(500);
        expect(response.text).toEqual(JSON.stringify({ error: 'Internal Server Error' }));
    })


})

describe('DELETE /api/products/:id', () => {

    it('should return status 404 when product not found', async () => {
        const response = await request(app).delete('/api/products/20');
        expect(response.statusCode).toBe(404);
    })

    it('should return status 204', async () => {
        const response = await request(app).delete('/api/products/2');
        expect(response.statusCode).toBe(204);
    })

    it('should return status 500 with "Internal Server Error" when throw error', async () => {
        jest.spyOn(Product, 'destroy').mockRejectedValue (new Error('Error'));
        const response = await request(app).delete('/api/products/1');
        expect(response.statusCode).toBe(500);
        expect(response.text).toEqual(JSON.stringify({ error: 'Internal Server Error' }));
    })
 })

