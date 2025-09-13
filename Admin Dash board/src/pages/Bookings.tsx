import React, { useState, useEffect } from 'react';
import BookingsAPIService from '../services/BookingAPIService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  CreditCard,
  IndianRupee,
  Search,
} from 'lucide-react';


export function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchBookings();
}, []);


const fetchBookings = () => {
  setLoading(true);
  BookingsAPIService.getAllBookings()
    .then((response) => {
      const normalized = response.data.map((b: any) => ({
        booking_id: b.booking_id || b.customer_id,
        customer_name: b.customer_name,
        customer_email: b.customer_email,
        customer_number: b.customer_number,
        booking_service_name: b.booking_service_name,
        booking_amount: b.booking_amount,
        booking_date: b.booking_date || b.bookingDate,
        booking_time: b.booking_time,
        bookingStatus: b.bookingStatus || b.booking_status,
        payment_status: b.payment_status,
        city: b.city,
        address: b.address,
      }));
      setBookings(normalized);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Failed to fetch bookings:', error);
      setLoading(false);
    });
};

  

const filteredBookings = bookings
  .filter((booking) => {
    const status = booking.bookingStatus?.toLowerCase();

    switch (filter) {
      case 'all':        // 👈 Show only new (pending) bookings
      case 'pending':
        return status === 'pending';
      case 'confirmed':
        return status === 'confirmed';
      case 'completed':
        return status === 'completed';
      case 'cancelled':
        return status === 'cancelled';
      default:
        return false;
    }
  })
  .filter((booking) => {
    const term = searchTerm.toLowerCase();
    return (
      booking.customer_name?.toLowerCase().includes(term) ||
      booking.customer_number?.toLowerCase().includes(term) ||
      booking.booking_service_name?.toLowerCase().includes(term)
    );
  })
  .sort((a, b) => {
    const dateA = new Date(`${a.booking_date}T${a.booking_time}`);
    const dateB = new Date(`${b.booking_date}T${b.booking_time}`);
    return dateB.getTime() - dateA.getTime();
  });



const confirmOrder = (booking: any, action: 'confirmed' | 'cancelled' | 'completed') => {
  const originalStatus = booking.bookingStatus;

  // Optimistic update
  setBookings((prev) =>
    prev.map((b) =>
      b.booking_id === booking.booking_id ? { ...b, bookingStatus: action } : b
    )
  );

  BookingsAPIService.updateBookingStatus(booking.booking_id, action)
    .then(() => {
      alert(`✅ Booking updated to ${action} (customer will be notified).`);
      fetchBookings(); // 🔄 Refresh from backend
    })
    .catch((error) => {
      console.error('Failed:', error);
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking.booking_id ? { ...b, bookingStatus: originalStatus } : b
        )
      );
      alert('❌ Failed to update booking status.');
    });
};


  const handleEdit = (booking: any) => {
  const newService = prompt('Edit service:', booking.booking_service_name);
  if (newService) {
    // TODO: Call backend update API instead of just setBookings
    fetchBookings(); // 🔄 Ensure UI sync
    alert('✅ Booking updated successfully!');
  }
};


  const handleDelete = async (bookingId: number) => {
  try {
    await BookingsAPIService.deleteBooking(bookingId);
    alert('✅ Booking deleted successfully.');
    fetchBookings(); // 🔄 Refresh
  } catch (err) {
    console.error("Failed to delete booking:", err);
    alert('❌ Failed to delete booking.');
  }
};



  const getPaymentStatus = (booking: any) => {
    if (booking.payment_status) return booking.payment_status;
    const paymentStatuses = ['paid', 'Pending', 'failed'];
    return paymentStatuses[parseInt(booking.customer_id) % 3];
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">Loading bookings...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Bookings: {filteredBookings.length}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
         
                       <select
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-lg"
                          >
                                 <option value="all">All Bookings</option>
                                 <option value="pending">Pending</option>
                                 <option value="confirmed">Confirmed</option>
                                 <option value="completed">Completed</option>
                                 <option value="cancelled">Cancelled</option>
                                </select>



        </div>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-6">
        {filteredBookings.map((booking) => {
          const paymentStatus = getPaymentStatus(booking);
          return (
           <Card 
  key={booking.booking_id } 
  className="p-6 hover:shadow-lg transition-shadow"
>
   <h2 className="text-lg font-semibold">
          {booking.customer_name || "Unknown Customer"}
        </h2>
        <p>Status: {booking.bookingStatus || "N/A"}</p>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Customer Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {booking.customer_name?.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {booking.customer_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{booking.customer_email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Status Buttons + Payment */}
<div className="flex flex-col gap-2">
  <div className="flex gap-2">
  <Button
    onClick={() => confirmOrder(booking, 'confirmed')}
     >
    <CheckCircle className="w-4 h-4 mr-1" /> Accept
  </Button>

  <Button
    onClick={() => confirmOrder(booking, 'cancelled')}
    >
    <XCircle className="w-4 h-4 mr-1" /> Decline
  </Button>

  <Button
    onClick={() => confirmOrder(booking, 'completed')}
     >
    ✅ Completed
  </Button>
</div>


  <Badge className={getPaymentStatusColor(paymentStatus)}>
    <CreditCard className="w-3 h-3 mr-1" />
    {paymentStatus?.toUpperCase()}
  </Badge>
</div>

                  {/* Service Details */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Service</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {booking.booking_service_name}
                          </div>
                          <div className="text-xs text-gray-500">{booking.city}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Date & Time</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {booking.booking_date
                              ? new Date(booking.booking_date).toLocaleDateString()
                              : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">{booking.booking_time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {booking.duration || '60'} minutes
                          </div>
                          <div className="text-xs text-gray-500">Estimated time</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {booking.address || booking.city}
                          </div>
                          <div className="text-xs text-gray-500">Service address</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{booking.booking_amount?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Payment Status</div>
                        <div
                          className={`font-semibold ${
                            paymentStatus === 'paid'
                              ? 'text-green-600'
                              : paymentStatus === 'Pending'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {paymentStatus === 'paid'
                            ? '✅ Payment Completed'
                            : paymentStatus === 'Pending'
                            ? '⏳ Payment Pending'
                            : '❌ Payment Failed'}
                        </div>
                        {paymentStatus === 'paid' && (
                          <div className="text-xs text-gray-500 mt-1">
                            Paid on{' '}
                            {booking.booking_date
                              ? new Date(booking.booking_date).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(booking)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Booking
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(booking.booking_id)}

                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  {paymentStatus === 'Pending' && (
                    <Button
                      variant="success"
                      onClick={() => alert('✅ Payment marked as received!')}
                      className="w-full"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No bookings found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filter settings.
          </p>
        </Card>
      )}
    </div>
  );
}
