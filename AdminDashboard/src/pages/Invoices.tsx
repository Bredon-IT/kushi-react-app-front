import { useState, useEffect } from "react";
import { FileText, Download, Mail, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Invoice } from "../components/types/Invoice";
import { getAllInvoices } from "../services/InvoiceAPIService";
import { FaWhatsapp } from "react-icons/fa";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  PageNumber,
  Footer,
  Header
} from "docx";

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [customDate, setCustomDate] = useState<string>("");
  const [customMonth, setCustomMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await getAllInvoices();
      setInvoices(
        data.sort(
          (a, b) =>
            new Date(b.bookingDate ?? "").getTime() -
            new Date(a.bookingDate ?? "").getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoiceStatus = (inv: Invoice) =>
    inv.worker_assign ? "paid" : "unpaid";

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.booking_id?.toString().includes(searchTerm);

    const bookingDate = new Date(inv.bookingDate);
    const now = new Date();
    let matchesFilter = true;

    if (filter === "today") {
      matchesFilter = bookingDate.toDateString() === now.toDateString();
    } else if (filter === "week") {
      const weekStart = new Date();
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      matchesFilter = bookingDate >= weekStart && bookingDate <= weekEnd;
    } else if (filter === "month") {
      matchesFilter =
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear();
    } else if (filter === "custom-date" && customDate) {
      matchesFilter =
        bookingDate.toDateString() === new Date(customDate).toDateString();
    } else if (filter === "custom-month" && customMonth) {
      const [year, month] = customMonth.split("-").map(Number);
      matchesFilter =
        bookingDate.getMonth() + 1 === month &&
        bookingDate.getFullYear() === year;
    }

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = filteredInvoices
    .filter((inv) => getInvoiceStatus(inv) === "paid")
    .reduce((sum, inv) => sum + (inv.booking_amount ?? 0), 0);

  const pendingAmount = filteredInvoices
    .filter((inv) => getInvoiceStatus(inv) === "unpaid")
    .reduce((sum, inv) => sum + (inv.booking_amount ?? 0), 0);

 // ======================
// Generate Invoice PDF
// ======================
const generateInvoicePDF = async (invoice: Invoice) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  // Header
  page.drawText("KUSHI SERVICES - 2025-26", {
    x: 200,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;
  page.drawText(
    "#115, GVR Complex, Opp to Axis Bank ATM, Anandapura TC Palya Main Road, Bangalore - 560049",
    { x: 50, y, size: 10, font }
  );
  y -= 15;
  page.drawText("GSTIN/UIN: 29ENYPM8506C1ZD | State: Karnataka, Code: 29", {
    x: 50,
    y,
    size: 10,
    font,
  });
  y -= 15;
  page.drawText("Email: info@kushiservices.in", { x: 50, y, size: 10, font });
  y -= 30;

  // Title
  page.drawText("TAX INVOICE", {
    x: 250,
    y,
    size: 14,
    font,
    color: rgb(0, 0, 0.6),
  });
  y -= 40;

  // Invoice Info
  page.drawText(`Invoice No: ${invoice.booking_id}`, { x: 50, y, size: 12, font });
  page.drawText(
    `Date: ${new Date(invoice.bookingDate).toLocaleDateString()}`,
    { x: 350, y, size: 12, font }
  );
  y -= 20;
  page.drawText(`Customer Name: ${invoice.customer_name || "-"}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 20;
  page.drawText(`Email: ${invoice.customer_email || "-"}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 20;
  page.drawText(`Phone: ${invoice.customer_number || "-"}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 30;

  // Service Details Table
  const baseAmount = invoice.booking_amount || 0;
  const tax = baseAmount * 0.18;
  const total = baseAmount + tax;

  page.drawText("Sl No.", { x: 50, y, size: 12, font });
  page.drawText("Service", { x: 100, y, size: 12, font });
  page.drawText("Qty", { x: 300, y, size: 12, font });
  page.drawText("Rate", { x: 350, y, size: 12, font });
  page.drawText("Amount", { x: 450, y, size: 12, font });
  y -= 20;

  page.drawText("1", { x: 50, y, size: 12, font });
  page.drawText(invoice.service_name || "-", { x: 100, y, size: 12, font });
  page.drawText("1", { x: 300, y, size: 12, font });
  page.drawText(`${baseAmount}`, { x: 350, y, size: 12, font });
  page.drawText(`${baseAmount}`, { x: 450, y, size: 12, font });
  y -= 20;

  page.drawText(`IGST (18%)`, { x: 350, y, size: 12, font });
  page.drawText(`${tax.toFixed(2)}`, { x: 450, y, size: 12, font });
  y -= 20;

  page.drawText(`Total`, { x: 350, y, size: 12, font });
  page.drawText(`${total.toFixed(2)}`, { x: 450, y, size: 12, font });
  y -= 40;

  // Footer
  page.drawText("Declaration: This invoice shows the actual price and particulars are true.", {
    x: 50,
    y,
    size: 10,
    font,
  });
  y -= 20;
  page.drawText("For KUSHI SERVICES - 2025-26", { x: 400, y, size: 12, font });
  y -= 15;
  page.drawText("Authorised Signatory", { x: 420, y, size: 10, font });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `invoice_${invoice.booking_id}.pdf`);
};

  const downloadSelectedInvoices = () => {
    selectedInvoices.forEach((id) => {
      const invoice = invoices.find((inv) => inv.booking_id === id);
      if (invoice) generateInvoice(invoice);
    });
  };

  const toggleInvoiceSelection = (id: number) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedInvoices((prev) =>
      prev.length === invoices.length ? [] : invoices.map((i) => i.booking_id)
    );
  };

  const sendEmail = (invoice: Invoice) => {
    const subject = `Invoice for Booking ID ${invoice.booking_id}`;
    const body = `Hello ${invoice.customer_name},\nBooking ID: ${invoice.booking_id}\nService: ${invoice.service_name}\nAmount: ₹${invoice.booking_amount}\nStatus: ${getInvoiceStatus(invoice)}`;
    window.open(
      `mailto:${invoice.customer_email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  const sendWhatsApp = (invoice: Invoice) => {
    const phoneNumber = invoice.customer_number?.replace(/\D/g, "");
    if (!phoneNumber) {
      alert("No phone number available.");
      return;
    }
    const message = `Hello ${invoice.customer_name},\nBooking ID: ${invoice.booking_id}\nService: ${invoice.service_name}\nAmount: ₹${invoice.booking_amount}\nStatus: ${getInvoiceStatus(
      invoice
    )}`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const downloadCSV = () => {
    const csvData = filteredInvoices.map((inv) => ({
      InvoiceID: inv.booking_id,
      CustomerID: inv.customer_id,
      Name: inv.customer_name,
      Email: inv.customer_email,
      Phone: inv.customer_number,
      Service: inv.service_name,
      Amount: inv.booking_amount,
      Status: getInvoiceStatus(inv),
      BookingDate: new Date(inv.bookingDate).toLocaleDateString(),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoices_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoices Management
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={downloadSelectedInvoices}>Download Selected</Button>
          <Button onClick={fetchInvoices}>Refresh</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pending Amount
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {filteredInvoices.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Invoices
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom-date">Custom Date</option>
            <option value="custom-month">Custom Month</option>
          </select>

          {filter === "custom-date" && (
            <input
              type="date"
              className="border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          )}
          {filter === "custom-month" && (
            <input
              type="month"
              className="border rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={customMonth}
              onChange={(e) => setCustomMonth(e.target.value)}
            />
          )}

          <Button onClick={downloadCSV}>Download CSV</Button>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invoice List ({filteredInvoices.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6">Loading invoices...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          selectedInvoices.length === filteredInvoices.length &&
                          filteredInvoices.length > 0
                        }
                        onChange={selectAll}
                      />
                    </th>
                    <th className="py-2 px-3 text-sm">Invoice #</th>
                    <th className="py-2 px-3 text-sm">Customer ID</th>
                    <th className="py-2 px-3 text-sm">Name</th>
                    <th className="py-2 px-3 text-sm">Email</th>
                    <th className="py-2 px-3 text-sm">Phone</th>
                    <th className="py-2 px-3 text-sm">Booking Details</th>
                    <th className="py-2 px-3 text-sm">Status</th>
                    <th className="py-2 px-3 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.booking_id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(inv.booking_id)}
                          onChange={() => toggleInvoiceSelection(inv.booking_id)}
                        />
                      </td>
                      <td className="py-2 px-3">{inv.booking_id}</td>
                      <td className="py-2 px-3">{inv.customer_id}</td>
                      <td className="py-2 px-3">{inv.customer_name}</td>
                      <td className="py-2 px-3">{inv.customer_email}</td>
                      <td className="py-2 px-3">{inv.customer_number}</td>
                      <td className="py-2 px-3">{inv.service_name}</td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            getInvoiceStatus(inv) === "paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {getInvoiceStatus(inv)}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => generateInvoicePDF(inv)}

                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => sendEmail(inv)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => sendWhatsApp(inv)}
                        >
                          <FaWhatsapp className="h-4 w-4 text-green-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
