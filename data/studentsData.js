/**
 * In-memory student data store for HackerEarth Week 07 REST API.
 * Data is maintained in memory and resets when the server restarts.
 */

export const initialStudents = [
  { id: 101, name: 'J Nishanth Bhat', department: 'AIML', semester: 6 },
  { id: 102, name: 'Ananya Rao', department: 'CSE', semester: 6 },
  { id: 103, name: 'Karthik Shenoy', department: 'AIML', semester: 4 },
  { id: 104, name: 'Pooja Hegde', department: 'ECE', semester: 8 },
  { id: 105, name: 'Rahul Verma', department: 'ISE', semester: 2 },
  { id: 106, name: 'Sneha Kulkarni', department: 'CSE', semester: 4 }
];

let students = initialStudents.map((s) => ({ ...s }));

export function getStudents() {
  return students;
}

export function setStudents(newStudents) {
  students = newStudents;
}

export function resetStudents() {
  students = initialStudents.map((s) => ({ ...s }));
  return students;
}
