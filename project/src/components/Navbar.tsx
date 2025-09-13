import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  cartItemCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cartItemCount);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Update cart count from localStorage
  useEffect(() => {
    const updateCart = () => {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartCount(cartItemCount || items.length);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, [cartItemCount]);

  // ✅ Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/signin");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg"
          : "bg-white/90 backdrop-blur-sm"
      } border-b border-peach-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src="/kushilogo.jpg"
              alt="Kushi Services Logo"
              className="h-20 w-auto mr-4"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-peach-500 to-navy-600 text-white"
                    : "text-navy-700 hover:bg-peach-100 hover:text-navy-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-navy-100 text-navy-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-200 transition-all"
                >
                  <User size={16} />
                  <span className="font-semibold">
                   {user.firstName ?? user.fullName?.split(' ')[0] ?? ''}
{user.lastName ? ` ${user.lastName}` : ''}

                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-peach-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-peach-200">
                      <p className="text-sm font-semibold text-navy-800">
                       {user.firstName ?? user.fullName?.split(' ')[0] ?? ''}
{user.lastName ? ` ${user.lastName}` : ''}

                      </p>
                      <p className="text-xs text-navy-600">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-peach-50 transition-colors"
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-peach-50 transition-colors"
                    >
                      <ShoppingCart size={14} /> Order History
                    </Link>
                    <div className="px-4 py-2 text-xs text-navy-500 border-t border-peach-200 mt-2">
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-semibold">
                          {user?.totalBookings ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span className="font-semibold">
                          ₹{user?.totalSpent?.toLocaleString() ?? "0"}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2 border-peach-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogIn size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="flex items-center gap-1 text-navy-700 hover:text-peach-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-peach-300"
                >
                  <LogIn size={16} /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 bg-gradient-to-r from-peach-500 to-navy-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-peach-600 hover:to-navy-700 transition-all shadow-lg"
                >
                  <UserPlus size={16} /> Sign Up
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-gradient-to-r from-navy-500 to-navy-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:from-navy-600 hover:to-navy-700 transition-all shadow-md flex items-center gap-1"
            >
              <ShoppingCart size={16} /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Book Now */}
            <Link
              to="/booking"
              className="bg-gradient-to-r from-peach-600 to-navy-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-peach-700 hover:to-navy-700 transition-all shadow-md"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-navy-700 hover:text-navy-900 hover:bg-peach-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-peach-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-peach-500 to-navy-600 text-white"
                    : "text-navy-700 hover:bg-peach-100 hover:text-navy-900"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Cart */}
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-navy-500 to-navy-600 text-white px-3 py-2 rounded-md text-base font-medium hover:from-navy-600 hover:to-navy-700 transition-all flex items-center gap-2 relative"
            >
              <ShoppingCart size={18} /> Cart
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-navy-700 hover:text-peach-600 px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2"
                >
                  <LogIn size={18} /> Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-peach-500 to-peach-600 text-white px-3 py-2 rounded-md text-base font-medium hover:from-peach-600 hover:to-peach-700 transition-all flex items-center gap-2"
                >
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && user && (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-peach-100 to-navy-100 text-navy-700 px-3 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-2 border border-peach-300"
              >
                <User size={18} /> {user.firstName ?? user.fullName?.split(' ')[0] ?? ''}
{user.lastName ? ` ${user.lastName}` : ''}

              </Link>
            )}

            <Link
              to="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-peach-600 to-navy-600 text-white px-3 py-2 rounded-md text-base font-medium hover:from-peach-700 hover:to-navy-700 transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
