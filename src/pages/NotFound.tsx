import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Sahifa topilmadi</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:from-blue-600 hover:to-violet-600 transition-all duration-300"
        >
          Orqaga qaytish
        </button>
      </div>
    </div>
  );
};

export default NotFound; 