import { useState, useRef, useEffect } from 'react';
import { IoSend, IoSettingsSharp, IoSunny } from 'react-icons/io5';
import { BsRobot, BsPersonCircle } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsBotTyping(true);

    try {
      const eventSource = new EventSource(
        `http://localhost:3001/api/interview?prompt=${encodeURIComponent(currentInput)}`
      );

      let botMessage = { text: '', sender: 'bot' };

      eventSource.onmessage = (event) => {
        console.log('📨 Получены данные:', event.data);
        
        if (event.data === '[DONE]') {
          eventSource.close();
          setIsBotTyping(false);
          return;
        }

        // Добавляем текст к последнему сообщению бота
        botMessage.text += event.data;
        setMessages((prev) => {
          // Если последнее сообщение - от бота, обновляем его
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.sender === 'bot') {
            return [...prev.slice(0, -1), { ...lastMsg, text: botMessage.text }];
          }
          // Иначе добавляем новое сообщение
          return [...prev, botMessage];
        });
      };

      eventSource.onerror = (error) => {
        console.error('❌ EventSource error:', error);
        eventSource.close();
        setIsBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { 
            text: '❌ Ошибка соединения. Убедитесь что:\n• Запущен бэкенд (http://localhost:3001)\n• Запущен Ollama (http://localhost:11434)\n• Загружена модель codellama:13b', 
            sender: 'bot' 
          },
        ]);
      };

      eventSource.onopen = () => {
        console.log('✅ Соединение установлено');
      };

    } catch (error) {
      console.error('❌ Connection error:', error);
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: '❌ Ошибка при создании соединения', sender: 'bot' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Компонент для отображения сообщений с поддержкой markdown
  const MessageContent = ({ message, isStreaming = false }) => {
    if (message.sender === 'user') {
      return <span>{message.text}</span>;
    }

    // Для потоковых сообщений используем более безопасный подход
    if (isStreaming) {
      // Простая обработка для потокового контента
      const text = message.text;
      
      // Обрабатываем инлайн код во время стриминга
      const renderStreamingText = (text) => {
        // Разбиваем текст по инлайн коду (`код`)
        const parts = text.split(/(`[^`]*`?)/g);
        
        return parts.map((part, index) => {
          if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            return (
              <code
                key={index}
                className="bg-gray-700 text-orange-300 px-1 py-0.5 rounded text-sm font-mono"
              >
                {part.slice(1, -1)}
              </code>
            );
          } else if (part.startsWith('`')) {
            // Незавершенный инлайн код
            return (
              <span key={index} className="bg-gray-700 text-orange-300 px-1 py-0.5 rounded text-sm font-mono">
                {part.slice(1)}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        });
      };

      return <div className="whitespace-pre-wrap">{renderStreamingText(text)}</div>;
    }

    // Для завершенных сообщений используем полный markdown
    return (
      <ReactMarkdown
        components={{
          // Стилизация блоков кода
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code
                  className="bg-gray-700 text-orange-300 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto my-2">
                <code
                  className="text-orange-300 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              </pre>
            );
          },
          // Стилизация заголовков
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-bold mb-1 text-white">{children}</h3>
          ),
          // Стилизация списков
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-200">{children}</li>
          ),
          // Стилизация ссылок
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),
          // Стилизация цитат
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 my-2">
              {children}
            </blockquote>
          ),
          // Стилизация параграфов
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          // Стилизация жирного текста
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          // Стилизация курсива
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Заголовок */}
      <div className="flex justify-between p-4 border-b border-gray-700 text-xl font-semibold">
        <h3>Chat with Marcus</h3>
        <div className="flex gap-3">
          <button><IoSettingsSharp className="text-2xl" /></button>
          <button><IoSunny className="text-2xl" /></button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && <BsRobot className="text-2xl mt-1 flex-shrink-0" />}
            <div
              className={`px-4 py-2 rounded-xl break-words max-w-[70%] ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
              }`}
            >
              <MessageContent 
                message={msg} 
                isStreaming={msg.sender === 'bot' && isBotTyping && idx === messages.length - 1} 
              />
            </div>
            {msg.sender === 'user' && (
              <BsPersonCircle className="text-2xl mt-1 text-gray-300 flex-shrink-0" />
            )}
          </div>
        ))}

        {isBotTyping && (
          <div className="italic text-gray-400 flex items-center gap-2">
            <BsRobot className="animate-pulse text-xl" />
            <span>Маркус печатает...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Ввод */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Введите сообщение..."
            className="flex-1 resize-none bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            <IoSend className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;