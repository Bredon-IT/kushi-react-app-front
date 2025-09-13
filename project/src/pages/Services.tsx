import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Shield, Award, ShoppingCart, Search, Filter, Phone, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
 
interface Service {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: string;
  duration: string;
  image: string;
  description: string;
  features: string[];
  badge?: string;
}
 
const Services: React.FC = () => {
  const navigate = useNavigate();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
 
  const categories = ['All', 'Residential', 'Commercial', 'Pest Control', 'Polishing', 'Packers&Movers'];
  const [subcategories, setSubcategories] = useState<Record<string, { id: string; name: string }[]>>({});
 
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/customers/all-services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
 
        const mappedData: Service[] = data.map((item: any, index: number) => ({
          id: item.service_id?.toString() || index.toString(),
          name: item.service_name || 'Unnamed Service',
          category: item.service_category || 'General',
          subcategory: item.service_type || '',
          price: item.service_cost || 0,
          originalPrice: item.originalPrice || item.price || 0,
          rating: parseFloat(item.rating) || 0,
          reviews: item.rating_count ? String(item.rating_count) : '0',
          duration: item.duration || '1 hr',
          image: item.service_image_url || '/placeholder.jpg',
          description: item.service_description || '',
          features: item.features ? item.features.split(',') : ['Reliable', 'Affordable'],
          badge: item.badge || undefined,
        }));
 
        localStorage.setItem("services", JSON.stringify(mappedData));
        setAllServices(mappedData);
        generateSubcategories(mappedData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
 
    const generateSubcategories = (services: Service[]) => {
      const newSubcategories: Record<string, { id: string; name: string }[]> = {};
     
      categories.forEach(cat => {
        if (cat !== 'All') {
          newSubcategories[cat] = [];
        }
      });
 
      services.forEach(service => {
        const { category, subcategory } = service;
       
        const frontendCategory = categories.find(
          cat => cat !== 'All' && category.toLowerCase().includes(cat.toLowerCase())
        );
 
        if (frontendCategory && subcategory) {
          if (!newSubcategories[frontendCategory].some(sub => sub.name === subcategory)) {
            newSubcategories[frontendCategory].push({ id: subcategory, name: subcategory });
          }
        }
      });
      setSubcategories(newSubcategories);
    };
 
    fetchServices();
  }, []);
 
  const getSearchSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return allServices
      .filter(
        (service) =>
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase()) ||
          service.category.toLowerCase().includes(query.toLowerCase()) ||
          service.subcategory.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6);
  };
 
  const filteredServices = allServices.filter((service) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      service.category.toLowerCase().includes(selectedCategory.toLowerCase());
     
    const matchesSubcategory =
      selectedSubcategory === 'all' ||
      (service.subcategory || '').trim().toLowerCase() === selectedSubcategory.trim().toLowerCase();
     
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
     
    return matchesCategory && matchesSubcategory && matchesSearch;
  });
 
  const addToCart = (serviceId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const existingCart = JSON.parse(localStorage.getItem('kushiServicesCart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === serviceId);
 
    if (existingItem) existingItem.quantity += 1;
    else {
      const service = allServices.find((s) => s.id === serviceId);
      if (service) existingCart.push({ ...service, quantity: 1 });
    }
 
    localStorage.setItem('kushiServicesCart', JSON.stringify(existingCart));
    setCartItems([...cartItems, serviceId]);
  };
 
 
  const searchSuggestions = getSearchSuggestions(searchQuery);
  const handleServiceClick = (serviceId: string) => navigate(`/services/${serviceId}`);
  const handleSearchSelect = (service: Service) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(`/services/${service.id}`);
  };
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.search-container')) setShowSearchDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 to-navy-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-peach-600 to-navy-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-peach-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-navy-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Professional <span className="text-peach-200">Cleaning</span> Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-peach-100 animate-fade-in-delay">
              Transform your space with our premium cleaning solutions. Professional, reliable, and trusted by thousands of satisfied customers across Bangalore.
            </p>
 
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 search-container relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search for cleaning services..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl bg-white/95 backdrop-blur-sm text-navy-800 placeholder-navy-500 focus:ring-2 focus:ring-peach-300 focus:outline-none transition-all duration-300 hover:bg-white"
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy-400" size={20} />
 
                {/* Enhanced Search Dropdown */}
                {showSearchDropdown && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-peach-200 z-50 max-h-80 overflow-y-auto animate-slide-down">
                    {searchSuggestions.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleSearchSelect(service)}
                        className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-peach-50 hover:to-navy-50 transition-all duration-200 border-b border-peach-100 last:border-b-0 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-navy-800 group-hover:text-peach-600 transition-colors">
                              {service.name}
                            </div>
                            <div className="text-sm text-navy-500 mt-1">
                              {service.category} • {service.duration} • ⭐ {service.rating}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-peach-600">₹{service.price.toLocaleString('en-IN')}</div>
                            {service.originalPrice > service.price && (
                              <div className="text-xs text-navy-400 line-through">
                                ₹{service.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
 
            <div className="flex flex-wrap justify-center gap-6 text-sm text-peach-100">
              <div className="flex items-center animate-bounce-slow">
                <Shield className="w-5 h-5 mr-2" />
                <span>100% Safe & Secure</span>
              </div>
              <div className="flex items-center animate-bounce-slow delay-200">
                <Award className="w-5 h-5 mr-2" />
                <span>Certified Professionals</span>
              </div>
              <div className="flex items-center animate-bounce-slow delay-400">
                <Clock className="w-5 h-5 mr-2" />
                <span>On-Time Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Category & Subcategory Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Buttons */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <Filter className="text-navy-600" size={28} />
            <h2 className="text-3xl font-bold text-navy-900">
              Browse by Category ({filteredServices.length} services)
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory('all');
                }}
                className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-peach-500 to-navy-600 text-white shadow-xl animate-pulse-slow'
                    : 'bg-white text-navy-700 hover:bg-gradient-to-r hover:from-peach-50 hover:to-navy-50 border-2 border-peach-200 hover:border-peach-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
 
        {/* Subcategory Buttons */}
        {selectedCategory !== 'All' && subcategories[selectedCategory] && (
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {subcategories[selectedCategory].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.name)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                  (selectedSubcategory || '').trim().toLowerCase() === (sub.name || '').trim().toLowerCase()
                    ? 'bg-peach-500 text-white shadow-md'
                    : 'bg-white text-navy-700 border border-peach-200 hover:bg-peach-50'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
 
        {/* Enhanced Services Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border-2 border-peach-200 hover:border-peach-400 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 
                {service.badge && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-slow">
                    {service.badge}
                  </div>
                )}
 
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:bg-white transition-all duration-300">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-bold text-navy-700">{service.rating}</span>
                  </div>
                </div>
 
                {/* Updated Cart Button */}
                <button
                   onClick={(e) => {
                   e.stopPropagation();
                   addToCart(service.id, e);
                   navigate('/cart'); // navigate to cart after adding
                   }}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-peach-500 to-navy-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                   >
                    <ShoppingCart size={20} />
                  </button>
 
              </div>
 
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-sm text-peach-600 font-bold bg-gradient-to-r from-peach-50 to-navy-50 px-3 py-1 rounded-full border border-peach-200">
                    {service.category}
                  </span>
                </div>
 
                <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-peach-600 transition-colors duration-300">
                  {service.name}
                </h3>
 
                <p className="text-navy-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
 
                <div className="flex items-center text-sm text-navy-500 mb-4">
                  <Clock className="w-4 h-4 mr-1 text-peach-600" />
                  <span>{service.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{service.reviews} reviews</span>
                </div>
 
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-peach-600">₹{service.price.toLocaleString('en-IN')}</span>
                    {service.originalPrice > service.price && (
                      <span className="text-lg text-navy-500 line-through ml-2">₹{service.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    <div className="text-sm text-green-600 font-bold">
                      {service.originalPrice > service.price && `Save ₹${(service.originalPrice - service.price).toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>
 
                {/* Features Preview */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-peach-50 text-peach-700 px-2 py-1 rounded-full border border-peach-200">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <span className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded-full border border-navy-200">
                        +{service.features.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
               
                {/* View Details Button */}
                <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Link
                    to={`/services/${service.id}`}
                    className="w-full bg-gradient-to-r from-peach-600 to-navy-700 text-white py-3 px-4 rounded-xl hover:from-peach-700 hover:to-navy-800 transition-all font-bold shadow-lg flex items-center justify-center gap-2 hover:shadow-xl"
                  >
                    View Details
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
       
        {/* Enhanced Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-16 shadow-2xl border-2 border-peach-200 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-peach-100 to-navy-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={48} className="text-navy-600" />
              </div>
              <h3 className="text-3xl font-bold text-navy-900 mb-4">No Services Found</h3>
              <p className="text-navy-600 mb-8 text-lg">
                {searchQuery ? `No services match "${searchQuery}"` : `No services found in ${selectedCategory} category`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedSubcategory('all');
                }}
                className="bg-gradient-to-r from-peach-600 to-navy-700 text-white px-8 py-4 rounded-xl font-bold hover:from-peach-700 hover:to-navy-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View All Services
              </button>
            </div>
          </div>
        )}
      </div>
 
      {/* Enhanced Quick Stats */}
      <div className="bg-white py-16 border-t-4 border-peach-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-peach-600 mb-2 group-hover:text-peach-700">{allServices.length}+</div>
              <div className="text-navy-600 font-semibold">Services Available</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-navy-600 mb-2 group-hover:text-navy-700">15k+</div>
              <div className="text-navy-600 font-semibold">Happy Customers</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-peach-600 mb-2 group-hover:text-peach-700">4.8★</div>
              <div className="text-navy-600 font-semibold">Average Rating</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-navy-600 mb-2 group-hover:text-navy-700">24/7</div>
              <div className="text-navy-600 font-semibold">Support Available</div>
            </div>
          </div>
        </div>
      </div>
 
     
      {/* Enhanced Call to Action */}
      <div className="bg-gradient-to-r from-peach-100 to-navy-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-navy-900 mb-6">
            Need a <span className="bg-gradient-to-r from-peach-600 to-navy-700 bg-clip-text text-transparent">Custom Service</span>?
          </h2>
          <p className="text-xl text-navy-600 mb-8">
            Can't find exactly what you're looking for? Contact us for a personalized cleaning solution tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="group bg-gradient-to-r from-peach-600 to-navy-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-peach-700 hover:to-navy-800 transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
            >
              <Phone size={20} className="group-hover:animate-pulse" />
              Get Custom Quote
            </Link>
            <Link
              to="/booking"
              className="group border-2 border-navy-600 text-navy-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-navy-600 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl"
            >
              <Calendar size={20} className="group-hover:animate-pulse" />
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
 
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
 
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
 
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
 
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
 
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
 
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
 
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
 
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
 
        .delay-200 {
          animation-delay: 200ms;
        }
 
        .delay-400 {
          animation-delay: 400ms;
        }
 
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
 
export default Services;
 