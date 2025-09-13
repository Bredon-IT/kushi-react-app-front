// components/types/Invoice.ts
export interface InvoiceService {
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  booking_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_number: string;
  customer_address?: string;
  customer_state?: string;
  service_name: string;
  booking_amount: number;
  bookingDate: string;
  services?: InvoiceService[];
  worker_assign?: boolean;
}
