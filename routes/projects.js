const express = require('express');
const ProjectItem = require('../models/ProjectItem');
const router = express.Router();

router.get('/', async (req,res)=>{
  try{
    const projects = await ProjectItem.find().sort({createdAt:-1});
    res.json(projects);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

module.exports = router;
