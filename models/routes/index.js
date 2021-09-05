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
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
    });
    res.status(200).json({ courses });
}));

// GET route to return corresponding course & User
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { id: req.params.id },
        include: {
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        },
    });
    res.status(200).json({ course });
}));

// POST route to create a new course 
router.post('/courses', asyncHandler(async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.status(201).location(`/courses/${newCourse.id}`).end();
}));


// PUT route to update course
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
        if (course.userId === req.currentUser.id) {
            awaitcourse.update({
                title: req.body.title,
                description: req.body.description,
            });
            res.status(204).end();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(404).json({ message: 'Unable to locate course. Please try again.' });
    }
}));

// Delete route to delete course
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
        if (course.userId === course.currentUser.id) {
            await course.destroy(course);
            res.status(204).end();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(404).json({ message: 'Unable to locate course. Please try again.'});
    }
}));

module.exports = router;

