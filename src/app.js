const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');  // Import cors package
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());  // Enable CORS for all routes

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.json()); 

app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
