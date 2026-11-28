const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const TOKEN = process.env.TOKEN;
const EXAM_ID = process.env.EXAM_ID;

if (!TOKEN || !EXAM_ID) {
  console.error('Set TOKEN (admin access token) and EXAM_ID first.');
  process.exit(1);
}

const questions = [
  {
    text: 'Which HTTP status code means Not Found?',
    options: ['200', '404', '500', '301'],
    correctIndex: 1,
  },
  {
    text: 'Which keyword declares a constant in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correctIndex: 2,
  },
  {
    text: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Query Logic',
      'Server Query Layer',
    ],
    correctIndex: 0,
  },
  {
    text: 'Which of these is NOT a primitive type in JavaScript?',
    options: ['string', 'number', 'boolean', 'array'],
    correctIndex: 3,
  },
  {
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctIndex: 1,
  },
  {
    text: 'Which HTTP method is meant to replace a whole resource, and gives the same result if repeated?',
    options: ['PUT', 'POST', 'PATCH', 'CONNECT'],
    correctIndex: 0,
  },
  {
    text: 'What does typeof null return in JavaScript?',
    options: ['null', 'undefined', 'object', 'number'],
    correctIndex: 2,
  },
  {
    text: 'Which data structure removes the most recently added item first?',
    options: ['Queue', 'Heap', 'Graph', 'Stack'],
    correctIndex: 3,
  },
  {
    text: 'Which SQL clause filters groups after GROUP BY?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
    correctIndex: 1,
  },
  {
    text: 'What does JWT stand for?',
    options: [
      'Java Web Token',
      'JavaScript Web Time',
      'JSON Web Token',
      'JSON Written Token',
    ],
    correctIndex: 2,
  },
];

for (const [i, question] of questions.entries()) {
  const res = await fetch(`${API_URL}/exams/${EXAM_ID}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(question),
  });
  console.log(`${i + 1}/10 -> ${res.status}`);
  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }
}
