'use strict';

const express = require('express');

const router = express.Router();
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');


// Async Handler function
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

/*USER ROUTES*/

// GET route to return props/values for current authentictaed User
router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        where: { id: req.currentUser.id },
    });
    res.status(200).json(user);
}));

// POST route to create new User
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.location('/').status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

/*COURSE ROUTES*/

// GET route to return all courses 
router.get('/courses', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        }],
    });
    if (courses) {
        res.status(200).json({ courses });
    } else {
        const error = new Error('Unable to locate courses, please try again.');
        error.status = 404;
        next(error);
    }
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
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const user = req.currentUser;
        if (user) {
            const course = await Course.create(req.body);
            res.location(`/courses/${course.id}`).status(201).end();
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }

}));


// PUT route to update course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
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
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
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

