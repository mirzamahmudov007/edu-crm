import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { AppDispatch } from '../store';
import { AtSign, Lock, ArrowRight } from 'lucide-react';
import { Alert } from 'antd';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!username || !password) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      setIsLoading(false);
      return;
    }

    try {
      const resultAction = await dispatch(login({ username, password }));
      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'TEACHER') {
          navigate('/groups');
        } else if (user.role === 'STUDENT') {
          navigate('/student/tests');
        }
      } else {
        setError('Foydalanuvchi nomi yoki parol noto\'g\'ri');
      }
    } catch (error) {
      setError('Tizimda xatolik yuz berdi. Iltimos, keyinroq urunib ko\'ring');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[green]to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[green] to-[green] p-8 text-center text-white">
            <div className="flex justify-center items-center mb-4">
              <div className="text-4xl font-bold">
                <span className="text-white">iTech</span>
                <span className="text-orange-400"> Academy</span>
              </div>
            </div>
            <p className="text-[green] text-lg">Test tizimiga kirish</p>
          </div>

          {/* Form section */}
          <div className="p-8 bg-white">
            {error && (
              <div className="mb-6 animate-fade-in">
                <Alert
                  message="Xatolik"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setError('')}
                  className="border-l-4 border-red-500"
                />
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <AtSign className="h-5 w-5" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[green] focus:border-[green] transition duration-200 sm:text-sm"
                    placeholder="Foydalanuvchi nomi"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Parol
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[green] focus:border-[green] transition duration-200 sm:text-sm"
                    placeholder="Parol"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 shadow-md ${
                    isLoading 
                      ? 'bg-[green] cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[green] to-indigo-600 hover:from-[green] hover:to-indigo-700 hover:shadow-lg'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[green]`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kirish...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Kirish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} iTech Academy. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;