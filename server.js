import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Student Management REST API server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available at http://localhost:${PORT}/students`);
});
