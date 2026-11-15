import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { resetStudents, getStudents } from '../data/studentsData.js';

describe('HackerEarth Week 07 — Student Management REST API Tests', () => {
  beforeEach(() => {
    // Reset in-memory student store to initial state before each test
    resetStudents();
  });

  // 1. Root and metadata
  describe('GET / (API Status)', () => {
    it('should return 200 with API status and endpoint catalog', async () => {
      const res = await request(app).get('/');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.endpoints);
      assert.equal(res.body.author, 'J Nishanth Bhat');
    });
  });

  // 2. GET /students
  describe('GET /students (All students)', () => {
    it('should retrieve all students with HTTP 200', async () => {
      const res = await request(app).get('/students');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.equal(res.body.data.length, 6);
      assert.equal(res.body.count, 6);
    });
  });

  // 3. Department filtering (Bonus)
  describe('GET /students?department=... (Department Filtering)', () => {
    it('should filter students by department case-insensitively (AIML)', async () => {
      const res = await request(app).get('/students?department=aiml');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.equal(res.body.count, 2);
      res.body.data.forEach((student) => {
        assert.equal(student.department.toUpperCase(), 'AIML');
      });
    });

    it('should filter students by department (CSE)', async () => {
      const res = await request(app).get('/students?department=CSE');
      assert.equal(res.status, 200);
      assert.equal(res.body.count, 2);
      res.body.data.forEach((student) => {
        assert.equal(student.department, 'CSE');
      });
    });

    it('should return empty list when department has no students', async () => {
      const res = await request(app).get('/students?department=NONEXISTENT');
      assert.equal(res.status, 200);
      assert.equal(res.body.count, 0);
      assert.deepEqual(res.body.data, []);
    });
  });

  // 4. GET /students/:id
  describe('GET /students/:id', () => {
    it('should return student by valid existing ID (HTTP 200)', async () => {
      const res = await request(app).get('/students/101');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 101);
      assert.equal(res.body.data.name, 'J Nishanth Bhat');
      assert.equal(res.body.data.department, 'AIML');
      assert.equal(res.body.data.semester, 6);
    });

    it('should return 404 for nonexistent student ID', async () => {
      const res = await request(app).get('/students/9999');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /not found/i);
    });

    it('should return 400 for malformed string ID (e.g. /students/abc)', async () => {
      const res = await request(app).get('/students/abc');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /positive integer/i);
    });

    it('should return 400 for negative or zero ID (e.g. /students/-5)', async () => {
      const res = await request(app).get('/students/-5');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 5. POST /students
  describe('POST /students (Create student)', () => {
    it('should create a valid student and return HTTP 201', async () => {
      const newStudent = {
        id: 107,
        name: 'Aditi Rao',
        department: 'ISE',
        semester: 3
      };
      const res = await request(app).post('/students').send(newStudent);
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.deepEqual(res.body.data, newStudent);

      // Verify student was added to in-memory store
      const students = getStudents();
      const found = students.find((s) => s.id === 107);
      assert.ok(found);
      assert.equal(found.name, 'Aditi Rao');
    });

    it('should return 409 Conflict when creating with duplicate ID', async () => {
      const duplicateStudent = {
        id: 101, // Already exists
        name: 'Duplicate Person',
        department: 'CSE',
        semester: 2
      };
      const res = await request(app).post('/students').send(duplicateStudent);
      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /already exists/i);
    });

    it('should return 400 when missing name', async () => {
      const invalid = { id: 108, department: 'AIML', semester: 4 };
      const res = await request(app).post('/students').send(invalid);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when missing department', async () => {
      const invalid = { id: 108, name: 'Test Student', semester: 4 };
      const res = await request(app).post('/students').send(invalid);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when semester is out of 1-8 range (e.g. semester 9)', async () => {
      const invalid = {
        id: 108,
        name: 'Test Student',
        department: 'AIML',
        semester: 9
      };
      const res = await request(app).post('/students').send(invalid);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when semester is 0 or negative', async () => {
      const invalid = {
        id: 108,
        name: 'Test Student',
        department: 'AIML',
        semester: 0
      };
      const res = await request(app).post('/students').send(invalid);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when ID is invalid or negative', async () => {
      const invalid = {
        id: -1,
        name: 'Test Student',
        department: 'AIML',
        semester: 4
      };
      const res = await request(app).post('/students').send(invalid);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 6. PUT /students/:id
  describe('PUT /students/:id (Update student)', () => {
    it('should update an existing student and return HTTP 200, preserving ID', async () => {
      const updateData = {
        name: 'J Nishanth Bhat (Updated)',
        department: 'AIML-Advanced',
        semester: 7
      };
      const res = await request(app).put('/students/101').send(updateData);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 101);
      assert.equal(res.body.data.name, 'J Nishanth Bhat (Updated)');
      assert.equal(res.body.data.department, 'AIML-Advanced');
      assert.equal(res.body.data.semester, 7);

      // Verify in-memory store reflection
      const students = getStudents();
      const updated = students.find((s) => s.id === 101);
      assert.equal(updated.semester, 7);
      assert.equal(updated.name, 'J Nishanth Bhat (Updated)');
    });

    it('should ignore attempted ID changes and preserve original ID', async () => {
      const updateData = {
        id: 999, // Attempted ID modification
        name: 'J Nishanth Bhat',
        department: 'AIML',
        semester: 8
      };
      const res = await request(app).put('/students/101').send(updateData);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.id, 101); // Original ID preserved
    });

    it('should return 404 when updating nonexistent student', async () => {
      const updateData = {
        name: 'Ghost Student',
        department: 'CSE',
        semester: 5
      };
      const res = await request(app).put('/students/9999').send(updateData);
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when update payload has invalid semester', async () => {
      const invalidData = {
        name: 'J Nishanth Bhat',
        department: 'AIML',
        semester: 12
      };
      const res = await request(app).put('/students/101').send(invalidData);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when update payload has empty name', async () => {
      const invalidData = {
        name: '   ',
        department: 'AIML',
        semester: 6
      };
      const res = await request(app).put('/students/101').send(invalidData);
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('should return 400 when :id param is malformed', async () => {
      const res = await request(app).put('/students/invalid-id').send({
        name: 'Valid Name',
        department: 'AIML',
        semester: 6
      });
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 7. DELETE /students/:id
  describe('DELETE /students/:id (Delete student)', () => {
    it('should delete existing student and return HTTP 200 with deleted student details', async () => {
      const res = await request(app).delete('/students/102');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 102);
      assert.equal(res.body.student.id, 102);
      assert.match(res.body.message, /deleted successfully/i);

      // Verify removal from in-memory store
      const students = getStudents();
      assert.equal(students.find((s) => s.id === 102), undefined);
      assert.equal(students.length, 5);
    });

    it('should return 404 when deleting nonexistent student', async () => {
      const res = await request(app).delete('/students/9999');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /not found/i);
    });

    it('should return 400 when deleting with malformed ID', async () => {
      const res = await request(app).delete('/students/xyz');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });
  });

  // 8. Error handling & Malformed JSON
  describe('Middleware & Error Handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/unknown-api-endpoint');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /not found/i);
    });

    it('should return 400 for malformed JSON body', async () => {
      const res = await request(app)
        .post('/students')
        .set('Content-Type', 'application/json')
        .send('{ "id": 108, "name": "Broken JSON, }'); // Malformed JSON

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /malformed json/i);
    });
  });
});
