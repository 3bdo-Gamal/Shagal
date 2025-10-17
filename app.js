const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./BackEnd/src/middlewares/errorMiddleware');
const authRoutes = require('./BackEnd/src/routes/authRoutes');
const employee = require('./BackEnd/src/routes/employeeRoutes');
const jobRoutes = require('./BackEnd/src/routes/jobRoutes');
const users = require('./BackEnd/src/routes/userRoutes');
const stuExp = require('./BackEnd/src/routes/studentExperienceRoutes');
const adminRoutes = require("./BackEnd/src/routes/adminRoutes");

const app = express();


app.use(express.json());
app.use(helmet());


const allowedOrigins = [
  process.env.CLIENT_URL 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', users);
app.use('/api/employee', employee);
app.use('/api/stuExp', stuExp);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API is running. Try /api/auth/login or /api/auth/register");
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use(errorMiddleware);

module.exports = app;
