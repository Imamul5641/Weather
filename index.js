const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

require('dotenv').config();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Set up your server routes
app.get('/api/getApiKey', (req, res) => {
  const apiKey = process.env.API_KEY;
  res.json({ apiKey });
});

app.get('/api/getUnsplashKey', (req, res) => {
  const unsplashKey = process.env.UNSPLASH_API_KEY;
  res.json({ unsplashKey });
});

// You can add more routes here

// Serve the index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
