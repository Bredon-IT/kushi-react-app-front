import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Package, Star } from 'lucide-react';

interface Order {
  id: number;
  date: string;
  address: string;
  amount: number;
  status: 'Completed' | 'Pending';
  services: string[];
  rating?: number;
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (!user || !user.id) return;

  setIsLoading(true);

  fetch(`https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth/orders/${user.id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) setOrders(data);
      else setOrders([]);
    })
    .catch(() => setOrders([]))
    .finally(() => setIsLoading(false));
}, [user]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  if (!user) {
    return (
      <div className="py-28 bg-gradient-to-br from-peach-50 to-navy-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-peach-200 p-12 text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">
            Please log in to view your orders
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 bg-gradient-to-br from-peach-50 to-navy-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-6">My Orders / Bookings</h2>

        {/* Status Filter */}
        <div className="flex gap-3 mb-6">
          {['All', 'Completed', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                statusFilter === status
                  ? 'bg-peach-600 text-white'
                  : 'bg-white border border-peach-300 text-peach-700 hover:bg-peach-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders */}
        {isLoading ? (
          <div className="text-center py-12 text-navy-600">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="text-navy-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">No Orders Found</h3>
            <p className="text-navy-600">You haven't placed any orders in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-6 border border-peach-200 shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 mb-1">
                      Order #{order.id}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-navy-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(order.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span>
                      </div>
                      {order.address && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{order.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 lg:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-2xl font-bold text-peach-600">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h4 className="font-semibold text-navy-800 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.services.map((service, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-navy-700 border border-peach-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating / Actions */}
                {order.status === 'Completed' && (
                  <div className="flex items-center gap-4">
                    {order.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-navy-600">Your Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < order.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button className="text-sm text-peach-600 hover:text-peach-700 font-medium">
                        Rate Service
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
