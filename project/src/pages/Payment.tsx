import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building, Shield, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { QRCode } from 'react-qrcode-logo';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  processingFee?: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const bookingData = location.state;

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay securely with your card', processingFee: 0 },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone, description: 'Pay with Google Pay, PhonePe, Paytm', processingFee: 0 },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'Pay through your bank account', processingFee: 0 },
    { id: 'cash', name: 'Cash on Delivery', icon: CreditCard, description: 'Pay with cash at the time of service' }
  ];

  if (!bookingData) {
    return (
      <div className="py-28 bg-gradient-to-br from-peach-50 to-navy-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-peach-200 p-12 text-center">
            <h1 className="text-2xl font-bold text-navy-900 mb-4">No Payment Data Found</h1>
            <p className="text-navy-600 mb-6">Please complete your booking first.</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-gradient-to-r from-peach-600 to-navy-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-peach-700 hover:to-navy-800 transition-all"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { totalAmount, cartItems, subtotal, tax, totalSavings, promoDiscount } = bookingData;

  const upiLink = (upiId: string, amount: number, name: string) =>
    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    if (selectedMethod === 'cash') {
      placeBooking();
      return;
    }

    if (selectedMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }

      if (isMobile) {
        window.location.href = upiLink(upiId, totalAmount, user?.name || 'Kushi Services');
        return;
      } else {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        placeBooking();
      }
      return;
    }

    // Card or Netbanking
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    placeBooking();
  };

  const placeBooking = () => {
    if (isAuthenticated && user) {
      const updatedUser = {
        ...user,
        totalSpent: selectedMethod === 'cash' ? 0 : user.totalSpent + totalAmount,
        totalBookings: user.totalBookings + 1
      };
      localStorage.setItem('kushiUser', JSON.stringify(updatedUser));

      const existingUsers = JSON.parse(localStorage.getItem('kushiUsers') || '[]');
      const updatedUsers = existingUsers.map((u: any) =>
        u.id === user.id ? { ...u, ...updatedUser } : u
      );
      localStorage.setItem('kushiUsers', JSON.stringify(updatedUsers));
    }

    localStorage.removeItem('kushiServicesCart');
    setPaymentSuccess(true);

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="py-28 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-200 p-12 text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-navy-900 mb-6">Payment Successful!</h1>
            <p className="text-xl text-navy-600 mb-8">
              Your payment of ₹{totalAmount.toLocaleString('en-IN')} has been processed successfully.
            </p>
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-green-800 mb-2">What's Next?</h3>
              <p className="text-green-700">
                We'll contact you within 24 hours to confirm your service appointment. 
                You'll receive a confirmation email shortly.
              </p>
            </div>
            <p className="text-navy-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 bg-gradient-to-br from-peach-50 to-navy-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-peach-600 hover:text-peach-700 font-medium bg-white px-4 py-2 rounded-lg shadow-md border border-peach-200"
          >
            <ArrowLeft size={20} />
            Back to Booking
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-6">
            Secure <span className="bg-gradient-to-r from-peach-600 to-navy-700 bg-clip-text text-transparent">Payment</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-3xl mx-auto">
            Complete your booking with our secure payment system. Your payment information is encrypted and protected.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-peach-200 overflow-hidden">
              <div className="bg-gradient-to-r from-peach-600 to-navy-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock size={24} />
                  Choose Payment Method
                </h2>
                <p className="text-peach-100">All payments are secured with 256-bit SSL encryption</p>
              </div>

              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-peach-500 bg-peach-50'
                            : 'border-peach-200 hover:border-peach-300 hover:bg-peach-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            selectedMethod === method.id ? 'bg-peach-500 text-white' : 'bg-peach-100 text-peach-600'
                          }`}>
                            <IconComponent size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-navy-900">{method.name}</h3>
                            <p className="text-navy-600 text-sm">{method.description}</p>
                          </div>
                          {method.processingFee === 0 && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              No Fee
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Forms */}
                {selectedMethod === 'card' && (
                  <div className="space-y-6 p-6 bg-peach-50 rounded-xl">
                    <h3 className="font-bold text-navy-900 mb-4">Card Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-navy-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          placeholder="123"
                          className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                          maxLength={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-navy-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'upi' && (
                  <div className="space-y-6 p-6 bg-peach-50 rounded-xl">
                    <h3 className="font-bold text-navy-900 mb-4">UPI Payment</h3>

                    {!isMobile && (
                      <>
                        <label className="block text-sm font-semibold text-navy-700 mb-2">Enter UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@bank"
                          className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
                        />
                        {upiId && (
                          <div className="mt-4 text-center">
                            <p className="mb-2 text-sm text-navy-600">Scan QR to pay:</p>
                            <QRCode value={upiLink(upiId, totalAmount, user?.name || 'Kushi Services')} size={180} />
                          </div>
                        )}
                      </>
                    )}

                    {isMobile && (
                      <>
                        <label className="block text-sm font-semibold text-navy-700 mb-2">Select UPI App</label>
                        <div className="flex gap-3">
                          {['gpay', 'phonepe', 'paytm'].map((app) => (
                            <button
                              key={app}
                              onClick={() => {
                                window.location.href = upiLink(upiId, totalAmount, user?.name || 'Kushi Services');
                              }}
                              className="bg-peach-100 hover:bg-peach-200 px-4 py-2 rounded-lg text-navy-900 font-medium"
                            >
                              {app.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-6 p-6 bg-peach-50 rounded-xl">
                    <h3 className="font-bold text-navy-900 mb-4">Select Your Bank</h3>
                    <select className="w-full px-4 py-3 border-2 border-peach-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500">
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {selectedMethod === 'cash' && (
                  <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 mb-4">
                    <strong>Note:</strong> You have selected Cash on Delivery. Please pay the amount to the service provider at the time of service.
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full bg-gradient-to-r from-peach-600 to-navy-700 text-white py-4 rounded-xl text-lg font-bold hover:from-peach-700 hover:to-navy-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield size={20} />
                      Pay ₹{totalAmount.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-peach-200 sticky top-24">
              <h3 className="text-xl font-bold text-navy-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-peach-50 rounded-lg border border-peach-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-navy-800 text-sm">{item.name}</h4>
                      <div className="text-xs text-navy-500 mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-peach-600">
                        ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-peach-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-navy-700">
                  <span>Subtotal:</span>
                  <span>₹{subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Savings:</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo Discount:</span>
                    <span>-₹{Math.round(promoDiscount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy-900 text-lg">
                  <span>Total:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
