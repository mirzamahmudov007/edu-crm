import { RiNotification3Line, RiUserLine } from 'react-icons/ri';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 19L14.65 14.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <RiNotification3Line size={20} />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white">
              <RiUserLine size={20} />
            </div>
            <span className="hidden md:block font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 