const express = require('express');
const { body, validationResult } = require('express-validator');
const ContactInquiry = require('../models/ContactInquiry');
const router = express.Router();

router.post('/submit', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('subject').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message required')
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try{
    const inquiry = new ContactInquiry(req.body);
    await inquiry.save();
    res.json({ success:true, message: 'Message submitted!' });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, error:'Server error' });
  }
});

module.exports = router;
