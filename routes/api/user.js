const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
//GET @api/user

router.get('/', (req, res) => {});

//@GET  /api/user/users
//Find all the names which have skill Java. Output should be an array of JSON objects.
router.get('/users', (req, res) => {
  User.find({ skills: 'Java' }).exec((err, resultUsers) => {
    if (err) {
      console.log('Error', err.message);
      res.status(400).send('Error!');
    }

    res.json(resultUsers);
  });
});

//  @GET api/user/ages
//Get all the record which older than 22, and sort by age, old to young.
router.get('/ages', (req, res) => {
  console.log('Get all the record which older than 22, and sort by age, old to young');
  User.find({ age: { $gt: 22 } })
    .sort({ age: -1 })
    .exec((err, resultUsers) => {
      if (err) {
        console.log('Error', err.message);
        res.status(400).send('Error!');
      }

      res.json(resultUsers);
    });
});

// @GET api/user/group
//Group the all the record by skills, output should be one JSON object which key is skills, value should be another object which have sum of people and an array of names. Like: {Java : { sum:2, name: [John, Bill] }…,…}
router.get('/group', (req, res) => {
  let selectedSkill = 'Java';
  User.find({ skills: selectedSkill }).exec((err, resultUsers) => {
    if (err) {
      console.log('Error', err.message);
      res.status(400).send('Error!');
    }
    const rets = resultUsers;

    let sum = 0;
    let name = [];
    let result = {};
    rets.map((obj) => {
      if (obj.skills.includes(selectedSkill)) {
        sum++;
        [name.push(obj.name)];
      }
    });

    Object.assign(result, { [selectedSkill]: { sum }, name });

    res.json(result);
  });
});
//If skills is Java ..JSON Obj would be { Java:{sum:2, name:[John,Bill]}
//If skills is C++ ..JSON Obj would be { C++:{sum:2, name:[John,Elli]}
//If skills is Python ..JSON Obj would be { Python:{sum:1, name:[John]}
//If skills is NodeJS ..JSON Obj would be { NodeJS:{sum:2, name:[Bill,Peter]}
//If skills is React ..JSON Obj would be { React:{sum:1, name:[Bill]}

//FIND USER WITH PARTICULAR ID
router.get('/user/:id', (req, res) => {
  console.log('Getting one user');
  const id = req.params.id;
  User.findOne({ _id: id }).exec((err, resultUser) => {
    if (err) {
      console.log('Error', err.message);
      res.status(400).send('Error!');
    }

    res.json(resultUser);
  });
});

// @POST  /api/user
//Registering user to MondoDB
router.post(
  '/',

  [check('name', 'Name should not be empty').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, skills } = req.body;

    let user = null;

    const userFields = {};

    if (name) userFields.name = name;
    if (age) userFields.age = age;

    if (skills) userFields.skills = skills.split(',').map((skill) => skill.trim());
    try {
      user = new User(userFields);

      await user.save();

      res.send('User Registered');
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
