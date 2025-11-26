const mongoose = require('mongoose');

const ProjectItemSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 },
  description: { type: String, maxlength: 1000 },
  technologies: { type: String, maxlength: 300 },
  demoLink: { type: String, maxlength: 250 },
  repoLink: { type: String, maxlength: 250 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProjectItem', ProjectItemSchema);
