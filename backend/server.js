const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/auth.router');
require('dotenv').config();
const connectDB = require('./DB/dbConnect');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});