const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { check, validationResult } = require('express-validator');
const User = require('../models/User.model');
const Contact = require('../models/Contact.Models');

//@route GET api/contacts
//@desc  Get all users contacts
//@access Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/contacts
//@desc  Add new contact
//@access Private
router.post(
  '/',
  [authMiddleware, [check('name', 'Name is required ').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route PUT api/contacts/:id
//@desc  Update contact
//@access Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build contact object
  const conatctFields = {};
  if (name) conatctFields.name = name;
  if (email) conatctFields.email = email;
  if (phone) conatctFields.phone = phone;
  if (type) conatctFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    //Make sure user owns conatct
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: conatctFields },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

//@route DELETE api/contacts/:id
//@desc  Delete contact
//@access Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    //Make sure user owns conatct
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Conatct removed' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
