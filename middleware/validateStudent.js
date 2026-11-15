import { getStudents } from '../data/studentsData.js';

/**
 * Validates that the :id route parameter is a valid positive integer.
 */
export function validateStudentIdParam(req, res, next) {
  const { id } = req.params;

  // Must consist only of digits and convert to an integer > 0
  const isPositiveInt = /^\d+$/.test(id) && Number.isInteger(Number(id)) && Number(id) > 0;

  if (!isPositiveInt) {
    return res.status(400).json({
      success: false,
      error: 'Malformed student ID. ID must be a positive integer.'
    });
  }

  req.parsedStudentId = parseInt(id, 10);
  next();
}

/**
 * Helper to validate common student fields: name, department, semester.
 */
function validateStudentFields(body) {
  const errors = [];
  const { name, department, semester } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Student name is required and must be a non-empty string.');
  }

  if (typeof department !== 'string' || department.trim().length === 0) {
    errors.push('Department is required and must be a non-empty string.');
  }

  const semNum = Number(semester);
  const isValidSemester =
    semester !== undefined &&
    semester !== null &&
    Number.isInteger(semNum) &&
    semNum >= 1 &&
    semNum <= 8;

  if (!isValidSemester) {
    errors.push('Semester is required and must be an integer between 1 and 8.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name: typeof name === 'string' ? name.trim() : name,
      department: typeof department === 'string' ? department.trim() : department,
      semester: semNum
    }
  };
}

/**
 * Validates the body for creating a new student (POST /students).
 * Checks id, name, department, semester, and enforces uniqueness of id.
 */
export function validateCreateStudent(req, res, next) {
  const { id } = req.body;
  const errors = [];

  const idNum = Number(id);
  const isValidId =
    id !== undefined &&
    id !== null &&
    (typeof id === 'number' || typeof id === 'string') &&
    /^\d+$/.test(String(id)) &&
    Number.isInteger(idNum) &&
    idNum > 0;

  if (!isValidId) {
    errors.push('Student ID is required and must be a positive integer.');
  }

  const fieldValidation = validateStudentFields(req.body);
  if (!fieldValidation.isValid) {
    errors.push(...fieldValidation.errors);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student data.',
      details: errors
    });
  }

  // Check for duplicate student ID (HTTP 409 Conflict)
  const students = getStudents();
  const existing = students.find((s) => s.id === idNum);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: `Conflict: Student with ID ${idNum} already exists.`
    });
  }

  req.validatedStudent = {
    id: idNum,
    name: fieldValidation.sanitized.name,
    department: fieldValidation.sanitized.department,
    semester: fieldValidation.sanitized.semester
  };

  next();
}

/**
 * Validates the body for updating an existing student (PUT /students/:id).
 * Requires valid name, department, and semester.
 */
export function validateUpdateStudent(req, res, next) {
  const fieldValidation = validateStudentFields(req.body);

  if (!fieldValidation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student update data.',
      details: fieldValidation.errors
    });
  }

  req.validatedUpdate = {
    name: fieldValidation.sanitized.name,
    department: fieldValidation.sanitized.department,
    semester: fieldValidation.sanitized.semester
  };

  next();
}
