import { Link } from 'react-router-dom';

function StartPage() {
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
              className='bg-white text-black py-2 px-6 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-md'
            >
              Get Started
            </button>
          </Link>
        </div>

        
      </div>
    </>
  )
}

export default StartPage;