const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/auth.router');
const taskRoutes = require('./routers/task.router');
require('dotenv').config();
const connectDB = require('./DB/dbConnect');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();

app.use(cors({
    origin: [
      'https://remarkable-florentine-098b4f.netlify.app'
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes); 
app.use('/api/task', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});