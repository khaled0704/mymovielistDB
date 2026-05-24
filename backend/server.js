const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();

const app = express();


app.use(cors());          
app.use(express.json()); 


connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));
app.use('/api/users', require('./routes/users'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});