import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, CreditCard, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { RevenueChart } from "../components/charts/RevenueChart";
import OverviewService from "../services/OverviewService";
import axios from "axios";
import ServiceReportAPIService from "../services/ServiceReportAPIService";
 


  export function Financial() {
  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 0,
    monthlyIncome: 285400, // static placeholder
    expenses: 125000,
    profit: 160400,
    growthRate: 12.5,
  });
 
  const [revenueByService, setRevenueByService] = useState<
    { service: string; revenue: number; percentage: number }[]
  >([]);
 
   const [loading, setLoading] = useState(false);

  // keep this once only
const handleExportCSV = async () => {
  setLoading(true);
  try {
    await ServiceReportAPIService.downloadServiceReportCSV();
  } catch (error) {
    console.error("Error exporting CSV:", error);
  } finally {
    setLoading(false);
  }
};
 
  
 
  useEffect(() => {
    // ✅ Fetch same overview data as Dashboard
    OverviewService.getOverview("all-time")
      .then((res) => {
        const data = res.data;
        setFinancialStats((prev) => ({
          ...prev,
          totalRevenue: data.totalAmount || 0, // ✅ linked to dashboard totalAmount
        }));
      })
      .catch((err) => console.error("Error fetching financial stats:", err));
 
    // ✅ Fetch Revenue by Service
    axios.get("https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/admin/revenue-by-service")

      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
 
        // remove nulls
        const validData = data.filter(
          (s: any) => s.serviceName && s.totalRevenue !== null
        );
 
        const total = validData.reduce(
          (sum, s) => sum + (s.totalRevenue || 0),
          0
        );
 
        const formatted = validData.map((s: any) => ({
          service: s.serviceName,
          revenue: s.totalRevenue || 0,
          percentage:
            total > 0 ? ((s.totalRevenue || 0) / total) * 100 : 0,
        }));
 
        setRevenueByService(formatted);
      })
      .catch((err) =>
        console.error("Error fetching revenue by service:", err)
      );
  }, []);

 
  const expenseBreakdown = [
    { category: "Staff Salaries", amount: 48750, percentage: 39 },
    { category: "Equipment & Supplies", amount: 31250, percentage: 25 },
    { category: "Marketing", amount: 25000, percentage: 20 },
    { category: "Transportation", amount: 12500, percentage: 10 },
    { category: "Other", amount: 7500, percentage: 6 },
  ];
 
  // =======================
  // GENERATE SERVICE REPORT (from backend)
  // =======================
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const reportData = await ServiceReportAPIService.getServiceReport();
      // Example: download JSON as a file (or display in UI)
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "service_report.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Management
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportCSV} disabled={loading} variant="secondary">
            {loading ? "Exporting..." : "Export CSV"}
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>
 
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ✅ Total Revenue (linked with Dashboard totalAmount) */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{financialStats.totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
 
        {/* Monthly Income */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Income
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{financialStats.monthlyIncome.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
 
        {/* Profit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Net Profit
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{financialStats.profit.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
 
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Trends
          </h3>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>
 
      {/* Expense Breakdown & Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expense Breakdown
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
 
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue by Service
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByService.length === 0 ? (
                <p className="text-gray-500">No data available</p>
              ) : (
                revenueByService.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.service}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{service.revenue.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${service.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 
 