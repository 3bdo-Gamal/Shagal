const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/compRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const studentExp =  require('./src/routes/studentExperienceRoutes');
const student = require('./src/routes/studentRoutes');

const app = express();

app.use(express.json());


app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/student-experience', studentExp);
app.use('/api/company', companyRoutes);
app.use('/api/students', student);




app.get("/", (req, res) => {
  res.send("🚀 API is running. Try /api/auth/login or /api/auth/register");
});




app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use(errorMiddleware);

module.exports = app;
