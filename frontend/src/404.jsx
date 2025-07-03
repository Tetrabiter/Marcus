import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white animate-fade-in'>
      <h1 className='text-5xl font-bold mb-4'>404</h1>
      <p className='mb-6'>Страница не найдена</p>
      <Link to='/' className='bg-white text-black px-4 py-2 rounded-xl'>
        Вернуться домой
      </Link>
    </div>
  );
}

export default NotFound;