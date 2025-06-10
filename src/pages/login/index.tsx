import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockLine, RiUserLine } from 'react-icons/ri';
import { login } from '../../services/authService';
import { PhoneInput } from '../../components/PhoneInput';

interface LoginFormData {
  phone: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Telefon raqamini +998 formatida yuborish
      const loginData = {
        ...formData,
        phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`
      };

      const response = await login(loginData);
      
      // Token va rol ma'lumotlarini saqlash
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);

      // SUPER_ADMIN yoki ADMIN bo'lsa dashboardga yo'naltirish
      if (response.user.role === 'SUPER_ADMIN' || response.user.role === 'ADMIN') {
        navigate('/dashboard', { replace: true });
      }
      else if (response.user.role === 'TEACHER') {
        navigate('/dashboard', { replace: true });
      }
      else {
        setError('Sizda tizimga kirish huquqi yo\'q');
        localStorage.removeItem('token');
        localStorage.removeItem('role');  
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kirishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            iTech ADMIN
          </h1>
          <p className="text-gray-600 mt-2">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon raqam
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiUserLine className="text-gray-400" size={20} />
                </div>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => {
                    // Telefon raqamini +998 formatida saqlash
                    const formattedValue = value.startsWith('+') ? value : `+${value}`;
                    setFormData(prev => ({ ...prev, phone: formattedValue }));
                  }}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine className="text-gray-400" size={20} />
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  placeholder="Parolni kiriting"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Kirish...</span>
                </div>
              ) : (
                'Kirish'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 