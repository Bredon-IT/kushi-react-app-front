import { Bell, Menu, Moon, Sun, User, Search, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-coral-600 shadow-lg sticky top-0 z-40 m-0 p-0">
      <div className="px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all mr-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <img 
                  src="/kushiservices logo.png" 
                  alt="Kushi Services" 
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate">
                  Kushi Services
                </h1>
                <p className="text-xs md:text-sm text-white/90 hidden sm:block">
                  Welcome back, Admin! • Dashboard Overview
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            {/* Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all w-48 xl:w-64"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              {theme === 'light' ? <Moon className="h-4 w-4 md:h-5 md:w-5" /> : <Sun className="h-4 w-4 md:h-5 md:w-5" />}
            </button>
            
            <button className="relative p-1.5 md:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2 h-2 bg-red-400 rounded-full shadow-sm"></span>
            </button>
            
            <div className="flex items-center space-x-2 ml-2 md:ml-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-white">Admin User</div>
                <div className="text-xs text-white/80">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 md:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}