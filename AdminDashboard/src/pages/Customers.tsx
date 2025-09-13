import { useEffect, useState, useMemo } from 'react';
import { Search, Mail, Phone, Home, Gift, Ban, Ticket, Users, CheckCircle, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import CustomerAPIService from '../services/CustomerAPIService';
import { Button } from '../components/ui/Button';

export interface Customer {
  booking_id: number;          // instead of bookingId
   userId?: number | null;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_number: string;
  address_line_1?: string;
  bookingDate?: string;        // use bookingDate as in backend
  booking_time?: string;
  total_amount: number;
  bookingStatus: string;       // backend field
}


export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCustomers(filter);
  }, [filter]);

const fetchCustomers = async (statusFilter: string) => {
  try {
    let data;
    if (statusFilter === 'all') {
      data = await CustomerAPIService.getAllCustomers();
    } else if (statusFilter === 'loggedIn') {
      data = await CustomerAPIService.getLoggedInCustomers();
    } else if (statusFilter === 'guest') {
      data = await CustomerAPIService.getGuestCustomers();
    } else if (statusFilter === 'completed') {
      data = await CustomerAPIService.getCompletedCustomers();
    } else {
      data = await CustomerAPIService.getCustomersByBookingStatus(statusFilter);
    }
    console.log('Fetched customers for filter', statusFilter, data);
    setCustomers(data);
  } catch (error) {
    console.error('Failed to load customers:', error);
  }
};


useEffect(() => {
  if (customers.length > 0 && !selectedCustomerEmail) {
    setSelectedCustomerEmail(customers[0].customer_email);
  }
}, [customers]);



  // Group customers by email
  const customerDataMap = useMemo(() => {
    const map = new Map();
    customers.forEach(customer => {
      if (!map.has(customer.customer_email)) {
        map.set(customer.customer_email, {
          ...customer,
          bookings: [],
          totalRevenue: 0,
          totalBookings: 0,
        });
      }
      const data = map.get(customer.customer_email);
      data.bookings.push(customer);
      data.totalRevenue += customer.total_amount || 0;
      data.totalBookings += 1;
    });
    return map;
  }, [customers]);

  // Apply search + filters
const filteredCustomers = useMemo(() => {
  const term = searchTerm.trim().toLowerCase();
  const uniqueCustomers = Array.from(customerDataMap.values());

  return uniqueCustomers.filter(customer => {
    let matchesFilter = false;

    if (filter === 'all') matchesFilter = true;
    else if (filter === 'completed') matchesFilter = customer.bookingStatus?.toLowerCase() === 'completed';
    else if (filter === 'confirmed') matchesFilter = customer.bookingStatus?.toLowerCase() === 'confirmed';
    else if (filter === 'cancelled') matchesFilter = customer.bookingStatus?.toLowerCase() === 'cancelled';
    else if (filter === 'loggedIn') matchesFilter = !!customer.userId;  // ✅ logged in users
    else if (filter === 'guest') matchesFilter = customer.userId == null; // ✅ guest users

    const matchesSearch =
      (customer.customer_name?.toLowerCase().includes(term)) ||
      (customer.customer_email?.toLowerCase().includes(term)) ||
      (customer.customer_number?.toString().includes(term));

    return matchesFilter && matchesSearch;
  });
}, [customerDataMap, searchTerm, filter]);

  const selectedBookings = useMemo(() => {
    const selected = customerDataMap.get(selectedCustomerEmail);
    return selected ? selected.bookings : [];
  }, [customerDataMap, selectedCustomerEmail]);

const handleBlock = async (id: number | null | undefined) => {
  if (!id) {
    console.error('Invalid customer ID:', id);
    return;
  }
  try {
    await CustomerAPIService.blockCustomer(id);
    fetchCustomers(filter);
  } catch (err) {
    console.error('Failed to block customer:', err);
  }
};


  const handleReward = async (id: number) => {
    try {
      await CustomerAPIService.addReward(id);
      alert('Reward added!');
    } catch (err) {
      console.error('Failed to add reward:', err);
    }
  };

  const handleCoupon = async (id: number) => {
    try {
      await CustomerAPIService.addCoupon(id);
      alert('Coupon added!');
    } catch (err) {
      console.error('Failed to add coupon:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔍 Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
  <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')} className="flex-1">
    <Users className="w-4 h-4 mr-1" /> All Customers
  </Button>
  <Button variant={filter === 'loggedIn' ? 'primary' : 'secondary'} onClick={() => setFilter('loggedIn')} className="flex-1">
    <UserCheck className="w-4 h-4 mr-1" /> Logged Customers
  </Button>
  <Button variant={filter === 'guest' ? 'primary' : 'secondary'} onClick={() => setFilter('guest')} className="flex-1">
    <UserX className="w-4 h-4 mr-1" /> Guest
  </Button>
  <Button variant={filter === 'completed' ? 'primary' : 'secondary'} onClick={() => setFilter('completed')} className="flex-1">
    <CheckCircle className="w-4 h-4 mr-1" /> Completed
  </Button>
</div>


      {/* Customer List */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Customers</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {filteredCustomers.map((customer, index) => {
              const isSelected = selectedCustomerEmail === customer.customer_email;
              const totalBookings = customerDataMap.get(customer.customer_email)?.totalBookings ?? 0;
              const totalRevenue = customerDataMap.get(customer.customer_email)?.totalRevenue ?? 0;

              return (
               <div key={customer.customer_email ?? customer.customer_id ?? `customer-${index}`}

                  className={`flex flex-col p-4 border rounded-xl transition hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setSelectedCustomerEmail(isSelected ? null : customer.customer_email)}
                  >
                    {/* Avatar */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {customer.customer_name
                          ? customer.customer_name.split(' ').map((n) => n[0]).join('')
                          : '?'}
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{customer.customer_name}</div>
                        <div className="text-sm text-gray-500">{customer.customer_email}</div>
                        <div className="text-sm text-gray-500">{customer.customer_number}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={(e) => { e.stopPropagation(); handleBlock(customer.customer_id); }}>
                        <Ban className="w-4 h-4 mr-1" /> Block
                      </Button>
                      <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleReward(customer.customer_id); }}>
                        <Gift className="w-4 h-4 mr-1" /> Reward
                      </Button>
                      <Button variant="secondary" onClick={(e) => { e.stopPropagation(); handleCoupon(customer.customer_id); }}>
                        <Ticket className="w-4 h-4 mr-1" /> Coupon
                      </Button>
                    </div>
                  </div>

                  {/* Expand */}
                  {isSelected && (
                    <div className="mt-4 pl-16 space-y-2">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" /> {customer.customer_email}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" /> {customer.customer_number}
                      </div>
                      {customer.address_line_1 && (
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Home className="w-4 h-4 mr-2 text-gray-400" /> {customer.address_line_1}
                        </div>
                      )}
                      <div className="text-gray-600 dark:text-gray-400">Total Bookings: {totalBookings}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Revenue: ₹{totalRevenue.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
