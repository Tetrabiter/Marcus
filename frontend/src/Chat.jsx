import { useState, useRef, useEffect } from 'react';
import { IoSend, IoSettingsSharp, IoSunny } from 'react-icons/io5';
import { BsRobot, BsPersonCircle } from 'react-icons/bs';

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
    setInput('');
    setIsBotTyping(true);

    try {
      const res = await fetch('http://localhost:3001/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';
      let botStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.startsWith('data:'));

        for (const line of lines) {
          const token = line.replace('data: ', '');
          botText += token;

          setMessages((prev) => {
            const newMessages = [...prev];

            if (botStarted) {
              const last = newMessages[newMessages.length - 1];
              if (last?.sender === 'bot') {
                newMessages[newMessages.length - 1] = {
                  ...last,
                  text: botText,
                };
              }
            } else {
              newMessages.push({ text: token, sender: 'bot' });
              botStarted = true;
            }

            return newMessages;
          });
        }
      }

      setIsBotTyping(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Ошибка при получении ответа от ИИ 😢', sender: 'bot' },
      ]);
      setIsBotTyping(false);
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
            {msg.sender === 'bot' && <BsRobot className="text-2xl mt-1" />}
            <div
              className={`px-4 py-2 rounded-xl break-words max-w-[70%] ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <BsPersonCircle className="text-2xl mt-1 text-gray-300" />
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
