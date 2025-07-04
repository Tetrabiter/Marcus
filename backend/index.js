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
        stream: true,
      }),
    });

    // Заголовки для SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Используем Node.js потоковое API (for await...of)
    for await (const chunk of ollamaResponse.body) {
      const data = chunk.toString(); // декодируем буфер
      const lines = data.split('\n');

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          const json = JSON.parse(line.replace('data: ', ''));
          if (json.done) {
            res.write(`event: done\ndata: [DONE]\n\n`);
            res.end();
            return;
          }

          res.write(`data: ${json.response}\n\n`);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка общения с Ollama:', error);
    res.status(500).json({ error: 'Ошибка связи с Ollama' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend слушает на http://localhost:${PORT}`);
});