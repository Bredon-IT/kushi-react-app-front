import axios from "axios";

const API_BASE = "https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/bookings";

export const BookingAPIService = {
  createBooking: async (bookingData: any) => {
    try {
      const response = await axios.post(`${API_BASE}/newbookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  getAllBookings: async () => {
    const response = await axios.get(`${API_BASE}/allbookings`);
    return response.data;
  },

  updateBookingStatus: async (id: number, status: string) => {
    const response = await axios.put(`${API_BASE}/${id}/status`, { status });
    return response.data;
  },

  deleteBooking: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  },
};
