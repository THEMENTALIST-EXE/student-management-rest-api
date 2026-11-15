import express from 'express';
import { getStudents, setStudents } from '../data/studentsData.js';
import {
  validateStudentIdParam,
  validateCreateStudent,
  validateUpdateStudent
} from '../middleware/validateStudent.js';

const router = express.Router();

/**
 * GET /students
 * Retrieve all students or filter by department (?department=AIML).
 * Search is performed case-insensitively on the backend array.
 */
router.get('/', (req, res) => {
  const allStudents = getStudents();
  const { department } = req.query;

  if (department !== undefined && typeof department === 'string') {
    const trimmedDept = department.trim().toLowerCase();
    const filtered = allStudents.filter(
      (s) => s.department && s.department.toLowerCase() === trimmedDept
    );

    return res.status(200).json({
      success: true,
      filter: { department: department.trim() },
      count: filtered.length,
      data: filtered
    });
  }

  res.status(200).json({
    success: true,
    count: allStudents.length,
    data: allStudents
  });
});

/**
 * GET /students/:id
 * Retrieve a single student by unique ID.
 */
router.get('/:id', validateStudentIdParam, (req, res) => {
  const studentId = req.parsedStudentId;
  const allStudents = getStudents();
  const student = allStudents.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      error: `Student with ID ${studentId} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * POST /students
 * Create a new student record. Requires id, name, department, semester.
 */
router.post('/', validateCreateStudent, (req, res) => {
  const newStudent = req.validatedStudent;
  const allStudents = getStudents();

  allStudents.push(newStudent);
  setStudents(allStudents);

  res.status(201).json({
    success: true,
    message: 'Student created successfully.',
    data: newStudent
  });
});

/**
 * PUT /students/:id
 * Update an existing student's details (name, department, semester).
 * Preserves the original student ID.
 */
router.put('/:id', validateStudentIdParam, validateUpdateStudent, (req, res) => {
  const studentId = req.parsedStudentId;
  const allStudents = getStudents();
  const index = allStudents.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Student with ID ${studentId} not found.`
    });
  }

  const updatedStudent = {
    id: studentId,
    name: req.validatedUpdate.name,
    department: req.validatedUpdate.department,
    semester: req.validatedUpdate.semester
  };

  allStudents[index] = updatedStudent;
  setStudents(allStudents);

  res.status(200).json({
    success: true,
    message: 'Student updated successfully.',
    data: updatedStudent
  });
});

/**
 * DELETE /students/:id
 * Delete a student by ID.
 */
router.delete('/:id', validateStudentIdParam, (req, res) => {
  const studentId = req.parsedStudentId;
  const allStudents = getStudents();
  const index = allStudents.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Student with ID ${studentId} not found.`
    });
  }

  const [deletedStudent] = allStudents.splice(index, 1);
  setStudents(allStudents);

  res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} deleted successfully.`,
    data: deletedStudent,
    student: deletedStudent
  });
});

export default router;
