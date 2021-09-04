'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {

        }
    }

    // User model including first & last name, email & password.
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is a required field',
                },
                notEmpty: {
                    msg: 'Please provide a first name',
                    },
                },
            },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is a required field',
                },
                notEmpty: {
                    msg: 'Please provide a last name',
                    },
                },
            },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email address provided already exists in this system',
            },
            validate: {
                notNull: {
                    msg: 'Email address is a required field',
                },
                isEmail: {
                    msg: 'Please provide a valid email address',
                    },
                },
            },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is a required field',
                },
                notEmpty: {
                    msg: 'Please provide a password',
                    },
                },
            },
        },
    {
        sequelize,
        modelName: 'User',
    }
    );

    //model association
    User.associate = models => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return User;
};