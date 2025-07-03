const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/interview', async (req, res) => {
  const { prompt } = req.body;

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:13b',
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error('Ошибка общения с Ollama:', error);
    res.status(500).json({ error: 'Ошибка связи с Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend слушает на http://localhost:${PORT}`);
});