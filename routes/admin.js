const express = require('express');
const ContactInquiry = require('../models/ContactInquiry');
const router = express.Router();

function checkAdmin(req,res,next){
  const secret = process.env.ADMIN_SECRET;
  const provided = req.query.secret || req.headers['x-admin-secret'];
  if(provided && provided === secret) return next();
  return res.status(401).send('Unauthorized');
}

router.get('/inquiries', checkAdmin, async (req,res)=>{
  const inquiries = await ContactInquiry.find().sort({createdAt:-1}).lean();
  res.render('admin_inquiries',{ inquiries });
});

module.exports = router;
