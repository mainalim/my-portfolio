require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const contactRoutes = require('./routes/contact');
const projectsRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/admin', adminRoutes);

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Server running on http://localhost:${port}`));
