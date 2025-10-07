const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Define the API route to handle POST request
app.post('/api/data', (req, res) => {
  const { name } = req.body;
  console.log('Received data:', name);
  res.json({ message: `Hello, ${name}` });
});

app.listen(3000, () => console.log('Server running on port 3000'));