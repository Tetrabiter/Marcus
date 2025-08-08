const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Изменяем на GET запрос для работы с EventSource
app.get('/api/interview', async (req, res) => {
  const { prompt } = req.query; // Получаем prompt из query параметров

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Динамический импорт fetch для CommonJS
    const fetch = (await import('node-fetch')).default;

    // Настраиваем заголовки для Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    console.log(`📨 Получен запрос: ${prompt}`);

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:13b',
        prompt: prompt,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama response error: ${ollamaResponse.status}`);
    }

    // Обрабатываем поток от Ollama (Node.js способ)
    let buffer = '';

    ollamaResponse.body.on('data', (chunk) => {
      try {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        
        // Оставляем последнюю неполную строку в буфере
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              
              if (json.done) {
                console.log('✅ Получен done от Ollama');
                res.write('data: [DONE]\n\n');
                res.end();
                return;
              }

              if (json.response) {
                // Отправляем каждый токен на фронтенд
                res.write(`data: ${json.response}\n\n`);
                console.log(json.response);
              }
            } catch (parseError) {
              console.error('❌ Ошибка парсинга JSON:', parseError, 'Line:', line);
              // Продолжаем обработку, не прерываем поток
            }
          }
        }
      } catch (error) {
        console.error('❌ Ошибка обработки данных:', error);
      }
    });

    ollamaResponse.body.on('end', () => {
      console.log('✅ Поток завершен');
      if (!res.headersSent || !res.finished) {
        res.write('data: [DONE]\n\n');
        res.end();
      }
    });

    ollamaResponse.body.on('error', (error) => {
      console.error('❌ Ошибка потока:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Ошибка потока данных' });
      } else if (!res.finished) {
        res.write(`data: Ошибка потока: ${error.message}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
    });

    // Обрабатываем отключение клиента
    req.on('close', () => {
      console.log('🔌 Клиент отключился, прерываем поток');
      if (ollamaResponse.body && !ollamaResponse.body.destroyed) {
        ollamaResponse.body.destroy();
      }
    });

  } catch (error) {
    console.error('❌ Ошибка общения с Ollama:', error);
    
    // Проверяем, не завершен ли уже ответ
    if (!res.headersSent) {
      res.status(500).json({ error: 'Ошибка связи с Ollama' });
    } else if (!res.finished) {
      res.write(`data: Ошибка: ${error.message}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// Обработка закрытия соединения клиентом
app.use((req, res, next) => {
  req.on('close', () => {
    console.log('🔌 Клиент отключился');
  });
  next();
});

// Добавляем обработку ошибок
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`✅ Backend слушает на http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Interview endpoint: http://localhost:${PORT}/api/interview?prompt=YOUR_PROMPT`);
});