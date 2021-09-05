'use strict';

const express = require('express');
//const bcrypt = require('bcrypt');

const router = express.Router();
const { User, Course } = rtequire('../models');


// Async Handler function
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (err) {
        console.log(err);
        if (
          err.name === 'SequelizeValidationError' ||
          err.name === 'SequelizeUniqueConstraintError'
        ) {
          console.log('Error:', err.name);
          const errors = err.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else {
          next(err);
        }
      }
    };
  }

/*User Routes*/

// GET route to return props/values for current authentictaed User
router.get('/users', asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        where: { id: req.currentUser.id },
    });
    res.status(200).json(user);
}));

// POST route to create new User
router.post('/users', asyncHandler(async (req, res) => {
    const newUser = await req.body;
    await User.create(newUser);
    res.status(201).location('/').end();
}));

/*Course Routes*/

// GET route to return all courses 

// GET route to return corresponding course & User

// POST route to create a new course 

// PUT route to update course

// Delete route to delete course