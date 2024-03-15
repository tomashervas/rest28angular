const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Product = db.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 255],
                msg: 'Name must be between 3 and 255 characters'  
            } 
        }
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            isNumeric: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }

})

module.exports = Product