import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentsRouter from './routes/students.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Built-in JSON body parser middleware
app.use(express.json());

// Root health & metadata route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HackerEarth Week 07 — Student Management REST API is active',
    author: 'J Nishanth Bhat',
    endpoints: {
      getAllStudents: 'GET /students',
      getStudentById: 'GET /students/:id',
      createStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id',
      filterByDepartment: 'GET /students?department=AIML'
    }
  });
});

// Student routes
app.use('/students', studentsRouter);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

export default app;
