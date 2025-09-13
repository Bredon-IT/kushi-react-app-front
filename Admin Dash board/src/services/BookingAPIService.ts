import axios from "axios";

const API_URL = "https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/bookings";

const BookingsAPIService = {
  // ✅ Fetch all bookings
  getAllBookings: () => {
    return axios.get(`${API_URL}/allbookings`);
  },

  // ✅ Create booking
  createBooking: (bookingData: any) => {
    return axios.post(`${API_URL}/newbookings`, bookingData);
  },

  // ✅ Update booking status
  updateBookingStatus: (bookingId: number, status: string) => {
    return axios.put(`${API_URL}/${bookingId}/status`, { status });
  },

  // ✅ Send booking notification
  sendBookingNotification: (
    email: string,
    phoneNumber: string,
    status: string
  ) => {
    return axios.post(`${API_URL}/notify`, { email, phoneNumber, status });
  },

  // ✅ Delete booking
  deleteBooking: (bookingId: number) => {
    return axios.delete(`${API_URL}/${bookingId}`);
  },
};

export default BookingsAPIService;
