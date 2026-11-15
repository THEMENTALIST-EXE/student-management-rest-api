# Student Management REST API — HackerEarth Week 07

> **HackerEarth Web Development Challenge — Week 07 Assignment**  
> **Author:** J Nishanth Bhat  
> **Institution:** NMAM Institute of Technology, Nitte  
> **Repository:** `student-management-rest-api`

---

## 📌 Project Overview & Objectives

This project is the complete submission for the **HackerEarth Week 07 Full-Stack Web Development Assignment** (30 leaderboard points). It implements a fully compliant, modular, and robust **RESTful Student Management API** built with **Node.js** and **Express.js**, accompanied by an interactive frontend dashboard integrated into Nishanth's developer portfolio.

### Key Objectives:
- Implement all 5 core RESTful CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
- Implement the bonus requirement: **Case-insensitive search and filtering by department** (`GET /students?department=AIML`) handled strictly on the backend in-memory array.
- Follow enterprise REST conventions: modular routing (`express.Router()`), input validation middleware, centralized error handling, and consistent JSON response schemas.
- Provide comprehensive automated tests using Node.js's native test runner and Supertest.
- Supply a complete Postman collection for manual and automated API exploration.

---

## 🛠 Technologies Used

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4.21.2)
- **Middleware:** `cors`, `express.json()`
- **Testing:** Native Node.js Test Runner (`node:test`, `node:assert/strict`) & Supertest
- **Environment Management:** `dotenv`
- **Frontend Integration:** React 19, Vite, Vanilla CSS (in developer portfolio)

---

## 📊 Student Data Model

Students are stored in an in-memory JavaScript array. Each record strictly conforms to:

| Field | Type | Rules & Validation |
| :--- | :--- | :--- |
| `id` | Integer | Required, unique, positive integer (`> 0`). Enforced on `POST`; preserved on `PUT`. |
| `name` | String | Required, non-empty trimmed string. |
| `department` | String | Required, non-empty trimmed string (e.g., `AIML`, `CSE`, `ECE`, `ISE`). |
| `semester` | Integer | Required, integer between `1` and `8` inclusive. |

> ⚠️ **Important In-Memory Notice:**  
> As mandated by the assignment guidelines, student records are stored in an in-memory JavaScript array without an external database. Therefore, **any added, modified, or deleted records will reset to the initial seed data whenever the Express server process restarts**.

---

## 📁 Folder Structure

```text
week07-student-management-api/
├── app.js                          # Express application initialization & middleware
├── server.js                       # Server entry point (starts listener on PORT)
├── .env.example                    # Template environment variables
├── .gitignore                      # Git ignore patterns
├── package.json                    # Project metadata, scripts, and dependencies
├── postman_collection.json         # Complete Postman Collection v2.1
├── README.md                       # Comprehensive API documentation
├── data/
│   └── studentsData.js             # In-memory student array and state reset helpers
├── middleware/
│   ├── errorHandler.js             # Centralized 404 and global error handlers
│   └── validateStudent.js          # Param and request body validators (400 / 409)
├── routes/
│   └── students.js                 # Modular router for all /students endpoints
└── tests/
    └── students.test.js            # Automated test suite (27 tests covering all cases)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (version 18.0.0 or higher recommended; developed and tested on Node v24.18.1)
- npm (version 9+)

### 1. Clone & Navigate to Backend
```bash
git clone https://github.com/THEMENTALIST-EXE/developer-profile.git
cd developer-profile/week07-student-management-api
```

*(Or navigate into the standalone `student-management-rest-api` repository directory).*

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
```

### 4. Start the Express Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
The server will start at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/`

---

## 🖥 Running with the React Portfolio Frontend

To run the full-stack system locally:

1. **Terminal 1 — Express Backend:**
   ```bash
   cd week07-student-management-api
   npm start
   ```
   *(Running on port `5000`)*

2. **Terminal 2 — React Portfolio Frontend:**
   ```bash
   cd developer-profile
   npm run dev
   ```
   *(Running on Vite at `http://localhost:5173`)*

3. Open your browser to `http://localhost:5173/developer-profile/` (or click the local link output by Vite).  
   Click the **Student API** navigation link to interact with the live dashboard!

---

## 📡 API Endpoints & Documentation

All responses use a consistent JSON format:
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "data": ...
}
```

### 1. `GET /` — Health & API Directory
- **Method:** `GET`
- **Description:** Verifies server health and returns a catalog of endpoints and author metadata.
- **Status:** `200 OK`

---

### 2. `GET /students` — Retrieve All Students
- **Method:** `GET`
- **Description:** Retrieves all students in the in-memory array.
- **Status:** `200 OK`
- **Response Example:**
  ```json
  {
    "success": true,
    "count": 6,
    "data": [
      {
        "id": 101,
        "name": "J Nishanth Bhat",
        "department": "AIML",
        "semester": 6
      },
      {
        "id": 102,
        "name": "Ananya Rao",
        "department": "CSE",
        "semester": 6
      }
    ]
  }
  ```

---

### 3. `GET /students?department=AIML` — Filter by Department (Bonus)
- **Method:** `GET`
- **Description:** Case-insensitive search filtering students by department on the backend.
- **Query Params:** `department` (string)
- **Status:** `200 OK`
- **Response Example (`GET /students?department=aiml`):**
  ```json
  {
    "success": true,
    "filter": { "department": "aiml" },
    "count": 2,
    "data": [
      { "id": 101, "name": "J Nishanth Bhat", "department": "AIML", "semester": 6 },
      { "id": 103, "name": "Karthik Shenoy", "department": "AIML", "semester": 4 }
    ]
  }
  ```

---

### 4. `GET /students/:id` — Retrieve Student by ID
- **Method:** `GET`
- **Params:** `id` (positive integer)
- **Responses:**
  - `200 OK`: Student found.
    ```json
    {
      "success": true,
      "data": {
        "id": 101,
        "name": "J Nishanth Bhat",
        "department": "AIML",
        "semester": 6
      }
    }
    ```
  - `400 Bad Request`: Malformed ID (non-numeric, negative, or zero).
    ```json
    { "success": false, "error": "Malformed student ID. ID must be a positive integer." }
    ```
  - `404 Not Found`: Student ID does not exist.
    ```json
    { "success": false, "error": "Student with ID 9999 not found." }
    ```

---

### 5. `POST /students` — Create New Student
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "id": 107,
    "name": "Aditi Rao",
    "department": "ISE",
    "semester": 3
  }
  ```
- **Responses:**
  - `201 Created`: Student successfully added.
    ```json
    {
      "success": true,
      "message": "Student created successfully.",
      "data": {
        "id": 107,
        "name": "Aditi Rao",
        "department": "ISE",
        "semester": 3
      }
    }
    ```
  - `400 Bad Request`: Validation failure (missing fields, invalid semester, negative ID).
  - `409 Conflict`: Student with given ID already exists.
    ```json
    { "success": false, "error": "Conflict: Student with ID 101 already exists." }
    ```

---

### 6. `PUT /students/:id` — Update Existing Student
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Params:** `id` (positive integer)
- **Request Body:**
  ```json
  {
    "name": "J Nishanth Bhat",
    "department": "AIML",
    "semester": 7
  }
  ```
- **Responses:**
  - `200 OK`: Student updated successfully. Note: `id` is immutable and preserved from the URL param.
  - `400 Bad Request`: Invalid fields (e.g., semester not 1-8 or empty name) or malformed ID.
  - `404 Not Found`: Student ID does not exist.

---

### 7. `DELETE /students/:id` — Delete Student
- **Method:** `DELETE`
- **Params:** `id` (positive integer)
- **Responses:**
  - `200 OK`: Student deleted successfully. Returns confirmation message and deleted record.
    ```json
    {
      "success": true,
      "message": "Student with ID 102 deleted successfully.",
      "data": {
        "id": 102,
        "name": "Ananya Rao",
        "department": "CSE",
        "semester": 6
      },
      "student": {
        "id": 102,
        "name": "Ananya Rao",
        "department": "CSE",
        "semester": 6
      }
    }
    ```
  - `400 Bad Request`: Malformed ID.
  - `404 Not Found`: Student does not exist.

---

## 🚦 HTTP Status Codes Summary

| Code | Status | Meaning in this API |
| :---: | :--- | :--- |
| `200` | OK | Successful GET, PUT, or DELETE request. |
| `201` | Created | Successfully created a new student via POST. |
| `400` | Bad Request | Validation error, malformed ID, or malformed JSON payload. |
| `404` | Not Found | Target student ID or requested endpoint does not exist. |
| `409` | Conflict | Attempted to insert a student with an already existing ID. |
| `500` | Server Error | Unhandled server exception (stack traces suppressed in production). |

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite written with Node.js's native test runner and Supertest.

### Run Automated Tests
```bash
npm test
```

### Verified Scenarios (27 Test Cases Passing):
- ✔ API Root metadata & health check
- ✔ GET all students (HTTP 200, count check)
- ✔ Department filtering bonus (case-insensitive `AIML`, `CSE`, and non-existent filter)
- ✔ GET student by valid ID
- ✔ GET student by nonexistent ID (404)
- ✔ GET student with malformed string ID (`/students/abc` -> 400)
- ✔ GET student with negative ID (`/students/-5` -> 400)
- ✔ POST valid student (HTTP 201)
- ✔ POST duplicate student ID (HTTP 409 Conflict)
- ✔ POST missing student name (400)
- ✔ POST missing department (400)
- ✔ POST semester out of range (> 8 or < 1 -> 400)
- ✔ POST invalid ID format (400)
- ✔ PUT update student (HTTP 200, preserves original ID)
- ✔ PUT attempted ID mutation ignored (ID immutable)
- ✔ PUT nonexistent student (404)
- ✔ PUT invalid semester (400)
- ✔ PUT empty name (400)
- ✔ PUT malformed ID parameter (400)
- ✔ DELETE existing student (HTTP 200 with deleted student details)
- ✔ DELETE nonexistent student (404)
- ✔ DELETE malformed ID (400)
- ✔ 404 for unknown API endpoints
- ✔ 400 for malformed JSON request bodies

---

## 📬 Postman & Thunder Client Testing

A ready-to-import Postman collection is located at:
`postman_collection.json`

### To use in Postman:
1. Open Postman -> Click **Import**.
2. Select or drag-and-drop `week07-student-management-api/postman_collection.json`.
3. The collection includes 14 preconfigured requests organized by operation and error scenario, using the collection variable `{{baseUrl}}` (defaults to `http://localhost:5000`).

---

## 🚀 Deployment Guide (Node.js Hosting)

To deploy this Express API to a cloud host (such as Render, Railway, Fly.io, or Heroku):

1. **Host Environment Variables:**
   - `PORT`: provided automatically by most platforms (Express falls back to `process.env.PORT`).
   - `NODE_ENV`: set to `production`.
2. **Start Command:**
   ```bash
   node server.js
   ```
3. **CORS:** Configured for cross-origin access so the deployed GitHub Pages portfolio can communicate with the backend.
4. **Connecting the Frontend:** Set `VITE_API_BASE_URL` in the frontend environment (e.g. `https://my-student-api.onrender.com`) before building Vite. When no live API is reachable, the frontend gracefully displays an **API Offline** status with setup instructions.

---

## 👤 Author
**J Nishanth Bhat**  
- GitHub: [@THEMENTALIST-EXE](https://github.com/THEMENTALIST-EXE)  
- Portfolio: [https://github.com/THEMENTALIST-EXE/developer-profile](https://github.com/THEMENTALIST-EXE/developer-profile)
