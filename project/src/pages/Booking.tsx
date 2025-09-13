import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, Home, Building, Bug, Wrench, Truck, CheckCircle, ArrowLeft, Star, CreditCard } from 'lucide-react';
import { BookingAPIService } from "../services/BookingAPIService";

interface BookingForm {
  serviceCategory: string;
  specificService: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  specialRequests: string;
}
 
interface CartItem {
  id: string;
  name: string;
  discountedPrice: number;
  originalPrice: number;
  quantity: number;
  tier: string;
  duration: string;
  rating: number;
  reviews: string;
  description: string;
  category: string;
  subcategory: string;
}

const Booking: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();


  // Get cart items from localStorage
  const getCartFromStorage = (): CartItem[] => {
    try {
      const savedCart = localStorage.getItem('kushiServicesCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  };
  
  const cartItems = getCartFromStorage();

  // Get promo discount from location state or default to 0
  const appliedPromo = location.state?.appliedPromo || '';
  const promoDiscount = location.state?.promoDiscount || 0;
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalSavings = originalTotal - subtotal;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const totalAmount = subtotal + tax;

  const [formData, setFormData] = useState<BookingForm>({
    serviceCategory: '',
   specificService: cartItems.length ? cartItems.map(i => i.name).join(', ') : '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  

  const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];
 
 const validateForm = () => {
  const newErrors: any = {};

  // Service validations
 
  if (!formData.date) newErrors.date = 'Please select a date';
  if (!formData.time) newErrors.time = 'Please select a time';

  // Name validations
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (!/^[A-Z][a-zA-Z\s]*$/.test(formData.name)) {
    newErrors.name = 'Name should start with a capital letter';
  }

  // Email validations
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  } else if (!/^[a-z]/.test(formData.email)) {
    newErrors.email = 'Email should start with a lowercase letter';
  }

  // Phone validations
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    newErrors.phone = 'Phone number must be 10 digits';
  }

  // Address validations
  if (!formData.address.trim()) newErrors.address = 'Address is required';
  if (!formData.city.trim()) newErrors.city = 'City is required';

  // Pincode validations
  if (!formData.pincode.trim()) {
    newErrors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(formData.pincode)) {
    newErrors.pincode = 'Pincode must be 6 digits';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

 
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

if (!validateForm()) return;
   setIsLoading(true);
    try {
      // Build payload exactly as backend DTO expects (BookingRequest)
      const bookingData = {
        customerId: null, // optional
        customerName: formData.name,
        customerEmail: formData.email,
        customerNumber: formData.phone,
        addressLine1: formData.address,
        addressLine2: '',
        addressLine3: '',
        city: formData.city,
        zipCode: formData.pincode,
        bookingAmount: subtotal,
        totalAmount: totalAmount,
        bookingDate: toISODateTime(formData.date, formData.time), // <<< correct format
        bookingServiceName:
          formData.specificService || (cartItems.length ? cartItems.map(i => i.name).join(', ') : ''),
        bookingStatus: "Pending",
        bookingTime: formData.time,
        confirmationDate: "",
        createdBy: "Customer",
        createdDate: "",
        paymentStatus: "Unpaid",
        referenceDetails: "",
        referenceName: "",
        remarks: formData.specialRequests,
        updatedBy: "",
        updatedDate: "",
        workerAssign: "",
        visitList: "",
        // match DTO names:
        service_id: cartItems.length ? Number(cartItems[0].id) : null,
        user: null
      };

      await BookingAPIService.createBooking(bookingData);

     
      // optional: go to payment page carrying context
      navigate('/payment', { state: bookingData, replace: true });


      // clear cart and form
      localStorage.removeItem('kushiServicesCart');
      setFormData({
        serviceCategory: '',
        specificService: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        specialRequests: ''
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      alert("Failed to submit booking. Please try again.");
    }
  };


 const getAvailableTimeSlots = () => {
    if (!formData.date) return timeSlots;
    const selected = new Date(formData.date);
    const now = new Date();
    const isToday =
      selected.getFullYear() === now.getFullYear() &&
      selected.getMonth() === now.getMonth() &&
      selected.getDate() === now.getDate();

    if (!isToday) return timeSlots;

    const ch = now.getHours(), cm = now.getMinutes();
    return timeSlots.filter(slot => {
      const [time, period] = slot.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h > ch || (h === ch && m > cm);
    });
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'serviceCategory') {
      setFormData(prev => ({ ...prev, serviceCategory: value, specificService: '' }));
    }
    if (errors[name]) setErrors((p: any) => ({ ...p, [name]: '' }));
  };
 
   const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Standard': return 'bg-navy-100 text-navy-800 border-navy-200';
      case 'Essential': return 'bg-peach-100 text-peach-800 border-peach-200';
      case 'Premium': return 'bg-gradient-to-r from-peach-100 to-navy-100 text-navy-800 border-navy-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  const toISODateTime = (dateStr: string, slot: string) => {
    if (!dateStr || !slot) return null;
    const [t, period] = slot.split(' ');
    let [h, m] = t.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${dateStr}T${hh}:${mm}:00`;
  };

 
  if (isSubmitted) {
    return (
      <div className="py-28 bg-gradient-to-br from-peach-50 to-teal-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden text-center p-12">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for choosing Kushi Services. Your booking has been successfully submitted.
            </p>
             {/* Booking Summary */}
            <div className="bg-gradient-to-r from-peach-50 to-navy-50 rounded-xl p-6 mb-8 border border-peach-200">
              <h3 className="font-bold text-navy-800 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm text-navy-600">
                <div className="flex justify-between">
                  <span>Total Services:</span>
                  <span className="font-medium">{cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total Savings:</span>
                  <span className="font-medium">-₹{(totalSavings + promoDiscount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>


                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-peach-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Applied:</span>
                    <span className="font-medium">{appliedPromo}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-700">
                We'll contact you within 24 hours to confirm your appointment and provide further details.
              </p>
                   <div className="flex items-center justify-center gap-2 text-peach-600">
                <Phone size={16} />
                <span className="text-sm">+91 98765 43210</span>
              </div>
            </div>    
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-peach-600 to-navy-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-peach-700 hover:to-navy-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Payment
              </button>
              <Link
            
                to="/services"
                className="border-2 border-navy-600 text-navy-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-navy-600 hover:text-white transition-all text-center"
              >
                Browse Services
              </Link>    
               </div>
          </div>
        </div>
      </div>
    );
  }

          
  return (
    <div className="py-28 bg-gradient-to-br from-peach-50 to-teal-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Back to Cart */}
        {cartItems.length > 0 && (
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-peach-600 hover:text-peach-700 font-medium bg-white px-4 py-2 rounded-lg shadow-md border border-peach-200"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Book Your <span className="bg-gradient-to-r from-peach-600 to-navy-900 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule your professional cleaning service with our expert team.
            Choose your preferred date, time, and service type.
          </p>
        </div>
 
       <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-peach-200 overflow-hidden">
              <div className="bg-gradient-to-r from-peach-600 to-navy-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Service Booking Form</h2>
                <p className="text-peach-100">Fill in the details below to schedule your service</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Service Information (if from cart) */}
                {cartItems.length > 0 && (
                  <div className="bg-gradient-to-r from-peach-50 to-navy-50 rounded-xl p-6 border border-peach-200">
                    <h3 className="font-bold text-navy-800 mb-4">Selected Services</h3>
                    <div className="space-y-3">
                      {cartItems.map((item: CartItem, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-peach-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getTierColor(item.tier)}`}>
                                {item.tier}
                              </span>
                              <span className="text-xs text-navy-500">{item.duration}</span>
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-current" />
                                <span className="text-xs font-bold text-navy-700">{item.rating}</span>
                                <span className="text-xs text-navy-500">({item.reviews})</span>
                              </div>
                            </div>
                            <h4 className="font-medium text-navy-800">{item.name}</h4>
                            <p className="text-xs text-navy-600 mt-1">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-navy-600">Qty: {item.quantity}</div>
                            <div className="font-bold text-peach-600">₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</div>
                            <div className="text-xs text-navy-500 line-through">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
 
            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
 
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a time slot</option>
                   {getAvailableTimeSlots().map(slot => (
    <option key={slot} value={slot}>{slot}</option>
  ))}
                  </select>
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
              </div>
            </div>
 
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
 
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>
 
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
 
            {/* Address Information */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Service Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete address where service is required"
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
 
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mumbai"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
 
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="400001"
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>
            </div>
 
            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any specific requirements, areas of focus, or additional information..."
              />
            </div>
 
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-peach-600 to-navy-900 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:from-peach-200 hover:to-blue-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing Booking...
                  </>
                ) : (
                  <>
                    <Calendar size={20} />
                    Confirm Booking
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
               You'll be redirected to secure payment after confirming booking details
              </p>
            </div>
          </form>
        </div>
      </div>
       {/* Order Summary Sidebar */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-peach-200 sticky top-24">
                <h3 className="text-xl font-bold text-navy-900 mb-6">Booking Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-peach-50 rounded-lg border border-peach-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-navy-800 text-sm">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getTierColor(item.tier)}`}>
                            {item.tier}
                          </span>
                          <span className="text-xs text-navy-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-peach-600">
                          ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-navy-500 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-peach-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-navy-700">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Savings:</span>
                    <span>-₹{(totalSavings + promoDiscount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-navy-700">
                    <span>GST (18%):</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-navy-900 border-t pt-2">
                    <span>Total Services:</span>
                    <span>{cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-peach-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedPromo && (
                    <div className="text-sm text-green-600 mt-2">
                      Promo "{appliedPromo}" applied ✓
                    </div>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 space-y-3 pt-6 border-t border-peach-200">
                  <div className="flex items-center gap-2 text-sm text-navy-600">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>100% Secure Booking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy-600">
                    <Star size={16} className="text-yellow-500" />
                    <span>4.9★ Rated Service</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy-600">
                    <Phone size={16} className="text-peach-600" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Booking;