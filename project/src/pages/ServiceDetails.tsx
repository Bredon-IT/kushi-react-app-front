import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {Star, ShoppingCart, ArrowLeft, ArrowRight, CheckCircle, Heart, Zap, ClipboardList, PlusCircle, XCircle,} from "lucide-react";
// The Service interface is moved here to be accessible by both parts of the component.
interface Service {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: string;
    duration: string;
    image: string;
    description: string;
    features: string[];
    badge?: string;
    overview?: string;
    our_process?: string;
    benefits?: string;
    whats_included?: string;
    whats_not_included?: string;
    why_choose_us?: string;
}
const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [similarServices, setSimilarServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleBookNow = () => {navigate('/booking');
};
 
  const [activeTab, setActiveTab] = useState("overview");
    useEffect(() => {
        const loadService = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch single service by ID from backend
            const res = await fetch(`https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/customers/service/${id}`);
            if (!res.ok) throw new Error("Service not found");
            const data = await res.json();
            const serviceData: Service = {
                id: data.service_id?.toString() || "0",
                name: data.service_name,
                category: data.service_category,
                subcategory: data.service_type,
                price: data.service_cost,
                originalPrice: data.service_cost,
                rating: parseFloat(data.rating) || 4.8,
                reviews: data.rating_count || "0",
                duration: "4-6 hours",
                image: data.service_image_url || "/placeholder.jpg",
                description: data.service_description || "",
                features: data.features?.split(",") || ["Eco-Friendly Products", "Insured Service"],
                badge: "Premium",
                overview: data.overview,
                our_process: data.our_process,
                benefits: data.benefits,
                whats_included: data.whats_included,
                whats_not_included: data.whats_not_included,
                why_choose_us: data.why_choose_us,
            };
            setService(serviceData);
            // Optional: fetch all services to show similar services
            const allRes = await fetch("https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/customers/all-services");
            const allData = await allRes.json();
            const services: Service[] = allData.map((item: any, index: number) => ({
                id: item.service_id?.toString() || index.toString(),
                name: item.service_name,
                category: item.service_category,
                subcategory: item.service_type,
                price: item.service_cost,
                originalPrice: item.service_cost,
                rating: parseFloat(item.rating) || 4.8,
                reviews: item.rating_count || "0",
                duration: "4-6 hours",
                image: item.service_image_url || "/placeholder.jpg",
                features: item.features?.split(",") || ["Eco-Friendly Products", "Insured Service"],
            }));
            // Filter similar services
            let similar = services.filter(
                (s) => s.id !== serviceData.id && s.subcategory === serviceData.subcategory
            );
            if (similar.length < 3) {
                const categorySimilar = services.filter(
                    (s) => s.id !== serviceData.id && s.category === serviceData.category
                );
                similar = [...new Set([...similar, ...categorySimilar])];
            }
            setSimilarServices(similar.slice(0, 3));
        } catch (err) {
            console.error(err);
            setError("Unable to load service details.");
        } finally {
            setLoading(false);
        }
    };
    loadService();
}, [id]);
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const storedServices = localStorage.getItem("services");
        let services: Service[] = storedServices
            ? JSON.parse(storedServices)
            : [];
        if (!services.length) {
          const res = await fetch("https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/customers/all-services");
          if (!res.ok) throw new Error("Failed to fetch services");
          const data = await res.json();
          services = data.map((item: any, index: number) => ({
            id: item.service_id?.toString() || index.toString(),
            name: item.service_name || "Unnamed Service",
            category: item.service_category || "General",
            subcategory: item.service_type || "",
            price: item.service_cost || 0,
            originalPrice: item.originalPrice || item.price || 0,
            rating: parseFloat(item.rating) || 4.8,
            reviews: item.rating_count ? String(item.rating_count) : "0",
            duration: item.duration || "4-6 hours",
            image: item.service_image_url || "/placeholder.jpg",
            description: item.service_description || "",
            features: item.features
                ? item.features.split(",")
                : ["Eco-Friendly Products", "Insured Service"],
            badge: item.badge || "Premium",
            overview: item.overview || "",
            our_process: item.our_process || "",
            benefits: item.benefits || "",
            whats_included: item.whats_included || "",
            whats_not_included: item.whats_not_included || "",
            why_choose_us: item.why_choose_us || "",
          }));
          localStorage.setItem("services", JSON.stringify(services));
        }
        const selected = services.find((s) => s.id === id);
        if (!selected) {
          setService(null);
          setError("Service not found");
          return;
        }
        setService(selected);
        // **-- IMPROVED DYNAMIC FILTERING LOGIC --**
        // 1. First, try to find services with the same subcategory
        let similar = services.filter(
            (s) => s.id !== selected.id && s.subcategory === selected.subcategory
        );
        // 2. If fewer than 3 similar services are found, broaden the search to the same category
        if (similar.length < 3) {
          const categorySimilar = services.filter(
              (s) => s.id !== selected.id && s.category === selected.category
          );
          // Combine the results and ensure no duplicates
          const combinedSimilar = [...new Set([...similar, ...categorySimilar])];
          similar = combinedSimilar;
        }
        setSimilarServices(similar.slice(0, 3)); // Display only the top 3
        // **-- END OF IMPROVED LOGIC --**
      } catch (err) {
        console.error(err);
        setError("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);
  const handleAddToCart = (service: Service) => {
    const existingCart = JSON.parse(localStorage.getItem("kushiServicesCart") || "[]");
    const existingItem = existingCart.find((item: any) => item.id === service.id);
    if (existingItem) existingItem.quantity += 1;
    else existingCart.push({ ...service, quantity: 1 });
    localStorage.setItem("kushiServicesCart", JSON.stringify(existingCart));
 
    // Navigate to cart page after adding
    navigate("/cart");
};
 
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!service) return <div className="p-8 text-center">Service not found</div>;
 
 
  return (
      <div className="bg-gray-50 min-h-screen">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 py-6">
              <Link
                  to="/services"
                  className="flex items-center gap-2 text-navy-700 hover:text-peach-600 font-semibold"
              >
                  <ArrowLeft size={20} />
                  Back to Services
              </Link>
          </div>
          {/* Main Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl border-2 shadow-xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                      {/* Left: Image with thumbnails */}
                      <div>
                          <div className="relative">
                              {service.badge && (
                                  <span className="absolute top-4 left-4 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                                      {service.badge}
                                  </span>
                              )}
                              <img
                                  src={service.image}
                                  alt={service.name}
                                  className="w-full h-96 object-cover rounded-2xl"
                              />
                              <div className="absolute top-4 right-4 bg-white shadow px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
                                  ⭐ {service.rating} ({service.reviews})
                              </div>
                          </div>
                      </div>
                      {/* Right: Details */}
                      <div className="flex flex-col gap-6">
                          {/* Title & Description */}
                          <div>
                              <h1 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-3">
                                  {service.name}
                              </h1>
                              <p className="text-gray-600">
                                  {service.description ||
                                      "Transform your home with our professional cleaning service. Eco-friendly products, skilled staff, and guaranteed results."}
                              </p>
                          </div>
                          {/* Highlights */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                  ⏱ {service.duration}
                              </div>
                              <div className="flex items-center gap-2">
                                  👨‍👩‍👦 3-4 professionals
                              </div>
                              <div className="flex items-center gap-2">
                                  🛡 Insured Service
                              </div>
                              <div className="flex items-center gap-2">
                                  ✅ Quality Guaranteed
                              </div>
                          </div>
                          {/* Price Box */}
                          <div className="border-2 rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center gap-3 mb-4">
                                  <span className="text-2xl font-bold text-orange-600">
                                      ₹{service.price.toLocaleString("en-IN")}
                                  </span>
                                  {service.originalPrice > service.price && (
                                      <>
                                          <span className="line-through text-gray-400">
                                              ₹{service.originalPrice.toLocaleString("en-IN")}
                                          </span>
                                          <span className="text-green-600 font-semibold">
                                              {Math.round(
                                                  ((service.originalPrice - service.price) /
                                                      service.originalPrice) *
                                                  100
                                              )}
                                              % OFF
                                          </span>
                                      </>
                                  )}
                              </div>
                              {/* Buttons */}
                              <div className="flex flex-col gap-3">
                                  {/* Add to Cart (Top full width) */}
                                  <button
                                      onClick={() => handleAddToCart(service)}
                                      className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-700"
                                  >
                                      <ShoppingCart size={18} /> Add to Cart
                                  </button>
                                  {/* Book Now and Get Quote (Below side by side) */}
                                  <div className="flex gap-3">
                                     {/* The "Book Now" button */}
                                   
                                     <button
                                        onClick={handleBookNow}
                                        className="flex-1 bg-gradient-to-r from-peach-200 to-navy-800 text-white py-3 px-6 rounded-lg font-semibold hover:from-peach-200 hover:to-navy-800 transition-all"
                                     >
                                          Book Now
                                     </button>
 
                                      <button className="flex-1 border border-orange-600 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50">
                                          Get Quote
                                      </button>
                                  </div>
                              </div>
                          </div>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                              {service.features.map((f, idx) => (
                                  <span
                                      key={idx}
                                      className="bg-gray-100 text-gray-700 text-xs px-4 py-1 rounded-full border"
                                  >
                                      {f}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          {/* Service Details with Tabs Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <div className="bg-white rounded-3xl border-2 shadow-xl">
                  {/* Tabs Navigation */}
                  <div className="flex border-b rounded-t-3xl bg-white">
                      <button
                          onClick={() => setActiveTab("overview")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                              activeTab === "overview"
                                  ? "border-orange-500 text-orange-500"
                                  : "border-transparent text-gray-600"
                          }`}
                      >
                          <Zap size={16} /> Overview
                      </button>
                      <button
                          onClick={() => setActiveTab("process")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                              activeTab === "process"
                                  ? "border-orange-500 text-orange-500"
                                  : "border-transparent text-gray-600"
                          }`}
                      >
                          <ClipboardList size={16} /> Our Process
                      </button>
                      <button
                          onClick={() => setActiveTab("included")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                              activeTab === "included"
                                  ? "border-orange-500 text-orange-500"
                                  : "border-transparent text-gray-600"
                          }`}
                      >
                          <PlusCircle size={16} /> What's Included
                      </button>
                      <button
                          onClick={() => setActiveTab("benefits")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                              activeTab === "benefits"
                                  ? "border-orange-500 text-orange-500"
                                  : "border-transparent text-gray-600"
                          }`}
                      >
                          <Heart size={16} /> Benefits
                      </button>
                  </div>
                  {/* Tab Content */}
                  <div className="p-8">
                      {/* Overview Tab */}
                      {activeTab === "overview" && (
                          <>
                              <h2 className="text-xl font-bold mb-3">Service Overview</h2>
                              <p className="text-gray-700 mb-6 whitespace-pre-line">
                                  {service.overview || "No overview available"}
                              </p>
                              <div className="grid md:grid-cols-2 gap-8 mt-8">
                                  <div>
                                      <h3 className="text-xl font-bold mb-4">Why Choose Our Service?</h3>
                                      {service.why_choose_us && service.why_choose_us.split('\n').map((point, index) => (
                                          <div key={index} className="flex items-start gap-2 mb-2">
                                              <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                              <p className="text-gray-700">{point}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </>
                      )}
                      {/* Our Process Tab */}
                      {activeTab === "process" && (
                          <>
                              <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">
                                  Our Step-by-Step Process
                              </h2>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {service.our_process && service.our_process.split('\n\n').map((step, index) => {
                                      const [title, ...description] = step.split('\n');
                                      return (
                                          <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                                              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                                                  {index + 1}
                                              </div>
                                              <h3 className="font-bold text-lg mb-2">{title}</h3>
                                              <p className="text-gray-600 text-sm">{description.join('\n')}</p>
                                          </div>
                                      );
                                  })}
                              </div>
                          </>
                      )}
                      {/* Included / Not Included Tab */}
                      {activeTab === "included" && (
                          <div className="grid md:grid-cols-2 gap-8">
                              <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                      <CheckCircle size={24} className="text-green-500" /> What's Included
                                  </h3>
                                  <ul className="space-y-2">
                                      {service.whats_included && service.whats_included.split('\n').map((item, index) => (
                                          <li key={index} className="flex items-start gap-2 text-gray-700">
                                              <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                              <span>{item}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                      <XCircle size={24} className="text-red-500" /> What's Not Included
                                  </h3>
                                  <ul className="space-y-2">
                                      {service.whats_not_included && service.whats_not_included.split('\n').map((item, index) => (
                                          <li key={index} className="flex items-start gap-2 text-gray-700">
                                              <XCircle size={18} className="text-red-500 mt-1 flex-shrink-0" />
                                              <span>{item}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      )}
                      {/* Benefits Tab */}
                      {activeTab === "benefits" && (
                          <>
                              <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">
                                  Benefits of Our Service
                              </h2>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {service.benefits && service.benefits.split('\n').map((benefit, index) => (
                                      <div key={index} className="bg-white border-2 border-orange-100 rounded-lg p-6 text-center">
                                          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                                              <Heart size={24} className="text-orange-600" />
                                          </div>
                                          <p className="text-gray-600">{benefit}</p>
                                      </div>
                                  ))}
                              </div>
                          </>
                      )}
                  </div>
              </div>
          </div>
          {/* Similar Services */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-20">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
                  Similar Services
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarServices.map((s) => (
                      <Link
                          key={s.id}
                          to={`/services/${s.id}`}
                          className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
                      >
                          <div className="relative">
                              {s.badge && (
                                  <span className="absolute top-4 left-4 bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                      {s.badge}
                                  </span>
                              )}
                              <img
                                  src={s.image}
                                  alt={s.name}
                                  className="w-full h-48 object-cover"
                              />
                          </div>
                          <div className="p-4 flex-grow flex flex-col justify-between">
                              <div>
                                  <h3 className="text-xl font-bold text-gray-800 mb-1">{s.name}</h3>
                                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                      <span className="font-semibold text-gray-700">{s.rating}</span>
                                      <span className="text-gray-500">({s.reviews})</span>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                  <p className="text-orange-600 font-bold text-xl">
                                      ₹{s.price.toLocaleString("en-IN")}
                                  </p>
                                  <span className="flex items-center gap-1 text-orange-600 font-semibold text-sm">
                                      View Details
                                      <ArrowRight size={16} />
                                  </span>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </div>
  );
};
export default ServiceDetails;
 