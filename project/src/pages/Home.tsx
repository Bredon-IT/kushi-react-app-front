import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Clock, CheckCircle, Star, Search, Home, Building, Bug, Wrench, Truck, MapPin, Phone, Award, Users, ChevronDown } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

   // Sample search suggestions
  const searchSuggestions = [
    'Deep Home Cleaning',
    'Sofa Cleaning',
    'Carpet Cleaning',
    'Kitchen Cleaning',
    'Bathroom Cleaning',
    'Office Cleaning',
    'Pest Control',
    'Window Cleaning'
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchDropdown(false);
    navigate(`/services?search=${encodeURIComponent(suggestion)}`);
  };


  const features = [
    {
      icon: Shield,
      title: 'Trusted & Certified',
      description: 'Fully licensed, bonded, and insured with industry certifications for your complete peace of mind.'
    },
    {
      icon: Sparkles,
      title: 'Premium Solutions',
      description: 'Advanced eco-friendly products and cutting-edge technology that deliver superior results.'
    },
    {
      icon: Clock,
      title: 'Reliable Service',
      description: 'Punctual and dependable service with guaranteed scheduling that respects your valuable time.'
    },
    {
      icon: CheckCircle,
      title: '100% Satisfaction',
      description: 'We guarantee exceptional results with our comprehensive quality assurance program.'
    }
  ];

  const serviceCategories = [
    {
      icon: Home,
      title: 'Residential Cleaning',
      description: 'Complete home cleaning solutions with premium eco-friendly products',
      price: 'Starting ₹999',
      image: 'https://tse4.mm.bing.net/th/id/OIP.2XIebCebLJVe7iwYKSvD4wHaFD?rs=1&pid=ImgDetMain&o=7&rm=3',
      link: '/services',
      gradient: 'from-peach-200 to-navy-800',
      services: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Carpet Cleaning']
    },
    {
      icon: Building,
      title: 'Commercial Cleaning',
      description: 'Professional office and commercial space cleaning services',
      price: 'Starting ₹4,499',
      image: 'https://rescuemytimecleaningservice.com/wp-content/uploads/2020/11/maid-service-hiring.jpg',
      link: '/services',
      gradient: 'from-navy-800 to-peach-200',
      services: ['Office Cleaning', 'Factory Cleaning', 'Floor Polishing', 'Sanitization']
    },
    {
      icon: Bug,
      title: 'Pest Control',
      description: 'Comprehensive pest control solutions for all residential and commercial spaces',
      price: 'Starting ₹1,899',
      image: 'https://tse1.mm.bing.net/th/id/OIP.I6TQ2G-RhSxGDycIkxX_UAHaDt?rs=1&pid=ImgDetMain&o=7&rm=3',
      link: '/services',
      gradient: 'from-peach-200 to-navy-800',
      services: ['Cockroach Control', 'Termite Control', 'Bed Bug Control', 'Mosquito Control']
    },
    {
      icon: Wrench,
      title: 'Specialized Services',
      description: 'Expert cleaning and maintenance for specialized requirements',
      price: 'Starting ₹5,999',
      image: 'https://tse2.mm.bing.net/th/id/OIP.KUKqwjbh-0rEW1CB-ftarwHaDe?rs=1&pid=ImgDetMain&o=7&rm=3',
      link: '/services',
      gradient: 'from-navy-800 to-peach-200',
      services: ['Pool Cleaning', 'Tank Cleaning', 'Paver Laying', 'Layout Development']
    },
    {
      icon: Truck,
      title: 'Packers & Movers',
      description: 'Professional packing and moving services with complete care',
      price: 'Starting ₹6,999',
      image: 'https://kushiservices.com/wp-content/uploads/2024/07/Blue-and-White-Illustrative-House-Cleaning-Service-Flyer-210-x-140-mm-5-1024x682.png',
      link: '/services',
      gradient: 'from-peach-200 to-navy-800',
      services: ['Local Shifting', 'Packing Services', 'Loading & Unloading', 'Storage Solutions']
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Happy Customers', icon: Users },
    { number: '24/7', label: 'Support Available', icon: Clock },
    { number: '4.9★', label: 'Average Rating', icon: Star },
    { number: '99%', label: 'Satisfaction Rate', icon: Award }
  ];

  const testimonials = [
    {
      name: 'Vinodh',
      role: 'Homeowner',
      rating: 5,
      text: 'Kushi Services transformed my home completely! Their attention to detail and professional approach is unmatched. Highly recommended!'
    },
    {
      name: 'Sharan Kumar',
      role: 'Business Owner',
      rating: 5,
      text: 'Outstanding commercial cleaning service. They maintain our office space perfectly and their team is always punctual and professional.'
    },
    {
      name: 'Priyanka',
      role: 'Property Manager',
      rating: 5,
      text: 'Reliable, efficient, and thorough. Kushi Services has been our go-to cleaning partner for over 2 years. Excellent service quality!'
    }
  ];

  return (
    <div>
      {/* Hero Section with Enhanced Design */}
      <section className="min-h-screen bg-gradient-to-br from-peach-50 via-white to-navy-50 flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-peach-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-navy-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-peach-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-peach-100 to-navy-100 px-4 py-2 rounded-full border border-peach-200">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className="text-sm font-semibold text-navy-700">Trusted Cleaning Service in Bangalore</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent">
                    Premium
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-peach-200 to-peach-400 bg-clip-text text-transparent">
                    Cleaning
                  </span>
                  <span className="text-navy-800"> & </span>
                  <br />
                  <span className="bg-gradient-to-r from-navy-700 to-navy-800 bg-clip-text text-transparent">
                    Service
                  </span>
                  <span className="text-navy-800"> Excellence</span>
                </h1>
                
                <p className="text-xl text-navy-600 leading-relaxed">
                  Transform your space with <span className="font-bold text-peach-600">Kushi Services</span> - 
                  Bangalore's most trusted cleaning professionals. We deliver exceptional results with 
                  cutting-edge technology, eco-friendly products, and unmatched expertise.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-peach-200">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) =>{ setSearchQuery(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                        onFocus={() => setShowSearchDropdown(true)}
                
                      placeholder="Search for cleaning services, pest control, or specific needs..."
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none rounded-xl bg-peach-50/50"
                    />
                     <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy-400" size={20} />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-peach-200 to-navy-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-peach-600 hover:to-navy-700 transition-all shadow-lg flex items-center gap-2 transform hover:scale-105"
                  >
                    <Search size={20} />
                    Find Services
                  </button>
                </form>
                {/* Search Dropdown */}
                {showSearchDropdown && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border-2 border-peach-200 z-50">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-peach-50 transition-colors border-b border-peach-100 last:border-b-0 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <Search size={16} className="text-navy-400" />
                          <span className="text-navy-700">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="bg-gradient-to-r from-peach-200 to-peach-300 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-peach-200 hover:to-peach-300 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl"
                >
                  Explore All Services
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-navy-500 text-navy-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-navy-500 hover:text-white transition-all shadow-lg"
                >
                  Get Free Quote
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-peach-200 shadow-lg">
                      <IconComponent className="mx-auto mb-2 text-peach-600" size={24} />
                      <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-peach-600 to-navy-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-sm text-navy-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIVFRUXFxgWFRcYGBcXGBcVFxUWFxcaFRcYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lICUtLS0tLSs3LS0tNS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQMEBQYHAgj/xABGEAACAQMCAwUEBgYKAQMFAAABAgMABBESIQUxQQYTIlFhFHGBkQcyQlKh0RYjU3Kx4RUzVGKCkpPB0vAXQ6LxJDRjc4P/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QALhEAAgIBBAEDAgQHAQAAAAAAAAECEQMEEiExURMiQXHBFGGBoQUjM9Hh8PEy/9oADAMBAAIRAxEAPwCN762V8d07YOBk07eaCTB0NkDGM9KkOIO4ZQLdScZJ09TTdbifOBbIPXArI0+joxrv7jSOCBgx7pyVGedIQzRBgVhbI9TU5Z3dwHx3SDz2HL13plccQvNR0xLz6KPzpqPH+CLlzX3EbgxYDGBgXznJNcgxKNQh5b8zUq93dGNCUXVvnYbD50zlvrvloXHuH50mnZJPj/I+nnUYPcE5UHrQuFjGnEP1hk5ztUlfyzHSEAACjPLn1phMLnO5B+VD+f7El0v7jS4uRp09xtnPWnPZO9WO6jPc6dR0k7/aGPyoQS3BIBK4zvuOVKzPOkwkXSVBBHLBx0oV9iddfcsP0j8MDxasbivOHFEKTuDtvn4V6mjvoryFtJBI8Lr1VscjWDfSZ2faJjIBjBwfVTV+Kfp5fqZJx34/oVa7tMAOhyp/D0NMteaTjuGUEAkA8xSeqtyzGPYOK5bzpLvDXUEZdwg6miWZUCgy1dk1OCemdqt9zFGFVjEctz3PSofh1sI1CgdMVZn7/uUG2R02yBXKk90mzqY1tSRGwvEpDCPkfM1I8TuEDA9yTqUE86Z97ceSkfCpvickrBAmNlGeWxpVwTfZFXiRLp/VHxDJ3O1Nbi7j06O6OAc8zTy4FwTvg+XKuIpJsgFV575xR8h12RtssLMFKMM+tK3CQA40McetPr9ZRJqVBjpgCk5xJ3YbQCxO+w5UCsj7u4ifTs4AGMZoobeGTJy4IGaVEsv7Ef5aWiuJM6e4G+x26UIH0MLeWFWydW1K3Aidiwdt/MU44hGFcgQD34pqDvtBj50DQj3Mf3z8qFL/AP8AH+NHSGWVLEqwElyowfF4qZcQgJdm9qUAnbxHYUVzbwSOSWkyxzyri+4dBG2gmQ7A5261LgVP/UFb8M7w4W6Gr0J/OnPBLFY2LPd5OCAu+AfWube2ghKyL3hLA4FJrFASTof50OSQKDly/sOvYtOS9yvizjnTSWxjJGLkDf1/OlJrmEhV7liF65866v4bdGGI2OwPOlwS93+0Sr2qRAqZmLECopoIyd7hh86k0uY5WJMZ2Xz8qZPJBz7o/M0Ohq6+f2EbfhsTEkTkadzseVLzLEUVFmOxzuDTmBrcRtII238J3plJc26jaNjt50+OiPPfP7FX4N20ax4i5BLwMwSRQNyM/WA8xWtdqeEx3tuGQg6hkH0Irz+dKZlYAMWYL1J3OWP8BWgfRB2vJm9imPgk/qc9G6r8eY9c10c2nuG758fl5Objze+mZjxnhr28zxOpBUnHqOhHnTInavS/a/svZXAEUwAkOSjjZgQN8H/avPnafgMtnMYnBxnwN94Z29xox5k1T7FPFXK6IurF2S4YcmdhhRsuevmR6UfC+zkWV76dd/sIQTnyJ/KrTxV1RdgFVF2A5YAqjPlUltiXYcLT3SFeEd20uZGwqjPvPSn81og8ZnyGzjaobs9cRyQhjHk5OTnrmpO4u0KhRDsPWsjpOmbIp0mhH2ePIIn/AI1Ky2qQ85WJZenlTC6jgXTiM7jPM07ju0mcBojgLgHJ6UcD5Itokz/XsPnQh4erk4n3G++eVLTywE/1R+dOrIW+lpArbbH40IHwNpdPdhFnBOfWkJrF8AmUYPLc0btbgcnpO4lhYKo1DFFoVMKOJv7Qo+JqSmGogRygnGOfWoqW1hUKdTHUKEQiUghm86YuSRhhYONcw2570xuVl1EiVcZ236UlNHG7Z1sMnypO6skRtLOflQLkU0yftB/moUl7FF+1Pyo6YFse4AiEgtRrz5HH8K5m41I4ybcav3CaUt2nzgyqAOmRT6+WZmyGXTgciKPgPn/pDe33LFQYdv3Ke8RklGBHAANOT4c70zmt7nOe9/8AdtTnhzzBxrmXH71F2OkjtZ5hArd0NRO/h/2pi17dM2DGCP3aUuLW4OQZQATkYbpXdjbyo6kyjY7+KhsF0Sd+0ysNCYGBkACubeWUI5MOSPq5Arq7gbUczAH96m81tKuAZQM78zyo5sdKqtHAubhsK0A058q44yWUOFhAGnnj0pW4lcRqBONQznemX6wg65lYEYxnnnap4k5ZIxXlEJtRg5PwzLuIRsTqP1eS7dBS3Z6YxXUEgySkqNtzIDAkAe7NSvaKMK2noKkPoy4F305uHHgiPhHRpDy+XOvS6mEMMf0PPaecsjsZ/SJ2imub1mcSRIvhiVgVIXzIPU86grviryRrHIzOycsnOE3xuauP0s3MU2jxkGORo0IGQ5AUyHPPZiB8DWf3M0ZQqCS3POPw9BXBceuDqqXD5O7VtUiYHI5JHkKsXHb1WgbDZyAPzqsQcTYIE0qQM4OMHfoSOdN3mLHf5dKFjuasPUUYOi7dhO+7mQIuQH8vSrahmEBJQatXkM4qpfR9cadXjCgMCd+e1WPiEMhYt3w0sdt6pzqsjNOB3BDf2m5Jxpz6ECpa/acaCi423wBzqJtLZ1YHvRz86lb2Ek5MwGRkeKqbLmlYVnLLhi0Wdtsgc6aNeTEae4AU88ClJLSVQD3q4PLxHehLI4jx3w1ZzzpiOL8BCAIRyzyqLkuWz/UD5GnWZ2P9Yp8t6OW3nHORQeu9AcCdvMXKh4dvca4ncBiBCMA7bU8u7iUIgV1J6kEUzfv2OzA/EUBYo7qIg/c+LPwpObiYbdoRnGORoRSy5xrGPLanN/JKWGnGMDligQw/pA/sR8v5UKW76b/uKFG4KJe64RGr7zb4zjHnXUWgDT3xPwp6zLNIP1O7c9+QFRs93GjHFv1IzvvSpMsUmuB/DHAVZS5yx2OOWKjYhbA4MjnfypNeK6CW9nz8DgfhR8H0Ta2e10ooJzuMnyFTUVRW5NMl720gAQrIwGnbrTCUxEqveNzGdvWjXiquuO4ACjC8+VM3vVyP1C8xvg1F02TV0Wfi9tBrwzOTgZx7qaXUsLNnLjA0j4Up7VlTI8O+2NjUc/EAST7N+B/Kh8jXA4W2tnYLqfc4ppd2cQkwjHwMCdXIgULe/dWGIF9+k7fhTviMgaLUY9DEbtjfn0rVoY3ngl5MuslWGd9UyhcfBkm0ruWYKoHUnYVo8qf0bw8LGNUxxHEvV7iTYn1xn8KgOx/Di12sgheRFJXXlQsb4yCQTltvIHFM/pD7ZK0rRQfWi1RiXOQuRiQxj7xORq6Abc662vn6mbZHpdnH0cduJSfyU7tdMNUdurhhbpoZhyeZ2LzN6+I4/wANV0c6XY0vxmwMMunBAIDLnyIrHOk0jXFNpsaMKOjrmlkVOxR8Fj7IzKJCHzgr08xV6uI4jFGRqA3rP+yDL7VEHGVJII94NaC14DlO5Glc42NZdUvdflG3Su414GLrHjGts1McRtIEWPWXJKjl5VE97/8AhB+BqTWcvu8Oyr4djWU0/I3u54CFUaxpGN6aNHA32mopr3J/+3z8DTdbwg57gc/I/lRQfQczWsUcgGtjjBrq5RGBfWcE4pS4uVMetoRqzjkeVM5eIDRp7oY50+BIRKRffNLWndIc94eWOVIC4T9jv8aeXEaLpYx9M4pdAxrd2Kq28vPfl50UNs7HTFmRjyAG9dySiVh+r3O3wq6fRoid5NhcYIGTTUdzohOTUSl/0Df/ANmk+Y/OhW60Kn6EfJl3sonCIriaSTcRIp54BJ32Ap/PwInnMfgq/lR9j4mSKTU2rL7HOdgKlnarox45JTyNOkQsPBSpOZSwI5ED8qSHCnAwJzjywKl5XpsZKltRD1JIibrgzHGJiu2DgDek04GQQe+bY55Df8Kl5DXBajag9SQ0ubUsTmRseW1Nf6NI2ErfIVIO1N2kqOyI/Wn5G8dsyhgJTv1wNq6k4YQg719QONKsMu55AIByz5napCBdEfesMknSgPLI5t8Nviac8Nsy2mZjlmJ0DPXlk/8AuPwqzE/TkpL4IZJOcdr+SG7S3q8O4ewTAkYGOP8Afb67f4R/CsG5bGr79JHGPabghDmKH9XH64Pjb4n8AKo1wvWuhHC4Q3Pt8mT1FJ0ukJRjLqPNlH4irr9JVphYXzk50+4af5VWuzVn3t1Ev97Ufcu9XH6S0zAh8n/iCKyT/wDaNEX7aM7SikFEtdEVa1uiQ6Y74U572Ig4Otd/jWtyI7KB3mCOuBvWP8MlCyIx5Bhn3ZrX45QQGB2O4rJP3VZdCTj0I+yv+1PyFO+IOz48ZGBg460kXrlzVexE/VkNGtXG4lNFEHTJ7zO3UClnem0r0tiH6shDvLgjnkfCjurmUIvhGeuwpsLCaQ+DJHxo7vg9xEutzhfU1U0zQpJpCQu5x0x8BSiXs+Rq39+OVNZHLBQJBt60m4Ybd4Mj1oHwO7q+mDnQvuwBVg7HdqYrUv7S4BbGMb8vPFUTixcBMSYDHBINRlzwxe8097nbOo1KKfZVOXwbx/5HsP2v4GhWDf0Qv7UUKn+pVt/I1Dg/GGifOfCfrCrY3F0ON9jVD7kDkaRuZ2UbHlViZA0KS8B5GmMnEAHVdzk4qn2HGz1NTlhxJSwJxkUxFjk2pFnptJxDVSTXFAhaaWmFnda5CoB2FLM9d2AAbYDLEKPicUATNzZl2ggG2IwzHy1ZkYny22+VVHjPH7y0DxSrEyyq6W0sQK6CMB9QPMhSAD5/hpd6oTWR/WSHQv8AdjXb5ZUn3AVl3a6ZJst9hcJGf7gO5/xHxfKr9LBTzRjLqyrPJxxykijm01bKenyAqBvyAxA5Zq2X06rGUQ5JHiPkPIVTblt67X8QqMUkc/RtybbLN9G8Gbh3P2U2/wAR/lVq7Z2veWr45jDfKon6NYcRSv5sB8AKt0oBBB5HY1wZOpWdSuDE467dOtPuM2PdXDp0ByPceVM23rbFXEpb5EgpJ2Gfyq8djOK6ozCx8SfV9Vqu9lYwbpAfX+Bpfils1nch0+oTqX3dVrFl7Lo9F7W4GsL50vK2KZcOu0cLKvIjNT/BeGG4Ys2yD8arJEZZ2UkzYQe89BVhtuz0UYy/jb15VNuqRLhQABVO492iAyBmgDri/aHugQEGMYwKpF7xZpPCzHR93nTPinFySTmpr6NrFbmVpZACqfVHTPnR2NOhHh/A3cBkRyOe4wPxo5+DkE5Iz13q7dtL8xoqJtnnjyqj98arcEWeqyK45b6BGu+C3PnTS6gRZgMkjTT3j0nhT9+o6SbMwJX7PKhqhp3yK93H5mhQ1/3KFRss4LlHeKqAyI6lhkEjY+6omfiIzjO1adBwmwKhWiDAbDUScfOnA4Bwz+zRf5RV1GWzGGnw2x2O9SNpf461ra8A4b/Z4v8AKK7HCbAcreL/ACinQGc2/EvWnyX+1XtbWyHKGMf4RXXd2n7KP/KKAKQt3Up2cbVcx4GcNqPoF3z+Hx2HWrCPZP2UfyFMYrnLl4oVjiw8eo7OWVhllVfsYVjknPhXbnQI67U8VwrAHDSZjT0jGO9Yf+1AfWqNxZlMRycAEfh0q58I4hDKve4DK4/VahuIh9X3Ft3P72OlQf0htE0CBAq4cFiB0wdq0aNfzo/Uq1H9KRnk0WEeVhjVkKPzqrSnerH2gulJCxjCgb+pqtPXQ1805JL4Muji6t/JqfZGNY7SMD7Q1H3k1KNLT3sTexLY2+pVz3Yzt76mH4nD91fkK5DXJ0DGu3Y/+oUj7SD8DUA221Xb6SnRp1kGANGAAOuTVGlO1boLbjszt3KhzwabTOjA8mHyO1XXtHZCeMj7S7qf9qo3C5Qk0bEZAdSR6ZFbe/EYD/6ab+grJkLomY9irsljAeZPh9/Iit14eipGEXoOVYX2hItr9Z4gApYSADl5MK0uPtCh0lcZcbY5nbP8M1WSE+1XaMRoy7aum9ZTxDjJYkk1eb6/4cSTIiFjuc5yapPHrm3dsQQKgG+RuT76QEFcOzb74rTPoruERGDOoJxsSBVM4DaQyFmuXKoNl6Zb+VWK1teFgYI1+pJyPcRQgLN24fLLg9Kqq1AX8rQy/qXZ4uisScDy3pxLxnCgquT1B2xQwFOPscR4+9Ua7N3u53xS3ELzWkLkY8RyPdTKVgZc52xUGWRH/eN5ijpp4fM0KiWWaCnFj512eLkfaqFFvH/e+Zrv2eL+98zVtmeiX/po/eoHjR86iBbRDfJ+dd9zD6/OgB+eNHzof0yfvc6jfZYfX5muhbw+vzpiLH2XkeebGcquC3rvhV+J/AMelS/bfiIiiEYPilBRcbERc5X25FshRj7+af8AAODLaxKo2d/HKeq5G4z00r4R/edqovHb5LmZpW3X6sYzgCNfq49+7f4sdKV80AhDxLSAq7BQAAOQA2AFdXV0s0MsbHxkBo/UrzHypn7PFnr86juKwD6yMVC4wc9TWzRQ3zdfCKNRJRir8ldlfnnnTE06v5QTs2o53NNMmpZpe6h41xZeuFcTxBGAeSiljxY+dRfCLeMwoWznG+/rTn2eH1+dY32XIje0FyZCozyqFuKleNgDCxg7jJNRtsh1KNOvfZd9z0Bx0ren/LX0KK9zEIELOoAJORsNzVwvL1ogO82bAIXIJI5HlyPoagOI3IXEce5HN8Y8XUIPsqOVc/0USMmTxe7/AHrBJ2XpC3E79ZgM7EZpe341o7vTvoG2rzwR/vTC34YG2BOv7uOR+HSkpOFSK2NJ545H8fKobkh0LX1y0jZx0A291N4LVueauN7axx2dvEtsvtHi1uFOogsSNbcm9PIVC8SgeP6qkcgdjzxk8/fTteQ5G80KiJUB3ySR5H3021gdfypOcyMdw3ypt3TeR+RpWhkmlwAM4zXR4kvUUwdCFGxHmcGk3QH7Q/GjgLZKNcxMAGTYcsbYzXE1mmO8QkgbFTz3603itnP2W+RqStLVypUKctjGQcfGouUfI1Yw8P3TRU49kl8qKo2iw0Ze01oftD/LR/pPYg4Lrn92o+TsREMnvG2FVzgnARNNICxATr8az/hY+WXPOy5/pLw7rIv+X+VD9JeHdJU+X8qgJuykYXBds58qhp+zyL9o0/wsfLI/iJeEXj9KLDpJH8v5VO9kp7a6kLR6HEQDNgbajnQD7yCfcprHpOEL0JrbeynABY2iQnaR8yTnrrYDUM9NKhUHqSetSjpop3bIy1DaqjvtJxBFiYyNpRx+sY9I84AJ83JA/wAfpVRbjliPtx/Kk/pKve8jjh1Y7w9+4H3BlYV9xGp8dNVZ83Cx96nPD6nLZHHk2Lo0le0Fh+1j+X8qpvbPiMUjYicMhAJ0+Y6VCnhY86Ut+GY3yOeAMHc/CtWgwvHl9r7VP6FWqyqcPcuuRl3SYP1tvlSEeGYDZQSASeg6mpPiMEgOGxjGQBsKYrb5rdqXte1KjPi5Vs0SHi9kqhRJHsAOXl8K4fjNn+0T5fyqhewVy1hiuN+GXlm/134RZeOXkEgUROCQTnHlUTbuFcNqxgNg+uNqY2yaST6Ufcs2SfLNdbHk26dQXLMM47su4QjwzDLYGdyat8/F4NOFZSdhnHLbc1VFt8/OljYetYMkFOr+DTCbjZOQcXJniFmP12dMbbbkjBBzselaN2T4tM6rFd2ziZSVeVlXSxHLOOR+GKyrgSdzcwy89EinHxr0FcWrFs+Hffka81/HZRhtg4p2u/m1/wBNmmuVu/0C9kQj6o+VNprGP7op8oIG4+W9cPivLRc0+zZwV+74fH90VFyWafdFWO7SouWOujhlOuyDSKl2qt0ED7Y2NZ3weMNPGDyLD861rjXDhLGUPI1W+Hdj1jkDlmOk5HKvQaHVQx4JRk+THlxtyTRNQW645Ud1CqxucclJ/CnkcWKQ4oMxOOXhO/wrnx3Sml+Ze6SMs71vvfjQqS/oyP79CvWUjDuLLdcdP2c1Bw3UiFihK6udbD+gkI6UR7CxeVXbSmzIXvpzzdqbs0h5k1sR7DxeVE/YmIDJHqegHvNG0LM37Oxd2HupN+6KiEHkZ8hgSOoQAEjzZfWrRwLtTLcmRLnGkIXkkA0kQpu64G2XyFyMc6U7ZWlundW0WG0A6yDzkY5brjnt8KkezvZIC2Oo7zEMf/1qfAvuJ8X+XypV8BZmPF7yS4mkmbYu2cdFXkqj0AAHwppof1rZP0Jj8qH6FxY5U9oWY13betTHAchZMrnSMgkZ35YrT4+xkGQX2XmfyqD4rdxwSFYEXSpIA5jyz61r0sZRe9OjHqsqpQ23f6Ge37lmOrc0zEPkKtF42vmoz7qX7O8MSWXSxCgKTvtUcily3Ky3HJUltoqHcNRezmtXPZWHGzr865bstD94Vm2l9mXW9qdQGOe1PLeybONDb7EgVoqdnYk8Y3K70jNGo6jfcY/3rdpcSlB2zBqtQ8c0krMze2KkqQQRR+yvzwcVdOI8KEu/Juh/OoKbh7ocHl79qz5dPLG/KL8OpjkXh+CJZCnqRv8ALevRVo5eNGwPEqn5gGsZ4HwiNyxkYDTyHnWicO7V2yBYnYqVAXOCQcDzFea/jmknmjBwjdX+50tLkUW7ZZiD5U3mAPOiXjMB/wDVX41Ece4/oAEIErHnvsBXnMWhzSntUXZseSKV2dXkA6Ej41GvEw5Nn3ikOLcWdFjBCd44BK4IxnkAc70ml8mgNIdB688A11FoM2Ne5fcr9aL6Yv6EYNJslNm4xDyEgbPLzpc3I8j+FTWkyfEWJ5F5EbpwiljyAJPwrPuI8UllLZYhTyUcgKuHaW7AiKYOX2HLz3zVO7mutoNLsTlNc/mZs2S+EyN7uhUl3A8qFdMoPS4FEUpQCuXcKCSQAOZPICpCEnAUEkgAbknkB6mqld3T3jGNGKxKRk4+uRvv5AeX/RI8WLXAADYjJ2Uc2A6t5eg+PuRJ0BYY1GlQDIcjI5YHr1+VRcrGkRd1wQ/1iAFsZ1EA6tznPketSfY66LIYm+sh69V/kaUsHcuysBox4MbbczqHQ1FQv3NwHGy5GRnJw3P/AHpJjaLoY65MO1KKwxsc+XuNDSasIEXxbhnfR6NbJvnK8/xqpT/R9IxJ9oHxXf8AA1oGNqBGKlvdUReON3XJna/R63Wb5DFPrTsFENyxNXVlomWk5WNRoq6dj4R1b50ovZeLzb51NTzLGpd3VEUEszEAKPMsdgKVAyMjy2PMUhkB+ji9HakpOy6HmxPyqyrH1oygz5U06E0mU6XsoDycio667ELz1nf1NaAYxRd0MUObfYlCK6RnMfZErnSM/Go677JS6tQ+POtUMC+6iNuP+moUTsy6Tg9z93PuppLw24HNW+Vaz7IPL8a5azU+fuyaKGZJxaVmEYcHWq6ST1wfD+FNDayHzNa9JwpDuVU45ZGf40DwxMbInyFFCMjThsnRacpYzeRrU/Yl+4vyrkWaZ+oKVDszJ+FSuMMP5Ul+jko8vfWomwT7oxRTW4HJQPfRQrMy/RxvP8KOtC7of3aKnQWWi5uEjXU7aVGBk/hyqscU453hwp8AOwz1B2Y/lVg4lYmaFkwBkZXf7Q5ZqpydmbgfYB9zChjFLa9IXCDxHIBONs82NFHdYffmWBJHrtk/Omj8EmHOJqRexkXmjj4Go0OydtL0B2O+kAjPTbAGPmaZXeGZM5Ixv97f4VF6WHVhXWpvvN8zRQWXPgkpZNJ2K8v3enOpM1TuFcSkDqNmyfEWznTtn02Aqzi8Hn/vUkRMnvrCeV5uDRMydxLPexuMgd1oElugPX9dNg/u/J3b9oJ5ba74tEuGYQW8WV1d1Gmg3EmncHDyOcnbwZOwNW1O20byERW1zKgk7pp44wY9erSceIMyg8yAQKlLftBavKYEniMoyDGrKWGPrDSDnI6jpQBFdguKTTd/rnS4iRkEUgaJ3BK5dZDCAhx4SCB1IPKsxvJY1F04a2Ey38hGl3F8VFyPDCo8JyMgZ9a1xO09lpJW5gCAqCRImAWLBQd8Ako3PypSPjds0TTrNCYlJDSh00Kdti+cA7jb1FAFP43fXLx8XczgxQZSOBoomGWijfLllOoAnYHPM5zthLiXGb3XxForvu0s4baWOMRRMGL24dlYlchTg8j9r0xVqvO11nGsTNcRaJ2KI4ZSpK/WLNnAUciTyyPOnv8ATVv33s4nh74kfq9a6ztnBXOTtvjyoAonaXtPdIbpjdNbFIke1iW3EizBogzuXZDnDEjYgLpyc71a+PcNN1YqdeidESeGQYyk6JqDcuR3BHkTUR2phha79neG+uHkh71ooZisTRq2j9ZG0qqdwuwHWpmy7WWjW8UzTpAkmoKsxWNtUbaWXST9kjBxkct6AKnBfzpZJxAuElvZolnmC61tLTxKmhWyMLjckY1SEnO1H+lE6KH9p722j4hDE13oQLJbvGxfWVXThX0rrUDpV6v+LWsIUzXMMayDwanVVZcc1ydxvz5bimUXHrcSXMblYo7YxBndlEbd9GHXB5dQPU0AVG47UXE5Ps10FV+JpbRyCNGAgaAsdIZfENQyD123xWiwLpRFdy7ABS5ABcgYLEKMAk5OB51G8c43aWgjad1QSOETlzI+sc8lG2W6ZFOLnjFojpG9xCjuFKK0ihmDfVwCd8nl50AOu8BxzrnvfSm3GeLR23c94jHvp47dNIU4eUkKWyRhdt8ZPpSXE+MCCWJHEaxukrvI0qoUWJQ3hQ7uN9yOXWmA8BJP1TRAtnAFQfBO2tvPB7TI0dvGXKIZJoskgBvEFbwNg50nfrSnFu18EDMpV3Atvag8fdsjRd4seEJYZOWB8sHnSAmCr86J4GI3NccN4gs6FlDKFkkiIbAOqKRo2Ox5ZU4p5/3/AL5UwGfdHqf/AIodx55p0Urkj1oAa92PuUKc6vX+FCgCcAo8V0ooyKQHBWudFKYoiKAEZbdW2IB94FNJODxHfQo9wx/CpEiic4oAhpuER58Ix5++lEs1Xpn30+C9aGKYFE4PwS/sx7PB7K9uJWdJJO8EiRvIXZGjUYdtyA2oc+XSkR2XvWvIppHiZIrp5g2tgTEwcBFhEYVWAYAnUdXnWghB/wB+dE6591IDK77sxLb8NtLcRxvN7fG7kKzI2qeRlMpC5KBWUHbYA05vOw9zKZZ2aGOd7iC4WGMv3P6hGQBpNIYO2snUF2IHw0sx52oilAGeSdjp+7jkVIBcLee1OjyyPHJ4DGQZCmQxGknC4OKdW/Zy6S976PuoYWmMswSV5BLlSD+pePCOdssrdOVXcpRhNqAKL2t7Ly3F7HcLDbzItuYTHLJJFhzJq1AxoSdtvjTWHsjfR28EKyxMi9+HjDuioJSCipIY2d0QZGk6c5G/loYSj7ugDObLsddwCFoxaTSCzWzkSfWUTSztqjYKdSENuhAzjn5Fe9hLg3ct6kkQkWS3kgiOe4YxQrHJ3iaToOx0MMla0bTRBaAKz2x4HJdQwmMR97FcQ3AWQnQ/dnxIXCkgEHnjp8oHivY+7lN2qi003oiMrvrZ4GRFVhF4cSqMErnRitDCVF3vaGzhcpLd28bjmrSxqw94LZFAEZ2v4JNPHbC37syQXEM/61ioYRZ2JVSck46U1l4Ndz3NvPOlundJcxlUkdwwmjQIRqQdVbI8sc81Kntbw7+32v8ArR/8qA7X8P8A7fa/68f/ACoAqq9iblIrExtH3ttE8Uia3jVteCWSRUJB8ODldx5YqX7O9mWt5IT3UIRLVomIeV2DvMJWRA/hMWeRI1chyqTPa3h/9vtP9aL/AJVz+lvD/wC32v8ArR/h4qAJXR0xj8+u1GVwOfX30hw7ilvcZME8UwH1u7dXxnz0nanmKYCOmi09KW01yFz/APP+9AHHdeg/78KFL4H/AHFCgCTHKhiugNqOogcGixXeKGKAOMUnIc0swrjRTAT00eK7K0NFAFbtuKy5RWMZZnQPuAgV1kOqJ0LZBMeAHwdt+dKW3Htb92iKSWjwdbBdEizMGOUBziBtsdRvU93C8tIwTk7Dc+Z9aCxAcgB1Ow5/nuaAIGz40x7oOsYL7Eq7MAxZlCgacg7fawN+eaRvuLSB20lFVSo8ZAzqlaHOD9bxKTgFcArzJ2sQgXOdIz54HXnSL8OjLayp1czhmAO2PEoOG2AG45ACgCI4xeSiFZYjp1KpwVDAM2MaztpXcZPTn0riW+lV2TUC32cd0RpVoxId3BD+JsBsDJA8gbDoomgXfKjfnsN/f50AViLi857tig0tIsYA7vxKZ2jZzh85CAMNIYbNuRyshSlO6GQcDIGAcch6HyrrTQAjpoaaW00CtAFY+kK/lt+G3M0O0ix+EjmupgpYeoBJ+Fed+A9n7a5tzNNfxwymdYyjlc6GeENIQWDHaWRs8v1R35keqbm0WRGjkUOjqVdSMhlYYII8sVlV/wDQPbM5MV1LGpJIQqr6fQNkEj37+poGZyvZCyy2eIxriSJN2hOkP7Nq1FZDqI76XxJlR7O+SM7NbTsxaNdvA3EYkiEcTpcHTokZ3iVlA1ZTAd9juNHiwM40f/wHF/bn/wBJf+dF/wCBIv7c/wDpL/ypAUS07H2LCPXxSNC0Zck92RnEJ07PlTmV1w2CTCxAxVv+hrs7aibiE4CXb2pKW4IyGA7zEigavr6AFIBxvjOae/8AgOL+3P8A6S/86lezn0TSWMvfW3E5I2xhv1KFWXOdLKWwRtQA/wCPyhrGPiIjWK6iliWORAF9oRpURlwCS0cgYgAkjIypYYZrvo51DL2aeSWOW7uWue6OuKPQsUKSDk5QZLuOhJwOYGd6ntFMQiVxXJjpzooFKAG3df8AcUdONFCgBwvL/vlQoUKQB0YoUKAOTRUKFABGjoUKYANEKOhQAVCjoUAc0YoUKABQoUKABQo6FAHNGKFCgAq5oUKAO6KhQoAI0KFCgAGhQoUAHQoUKAP/2Q=="
                  alt="Professional cleaning service by Kushi Services"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating Trust Badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="text-peach-600" size={20} />
                    <div>
                      <div className="text-sm font-bold text-navy-800">Fully Insured</div>
                      <div className="text-xs text-navy-600">Licensed & Bonded</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-peach-500 p-4 rounded-xl shadow-lg animate-bounce">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-navy-500 to-navy-600 text-white p-3 rounded-xl shadow-lg">
                <Award size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Our <span className="bg-gradient-to-r from-peach-200 to-navy-800 bg-clip-text text-transparent">Premium Services</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of professional cleaning and maintenance services, 
              each tailored to meet your specific needs with guaranteed excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Link
                  key={index}
                  to={service.link}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-peach-400 hover:shadow-2xl transition-all transform hover:-translate-y-4 hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className={`absolute top-4 left-4 bg-gradient-to-r ${service.gradient} p-3 rounded-lg shadow-lg`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-bold bg-black/30 backdrop-blur-sm px-2 py-1 rounded">{service.price}</div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-navy-800 mb-3 group-hover:text-peach-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-navy-600 mb-4">{service.description}</p>
                    
                    {/* Service List */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.services.slice(0, 3).map((subService, idx) => (
                          <span key={idx} className="text-xs bg-peach-50 text-peach-400 px-2 py-1 rounded-full border border-peach-200">
                            {subService}
                          </span>
                        ))}
                        {service.services.length > 3 && (
                          <span className="text-xs bg-navy-100 text-navy-800 px-2 py-1 rounded-full border border-navy-200">
                            +{service.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-navy-600 font-bold group-hover:text-navy-700">
                      Explore Services
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-peach-50 to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-peach-200 to-navy-600 bg-clip-text text-transparent">Kushi Services</span>?
            </h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              With years of experience and a commitment to perfection, we provide reliable, 
              professional cleaning solutions that exceed the highest industry standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-peach-50 hover:to-navy-50 transition-all transform hover:-translate-y-2 border-2 border-peach-200 shadow-lg hover:shadow-xl"
                >
                  <div className="bg-gradient-to-r from-peach-200 to-navy-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-800 mb-4">{feature.title}</h3>
                  <p className="text-navy-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              What Our <span className="bg-gradient-to-r from-peach-200 to-navy-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers who trust Kushi Services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-peach-50 to-navy-50 rounded-2xl p-6 border-2 border-peach-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="mb-4">
                  <h4 className="font-bold text-navy-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-navy-600">{testimonial.role}</p>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-navy-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-peach-100 to-navy-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
            Ready for <span className="bg-gradient-to-r from-peach-200 to-navy-800 bg-clip-text text-transparent">Premium Service</span>?
          </h2>
          <p className="text-xl text-navy-600 mb-8">
            Experience the Kushi Services difference today. Get instant quotes, schedule services, 
            or speak with our experts for a personalized cleaning solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-peach-200 to-navy-800 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-peach-600 hover:to-navy-700 transition-all shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Phone size={20} />
              Get Free Quote
            </Link>
            <Link
              to="/services"
              className="border-2 border-navy-600 text-navy-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-navy-600 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              View All Services
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-peach-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-navy-700">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-peach-200" />
                <span className="font-semibold">9606999081/82/83/84/85</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-peach-200" />
                <span>No 115, GVR Complex, Thambu Chetty Palya Main Rd, opposite to Axis Bank ATM, P and T Layout, Anandapura, Battarahalli, Bengaluru, Karnataka 560049</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-peach-200" />
                <span>24/7 Emergency Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;