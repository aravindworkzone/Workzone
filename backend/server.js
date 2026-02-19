const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/auth.router');
const taskRoutes = require('./routers/task.router');
require('dotenv').config();
const connectDB = require('./DB/dbConnect');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes); 
app.use('/api/task', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});