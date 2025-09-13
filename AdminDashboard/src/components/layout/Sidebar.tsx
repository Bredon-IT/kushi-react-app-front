import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  Wrench,
  FileText,
  TrendingUp,
  Settings,
  Camera
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Financial', href: '/financial', icon: TrendingUp },
  { name: 'Gallery', href: '/gallery', icon: Camera },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 w-64 z-50 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl p-0 m-0">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-coral-600">
        <div className="flex items-center">
          <img
            src="/kushiservices logo.png"
            alt="Kushi Services"
            className="w-10 h-10 object-contain bg-white rounded-lg p-1 shadow-md"
          />
          <div className="ml-3">
            <h1 className="text-lg font-bold text-white">Kushi Services</h1>
            <p className="text-xs text-primary-100">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-coral-500 text-white shadow-lg scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-coral-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-primary-900/20 dark:hover:to-coral-900/20 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-4 h-5 w-5 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 group-hover:text-primary-600 dark:group-hover:text-white'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-gradient-to-r from-primary-50 to-coral-50 dark:from-primary-900/20 dark:to-coral-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-700">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary-600 to-coral-600 rounded-xl flex items-center justify-center shadow-lg">
              <img
                src="https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Services"
                className="w-8 h-8 rounded-lg object-cover"
              />
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Professional Services
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Quality • Reliability • Excellence
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
