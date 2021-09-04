'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {

        }
    }

    // User model including first & last name, email & password.
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title is a required field',
                },
                notEmpty: {
                    msg: 'Please provide a title',
                    },
                },
            },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Description is a required field',
                },
                notEmpty: {
                    msg: 'Please provide a description',
                    },
                },
            },
        estimatedTime: DataTypes.STRING,
        materialsNeeded: DataTypes.STRING,

        },
    {
        sequelize,
        modelName: 'Course',
    }
    );

    //model association
    Course.associate = models => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
};