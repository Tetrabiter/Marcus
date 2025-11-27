import { useState, useRef, useEffect } from 'react';
import { IoSend, IoAttach, IoMic } from 'react-icons/io5';
import { BsRobot, BsPersonCircle } from 'react-icons/bs';
import { BsFillStopFill } from "react-icons/bs";
import ReactMarkdown from 'react-markdown';
import Header from './features/header/Header';
import WrongAnswers from './components/WrongAnswers';
import CorrectAnswers from './components/CorrectAnswers';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);


  // Stop response generating TODO: dark theme and settings 

  function stopGeneratingFunc() {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: '⏹️ Генерация остановлена', sender: 'bot' },
      ]);
    }
  }


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
        `http://127.0.0.1:8000/api/interview?prompt=${encodeURIComponent(currentInput)}`
      );
      eventSourceRef.current = eventSource;

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
        console.warn('⚠️ EventSource closed or error:', error);

        // если соединение просто закрыто — не показываем ошибку
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('✅ Соединение закрыто нормально');
          return;
        }

        // иначе это реальная ошибка
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
  // eslint-disable-next-line no-unused-vars
  const MessageContent = ({ message, isStreaming = false }) => {
    if (message.sender === 'user') {
      return <span>{message.text}</span>;
    }



    return (
      <ReactMarkdown
        className="prose prose-invert max-w-none"
        components={{
          code: ({ inline, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-gray-700 text-orange-300 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto my-2">
                <code className="text-orange-300 text-sm font-mono" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-bold mb-1 text-white">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-200">{children}</li>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 my-2">
              {children}
            </blockquote>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };


  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Заголовок */}
      {/* <div className="flex justify-between p-4 border-b border-gray-700 text-xl font-semibold">
        <h3>Chat with Marcus</h3>
        <div className="flex gap-3">
          <button><IoSettingsSharp className="text-2xl" /></button>
          <button><IoSunny className="text-2xl" /></button>
        </div>
      </div> */}

      <Header />

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {
              msg.sender === 'bot' &&
              <BsRobot className={`text-2xl mt-1 flex-shrink-0 ${isBotTyping && idx === messages.length - 1 ? 'animate-pulse' : ''
                }`} />
            }
            <div
              className={`px-4 py-2 rounded-xl break-words max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
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

        <div ref={messagesEndRef} />
        {/*  <WrongAnswers answers={['2 + 2 = 5', 'Capital of France is Berlin']} />
         <CorrectAnswers answers={['2 + 2 = 4', 'Capital of USA is Washington']} /> */}
      </div>

      {/* Ввод */}
      <div className="p-6 mb-10 mx-5 border rounded-xl border-gray-700">
        <div className="flex flex-col items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Введите сообщение..."
            className="flex-1 w-full resize-none bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isBotTyping}
          />

          {/* Кнопка Отправить */}
          <div className='w-full flex justify-between'>

            <button
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              <IoAttach className="text-white text-xl" />
            </button>

            <div className='flex gap-3'>

              <button
                className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
              >
                <IoMic className="text-white text-xl" />
              </button>

              {!isBotTyping && (
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <IoSend className="text-white text-xl" />
                </button>
              )}

              {/* Кнопка Стоп */}
              {isBotTyping && (
                <button
                  onClick={stopGeneratingFunc}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                >
                  <BsFillStopFill className="text-white text-xl" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;