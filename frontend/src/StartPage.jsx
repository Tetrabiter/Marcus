import './App.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function StartPage() {

  const [response, setResponse] = useState('');

  const fetchInterviewQuestion = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Ты — Senior Frontend Developer, который проводит собеседование на позицию Junior+/Middle Frontend Developer. 
          Каждый раз, когда я говорю "Начнем собеседование", ты генерируешь новые случайные вопросы и задания из списка ниже, сохраняя структуру: теория → практика → разбор опыта → углубленное coding (если кандидат справился).
          1.Теоретическая часть 5 случайных вопросов по js , react , html , css , zustand
          2. Практическая часть (3 случайных задания , coding tests на react)
          3. Разбор опыта (вопросы из рандомных категорий про самый сложный проект, про форму работы agile scrum и так далее)
          4. Углубленное coding если кандидат справился до этого со всеми блоками до. 
          !ВАЖНО скидывай по одному блоку , не нужно скидывать все блоки разом.
          `,
        }),
      });

      const data = await res.json();
      console.log('Ответ от Маркуса:', data.response);
      setResponse(data.response);
    } catch (error) {
      console.error('Ошибка при получении вопроса:', error);
    }
  };

  return (
    <>
      <div className='w-full h-screen flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4'>
        {/* Анимация появления */}
        <div className='text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md'>
            Hello, I'm Marcus
          </h1>
          <p className='text-lg md:text-xl text-gray-300 mb-6 max-w-lg mx-auto'>
            Your AI interviewer ready to challenge your skills.
          </p>
          <Link to='/chat'>
            <button
              onClick={fetchInterviewQuestion}
              className='bg-white text-black py-2 px-6 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-md'
            >
              Get Started
            </button>
          </Link>
        </div>

        {/* Отображение ответа */}
        {response && (
          <div className='mt-8 bg-white/10 border border-white/20 rounded-xl p-4 max-w-xl text-left'>
            <p className='whitespace-pre-line'>{response}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default StartPage;