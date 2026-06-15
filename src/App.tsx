import React, { useState, useEffect, useRef } from "react";
import { 
  Scissors, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Check, 
  Instagram, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  ThumbsUp, 
  ExternalLink,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: "cut" | "beard" | "combo" | "kid";
}

interface Barber {
  id: string;
  name: string;
  nickname: string;
  experience: number;
  specialty: string;
  bio: string;
  avatar: string;
  status: "available" | "fully-booked";
  tags: string[];
}

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
  barberName: string;
  serviceName: string;
  price: number;
}

// Initial Data
const SERVICES: Service[] = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    price: 30,
    duration: "30 min",
    category: "cut",
    description: "Standard scissor and clipper work tailored to your head shape. Includes hot lather neck shave and premium hair finish.",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    price: 40,
    duration: "45 min",
    category: "cut",
    description: "Ultra-precise seamless fade down to skin (high, mid, or low). Perfect detail work finished with razor edge and styling powder.",
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    price: 20,
    duration: "30 min",
    category: "beard",
    description: "Sculpting, shaping, and lining your beard with detail trimmers, detailed with a clean straight-razor cheek line and conditioning oil.",
  },
  {
    id: "combo",
    name: "Haircut & Beard Combo",
    price: 50,
    duration: "60 min",
    category: "combo",
    description: "Our signature service. Premium haircut choice combined with expert beard detailing, razor lining, and complete standard conditioning.",
  },
  {
    id: "kids-cut",
    name: "Kids Cut",
    price: 25,
    duration: "25 min",
    category: "kid",
    description: "Sharp and fresh cuts for the young trendsetters (Ages 12 & under). Fast, patient, and modern styling.",
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    price: 35,
    duration: "45 min",
    category: "beard",
    description: "The ultimate traditional relaxation. Infused hot towels, pre-shave cream, warm lather, double straight-razor glide, and ice-cold compress.",
  }
];

const BARBERS: Barber[] = [
  {
    id: "marcus",
    name: "Marcus Thompson",
    nickname: "Fade God",
    experience: 8,
    specialty: "Sharp Skin Fades & Geometric Lineups",
    bio: "Raised in Atlanta's thriving street barber culture. Marcus treats every skin fade as canvas work, engineering seamless transitions that define modern streetwear styling.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&auto=format&fit=crop", // Elegant avatar look
    status: "available",
    tags: ["Fades", "Lineups", "Fast Shaves"]
  },
  {
    id: "jay",
    name: "Jay Reynolds",
    nickname: "The Architect",
    experience: 10,
    specialty: "Precision Beard Design & Classic Scissor Work",
    bio: "An artist of custom symmetry. Jay meticulously analyzes structural facial bones to construct custom beard frames and classic gentleman silhouettes for young professionals.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
    status: "available",
    tags: ["Symmetry", "Beard Sculpting", "Classic Cuts"]
  },
  {
    id: "rico",
    name: "Rico Martinez",
    nickname: "Clean Hands",
    experience: 6,
    specialty: "Modern Burst Fades & Clean Razor Work",
    bio: "Rico imports authentic West Coast movement and trends. Renowned for custom burst designs, ultra-precise outlines, and a legendary high-contrast razor lining finish.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop",
    status: "available",
    tags: ["Burst Fades", "Designs", "Razor Finishing"]
  }
];

const GALLERY_PHOTOS = [
  {
    id: "g1",
    tag: "Taper Fades",
    title: "Mid Taper Fade",
    url: "/src/assets/images/fade_haircut_1781482048311.jpg" // our premium generated image
  },
  {
    id: "g2",
    tag: "Beard Transformations",
    title: "Sharp Razor Lining & Hydration",
    url: "/src/assets/images/beard_grooming_1781482060891.jpg" // our beard generated image
  },
  {
    id: "g3",
    tag: "Burst Fades",
    title: "Burst Fade with Slick Textured Top",
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&h=600&auto=format&fit=crop"
  },
  {
    id: "g4",
    tag: "Shop Atmosphere",
    title: "Station Spotlighting & Leather Comfort",
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&h=600&auto=format&fit=crop"
  },
  {
    id: "g5",
    tag: "Taper Fades",
    title: "Low Drop Taper with Beard Connection",
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&h=600&auto=format&fit=crop"
  },
  {
    id: "g6",
    tag: "Before-and-after cuts",
    title: "Transformation: Overdue Clean Silhouette",
    url: "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=600&h=600&auto=format&fit=crop"
  }
];

const REVIEWS = [
  {
    id: "r1",
    rating: 5,
    text: "Best fade I've ever had. Marcus has a crazy attention to detail and takes his time making sure everything is symmetric. Vibe of the shop is top-tier.",
    user: "Devin R.",
    haircut: "Mid Skin Fade"
  },
  {
    id: "r2",
    rating: 5,
    text: "The whole shop has an amazing atmosphere and the cuts never miss. Been going to Jay for a year now and he transformed my beard line. Highly recommend.",
    user: "Malik T.",
    haircut: "Haircut & Beard Combo"
  },
  {
    id: "r3",
    rating: 5,
    text: "Professional, fast, and always gets me right. Rico is a true master with raw trimmers and razor linings. Easy online booking is the cherry on top.",
    user: "Jordan S.",
    haircut: "Burst Taper"
  },
  {
    id: "r4",
    rating: 5,
    text: "I finally found my go-to barber. The layout is premium, sterile, and super clean. Music playlist is always on point. Legacy Blend is unmatched.",
    user: "Chris W.",
    haircut: "Classic Scissor Haircut"
  },
  {
    id: "r5",
    rating: 5,
    text: "Worth every single dollar. If you care about your look and want clean confidence, don't look anywhere else. This team is legendary.",
    user: "Andre M.",
    haircut: "Skin Fade + Hot Shave"
  }
];

const FAQS = [
  {
    question: "Do you accept walk-ins or are appointments mandatory?",
    answer: "We strongly recommend booking in advance to secure your preferred barber and exact time. However, we do accept walk-ins based on hourly availability, with priority always given to clients holding pre-existing reservations."
  },
  {
    question: "What is your barber shop's cancellation policy?",
    answer: "We value both our clients' schedules and our barbers' craft. You can reschedule or cancel your appointment free of charge up to 4 hours in advance. Cancellations within 4 hours or no-shows may incur a fee of up to 50% of the service cost on your next visit."
  },
  {
    question: "What payment methods do you accept at the shop?",
    answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and Cash. Tipping your barber in cash or card is always highly appreciated."
  },
  {
    question: "How long does a standard Classic Haircut take?",
    answer: "Our standard Classic Hairct ranges from 30 to 45 minutes, encompassing a complete personalized consultation, premium clipper/scissor blending, lather neck shave, and customized styling."
  },
  {
    question: "Can I request a specific barber when scheduling?",
    answer: "Absolutely! You can choose any of our world-class specialists (Marcus, Jay, or Rico) when reserving. Each barber has unique design specialties highlighted under their team biography section."
  }
];

const INSTAGRAM_MOCKS = [
  { id: "insta1", url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=350&h=350&auto=format&fit=crop", likes: "1,248" },
  { id: "insta2", url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=350&h=350&auto=format&fit=crop", likes: "982" },
  { id: "insta3", url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=350&h=350&auto=format&fit=crop", likes: "1,411" },
  { id: "insta4", url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=350&h=350&auto=format&fit=crop", likes: "1,879" }
];

export default function App() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  
  // Local bookings persistence state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("legacy_bookings");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Custom booking form state
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    barberId: "",
    serviceId: "",
    date: "",
    time: "",
    notes: ""
  });
  
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyBookings, setShowMyBookings] = useState(false);

  const bookingFormRef = useRef<HTMLDivElement | null>(null);

  // Save bookings to localStorage
  useEffect(() => {
    localStorage.setItem("legacy_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Fast scroll & pre-fill function when client books a specific barber or service
  const triggerBookingSetup = (barberId?: string, serviceId?: string) => {
    setFormData(prev => ({
      ...prev,
      ...(barberId ? { barberId } : {}),
      ...(serviceId ? { serviceId } : {})
    }));
    
    // Smooth scroll to form element
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    
    // Simple Validation
    if (!formData.clientName.trim()) return setBookingError("Please enter your name");
    if (!formData.clientPhone.trim()) return setBookingError("Please provide an active phone number");
    if (!formData.clientEmail.trim()) return setBookingError("Please enter a valid email address");
    if (!formData.serviceId) return setBookingError("Please select a service for your session");
    if (!formData.barberId) return setBookingError("Please select a legacy barber");
    if (!formData.date) return setBookingError("Please pick a desired appointment date");
    if (!formData.time) return setBookingError("Please select an available timeframe");

    setIsSubmitting(true);

    // Simulate luxury API response / booking generation
    setTimeout(() => {
      const chosenBarber = BARBERS.find(b => b.id === formData.barberId);
      const chosenService = SERVICES.find(s => s.id === formData.serviceId);

      const newBooking: Booking = {
        id: `LGB-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        barberId: formData.barberId,
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        createdAt: new Date().toLocaleDateString(),
        barberName: chosenBarber ? chosenBarber.name : "Any Barber",
        serviceName: chosenService ? chosenService.name : "Haircut Service",
        price: chosenService ? chosenService.price : 35
      };

      setBookings(prev => [newBooking, ...prev]);
      setSuccessBooking(newBooking);
      setIsSubmitting(false);

      // Clean non-personal fields but keep client details to make booking next sessions easier
      setFormData(prev => ({
        ...prev,
        barberId: "",
        serviceId: "",
        date: "",
        time: "",
        notes: ""
      }));
    }, 1100);
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings(prev => prev.filter(b => b.id !== id));
      if (successBooking?.id === id) {
        setSuccessBooking(null);
      }
    }
  };

  // Filter Services
  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = serviceFilter === "all" || service.category === serviceFilter;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Gallery Photos
  const uniqueGalleryTags = ["all", "Taper Fades", "Burst Fades", "Beard Transformations", "Shop Atmosphere", "Before-and-after cuts"];
  const filteredGallery = galleryFilter === "all" 
    ? GALLERY_PHOTOS 
    : GALLERY_PHOTOS.filter(photo => photo.tag.toLowerCase() === galleryFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 py-3 px-4 md:px-8 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-neutral-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="p-1.5 md:p-2 bg-neutral-900 border border-emerald-500/30 rounded-lg group-hover:border-emerald-400 group-hover:bg-neutral-850 transition">
              <Scissors className="w-5 h-5 text-emerald-500 group-hover:rotate-45 transition duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black tracking-tight text-lg md:text-xl uppercase leading-none text-white">
                Legacy <span className="text-emerald-500 text-glow">Blend</span>
              </span>
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">Atlanta Co.</span>
            </div>
          </a>

          {/* Large Screen Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">Services</a>
            <a href="#barbers" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">Barbers</a>
            <a href="#gallery" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">Gallery</a>
            <a href="#reviews" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">Reviews</a>
            <a href="#faqs" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">FAQs</a>
            <a href="#contact" className="font-medium text-sm text-neutral-400 hover:text-white transition duration-200">Contact</a>
          </nav>

          {/* Quick Action Block */}
          <div className="hidden md:flex items-center gap-4">
            {bookings.length > 0 && (
              <button 
                onClick={() => setShowMyBookings(true)}
                className="relative text-xs font-mono font-bold tracking-wider text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg bg-emerald-500/5 transition duration-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                My Bookings ({bookings.length})
              </button>
            )}
            <a 
              href="#booking"
              className="px-5 py-2.5 bg-neutral-100 hover:bg-emerald-500 text-black hover:text-black font-display font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 transform active:scale-95 shadow-lg shadow-neutral-900/40 hover:shadow-emerald-500/20"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Hamburgen Button */}
          <div className="flex md:hidden items-center gap-2">
            {bookings.length > 0 && (
              <button 
                onClick={() => setShowMyBookings(true)}
                className="relative text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20 px-2 py-1.5 rounded-md bg-emerald-500/5"
              >
                Manage ({bookings.length})
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              key="mobile-toggle"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[61px] z-40 bg-[#0a0a0b] border-b border-neutral-900 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2 border-b border-neutral-900/50"
            >
              Services
            </a>
            <a 
              href="#barbers" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2 border-b border-neutral-900/50"
            >
              Meet The Barbers
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2 border-b border-neutral-900/50"
            >
              Gallery Cuts
            </a>
            <a 
              href="#reviews" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2 border-b border-neutral-900/50"
            >
              Client Reviews
            </a>
            <a 
              href="#faqs" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2 border-b border-neutral-900/50"
            >
              FAQs
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-emerald-400 font-display font-bold uppercase tracking-wider text-base py-2"
            >
              Contact info
            </a>
            <div className="pt-4 flex flex-col gap-3">
              <a 
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-emerald-500 text-black font-display font-bold uppercase tracking-wide text-xs rounded-lg transition"
              >
                Book Appointment
              </a>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowMyBookings(true);
                }}
                className="w-full text-center py-3 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono tracking-wider rounded-lg"
              >
                View Saved Tickets ({bookings.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-24 px-4 md:px-8 overflow-hidden bg-[#0a0a0a]">
        
        {/* Background Image with Dark Linear Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/barbershop_hero_1781482034214.jpg" 
            alt="Legacy Blend Shop Atmos" 
            className="w-full h-full object-cover object-center opacity-30 scale-100 filter brightness-75 duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/65"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/50"></div>
        </div>

        {/* Ambient Radial Spotlight Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-[#059669]/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Hero Content Block */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Crew Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-white/10 bg-[#121212]/90 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span className="font-mono text-[10px] md:text-xs font-black uppercase tracking-widest text-[#e5e7eb]">
              Luxury Grooming • Streetwear Vibe
            </span>
          </motion.div>

          {/* Slogan Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-7xl md:text-[88px] leading-[0.85] font-black uppercase italic tracking-tighter mb-8 text-white"
          >
            Sharp Cuts.<br />
            Clean <span className="text-[#059669] outline-text">Confidence.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base max-w-lg font-medium leading-relaxed mb-10 px-4"
          >
            Atlanta's premier grooming destination for the modern professional. We blend luxury streetwear aesthetics with classic barbershop precision.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4"
          >
            <a 
              href="#booking"
              className="w-full sm:w-auto bg-[#059669] text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#047857] transition-all text-sm text-center"
            >
              Book Your Appointment
            </a>
            <a 
              href="#services"
              className="w-full sm:w-auto border border-white/10 hover:border-white/30 hover:bg-white/5 text-white px-8 py-4 font-bold uppercase tracking-widest transition-all text-sm text-center"
            >
              Explore Services & Rates
            </a>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 pt-8 border-t border-white/10 w-full grid grid-cols-3 gap-4"
          >
            <div>
              <p className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white">10K+</p>
              <p className="font-mono text-[9px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">Fresh Fades Finished</p>
            </div>
            <div className="border-x border-white/10">
              <p className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-[#059669]">24Yrs</p>
              <p className="font-mono text-[9px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">Combined Skill</p>
            </div>
            <div>
              <p className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white">4.9★</p>
              <p className="font-mono text-[9px] md:text-xs text-neutral-500 uppercase tracking-wider mt-1">500+ Perfect Reviews</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Intro / Philosophy Section */}
      <section className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Philosophy Text (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold text-[#059669] uppercase tracking-widest mb-3">Legacy Standard</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
                Why Legacy Blend Stands Alone in Atlanta
              </h2>
              <p className="text-neutral-400 text-base md:text-lg mb-6 leading-relaxed">
                Legacy Blend is not just about haircuts — it represents a philosophy of confident execution. Rooted deeply in Atlanta's urban culture and upscale style, we designed this space as a luxury retreat for standard grooming.
              </p>
              <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
                Every barber on our team has been scouted for their masterful hand coordination, cleanliness, and alignment with modern streetwear trends. We treat every client's hairline as custom architectural formulation.
              </p>

              {/* Operating Hours Embed */}
              <div className="p-6 border border-white/10 bg-[#121212] space-y-3 rounded-lg">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#059669] flex items-center gap-2 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Barbering Studio Hours
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#e5e7eb]">
                  <div>
                    <p className="text-[10px] text-neutral-500 font-mono font-bold">MONDAY - SATURDAY</p>
                    <p className="font-bold text-white text-sm">9:00 AM - 8:00 PM</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 font-mono font-bold">SUNDAY</p>
                    <p className="font-bold text-white text-sm">11:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Visual cards (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                
                {/* Highlight Card 1 */}
                <div className="p-8 bg-[#121212] border border-white/10 rounded-lg flex flex-col hover:border-[#059669]/50 transition duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6 border border-[#059669]/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg uppercase mb-3 text-white tracking-tight">Master Artistry</h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Our team isn't just skilled; they are certified artists holding collective master grooming status. We keep our blades razor-sharp and custom-calibrate clippers daily.
                  </p>
                </div>

                {/* Highlight Card 2 */}
                <div className="p-8 bg-[#121212] border border-white/10 rounded-lg flex flex-col hover:border-[#059669]/50 transition duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6 border border-[#059669]/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg uppercase mb-3 text-white tracking-tight">Clinical Hygiene</h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    We sanitize every comb, shear edge, and blade block using certified grade disinfectants in front of your eyes. Complete premium cleanliness for your comfort.
                  </p>
                </div>

              </div>

              <div className="space-y-6 sm:mt-12">
                
                {/* Highlight Card 3 */}
                <div className="p-8 bg-[#121212] border border-white/10 rounded-lg flex flex-col hover:border-[#059669]/50 transition duration-300">
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6 border border-[#059669]/20">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg uppercase mb-3 text-white tracking-tight">Prestige Experience</h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    From chilled vintage drinks and boutique hip-hop playlists to heated oil scalp treatments and premium organic pomades—we configure every node of comfort.
                  </p>
                </div>

                {/* Image panel */}
                <div className="relative overflow-hidden rounded-lg h-56 border border-white/10 bg-[#121212]">
                  <img 
                    src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop" 
                    alt="Legacy transformation detailing" 
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-950/45"></div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Services Section */}
      <section id="services" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a] relative">
        
        {/* Background glow shadow */}
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#059669]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-black text-[#059669] uppercase tracking-widest mb-3 inline-block">The Menu</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
              Premium Services & Pricing
            </h2>
            <p className="text-[#e5e7eb]/80 text-sm max-w-md mx-auto leading-relaxed">
              We focus on premium, detailed outcomes. Choose standard classic cut options or indulge in modern high-end grooming combinations.
            </p>
          </div>

          {/* Interactive Filtering and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
              {[
                { label: "All Grooming", val: "all" },
                { label: "Precision Cuts", val: "cut" },
                { label: "Beard & Shaves", val: "beard" },
                { label: "Combos", val: "combo" },
                { label: "Kids", val: "kid" }
              ].map(tab => (
                <button
                  key={tab.val}
                  onClick={() => setServiceFilter(tab.val)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-black transition duration-200 whitespace-nowrap border ${
                    serviceFilter === tab.val
                      ? "bg-[#059669] text-white border-[#059669]"
                      : "bg-[#121212] text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Search */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. fade, shave)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition duration-200 font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Service grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  key={service.id}
                  className="p-6 bg-[#121212] border border-white/10 rounded-lg flex flex-col justify-between hover:border-[#059669]/40 hover:bg-[#121212]/90 transition group relative overflow-hidden"
                >
                  {/* Category subtle top bar indicator */}
                  <div className="absolute top-0 right-0 left-0 h-0.5 bg-white/5 group-hover:bg-[#059669] transition-colors"></div>

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="px-2.5 py-1 bg-[#0a0a0a] border border-white/10 text-[9px] text-[#059669] font-mono tracking-widest uppercase rounded font-bold">
                        {service.category === "combo" ? "combo deal" : service.category}
                      </div>
                      <span className="font-mono text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {service.duration}
                      </span>
                    </div>

                    {/* Title & Price */}
                    <div className="flex items-baseline justify-between gap-2 mb-3">
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-[#059669] transition-colors uppercase">
                        {service.name}
                      </h3>
                      <span className="font-display font-black text-2xl text-[#059669]">
                        ${service.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Trigger Booking button */}
                  <button
                    onClick={() => triggerBookingSetup(undefined, service.id)}
                    className="w-full mt-auto py-3 bg-transparent hover:bg-[#059669] text-[#e5e7eb] hover:text-white border border-white/10 hover:border-[#059669] text-[11px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Select & Book Service
                    <Scissors className="w-3 h-3 text-current" />
                  </button>

                </motion.div>
              ))}
            </AnimatePresence>

            {filteredServices.length === 0 && (
              <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-lg bg-[#121212]">
                <p className="text-neutral-500 text-sm font-mono uppercase mb-2">No Matching Services Found</p>
                <button 
                  onClick={() => { setSearchQuery(""); setServiceFilter("all"); }}
                  className="text-xs text-[#059669] hover:underline font-bold font-mono"
                >
                  Reset all filters & search query
                </button>
              </div>
            )}
          </div>

          {/* Quick Note Infobar */}
          <div className="mt-12 p-4 bg-[#121212] border border-white/10 rounded-lg flex items-start gap-3.5 max-w-2xl mx-auto">
            <Info className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">
              <strong className="text-white">Note:</strong> All pricing is absolute with zero hidden surcharges. If you have custom requests (such as high-contrast hair design engraving), please note it down in your appointment details or discuss it during your in-chair consultation.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Meet the Barbers Section */}
      <section id="barbers" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-black text-[#059669] uppercase tracking-widest mb-3 inline-block">The Specialists</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
              Meet The Core Barbers
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              Craft rules. Our specialists carry flawless experience, unique design strengths, and individual streetwear inspirations to Atlanta.
            </p>
          </div>

          {/* Barbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BARBERS.map((barber) => (
              <div
                key={barber.id}
                className="group bg-[#121212] border border-white/10 rounded-lg overflow-hidden hover:border-[#059669]/50 transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Visual Header / Avatar area with custom layout */}
                <div className="relative h-72 w-full overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 duration-700 filter grayscale"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Streetwear Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                  
                  {/* Barber Nickname Badge Tag */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#121212]/95 border border-white/10 rounded">
                    <span className="font-black text-xs uppercase tracking-widest text-[#059669]">
                      "{barber.nickname}"
                    </span>
                  </div>

                  {/* Years Experience Floating Tag */}
                  <div className="absolute top-4 right-4 bg-[#121212]/95 px-3 py-1 rounded text-[10px] font-mono font-black tracking-widest text-neutral-400 border border-white/10">
                    EXP: {barber.experience} YRS
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Name */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-xl md:text-2xl uppercase italic tracking-tighter text-white">
                        {barber.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 font-bold">active</span>
                      </div>
                    </div>

                    {/* Specialty */}
                    <p className="font-mono text-xs text-[#059669] font-black uppercase tracking-widest mb-4">
                      ★ {barber.specialty}
                    </p>

                    {/* Bio text */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">
                      "{barber.bio}"
                    </p>

                    {/* tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {barber.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2.5 py-1 rounded-sm bg-[#0a0a0a] border border-white/5 text-xs font-mono text-neutral-400 font-bold"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Action Trigger */}
                  <button
                    onClick={() => triggerBookingSetup(barber.id, undefined)}
                    className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-black uppercase text-xs tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Select & Book {barber.name.split(" ")[0]}
                    <Scissors className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Gallery Section (Dynamic & Interactive Photo Gallery) */}
      <section id="gallery" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="items-end justify-between flex flex-col md:flex-row gap-6 mb-16">
            <div className="max-w-2xl text-left">
              <span className="font-mono text-xs font-black text-[#059669] uppercase tracking-widest mb-3 inline-block">Visual Work</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                Sleek Cuts Gallery
              </h2>
              <p className="text-gray-400 text-sm max-w-md mt-4 leading-relaxed">
                Explore real, authentic results from Marcus, Rico, and Jay. Taper fades, burst gradients, structured beard shapes, and the vintage studio atmosphere.
              </p>
            </div>

            {/* Gallery Category Filter Swiper */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none font-mono">
              {uniqueGalleryTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setGalleryFilter(tag)}
                  className={`px-3 py-1.5 text-xs tracking-widest uppercase transition duration-200 border font-mono font-black ${
                    galleryFilter.toLowerCase() === tag.toLowerCase()
                      ? "bg-[#059669] text-white border-[#059669]"
                      : "bg-[#121212] text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                  }`}
                >
                  {tag === "all" ? "All Cuts" : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((photo, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  key={photo.id}
                  className="group relative h-80 rounded-lg overflow-hidden border border-white/10 bg-[#121212] hover:border-[#059669]/40 transition-all duration-300"
                >
                  
                  {/* Photo tag (floating static markup) */}
                  <span className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-[#121212]/95 border border-white/10 rounded-sm text-[9px] font-mono uppercase font-black text-[#059669] tracking-wider">
                    {photo.tag}
                  </span>

                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 duration-700 transition grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover dark details info curtain */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
                    <span className="text-[10px] text-[#059669] font-mono tracking-widest uppercase mb-1 font-bold">Authenticated cut</span>
                    <h4 className="font-display font-extrabold text-base text-white uppercase tracking-tight">
                      {photo.title}
                    </h4>
                    <p className="text-[10.5px] text-neutral-400 font-mono tracking-wider mt-1.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      Legacy Certified Blend
                    </p>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 7. Reviews Bento Section */}
      <section id="reviews" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-black text-[#059669] uppercase tracking-widest mb-3 inline-block">Real Feedback</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
              Legacy Client Reviews
            </h2>
            <p className="text-[#e5e7eb]/80 text-sm max-w-md mx-auto leading-relaxed">
              Our commitment reflects directly off recommendations. Check what our recurring clients say about their chairs experience.
            </p>
          </div>

          {/* Interactive Reviews Bento Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <div 
                key={review.id}
                className={`p-6 md:p-8 bg-[#121212] border border-white/10 rounded-lg flex flex-col justify-between hover:border-[#059669]/40 transition ${
                  i === 1 ? "border-[#059669]/40 bg-[#121212]" : ""
                }`}
              >
                
                {/* Visual Header info */}
                <div>
                  
                  {/* Rating star blocks */}
                  <div className="flex items-center gap-1.5 mb-5 text-[#059669]">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#059669]" />
                    ))}
                  </div>

                  {/* Content block quote */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>

                </div>

                {/* Footer block info */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-2.5">
                    
                    {/* Placeholder circular avatar letter badge */}
                    <div className="w-8 h-8 rounded-sm bg-[#0a0a0a] border border-white/10 flex items-center justify-center font-display text-xs font-black text-neutral-300">
                      {review.user[0]}
                    </div>
                    
                    <div>
                      <h4 className="font-black text-xs text-white uppercase">
                        {review.user}
                      </h4>
                      <p className="font-mono text-[9px] text-neutral-500 tracking-wider">Verified Customer</p>
                    </div>

                  </div>

                  {/* Haircut specifier */}
                  <span className="px-2 py-1 bg-[#0a0a0a] border border-white/5 rounded-sm text-[9px] font-mono text-[#059669] font-bold">
                    {review.haircut}
                  </span>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Instagram Gallery Stream */}
      <section className="py-16 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Social Header */}
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <Instagram className="w-4 h-4 text-[#059669]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] font-black">
              Follow Us @LegacyBlendBarber
            </span>
          </div>
          
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-8">
            Recent Instagram Feeds
          </h3>

          {/* Insta Grid stream */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSTAGRAM_MOCKS.map(insta => (
              <a 
                href="#gallery" 
                key={insta.id}
                className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 transition focus:outline-none"
              >
                <img 
                  src={insta.url} 
                  alt="Recent hair lineup" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 duration-500 transition filter brightness-95 text-neutral-500 grayscale group-hover:grayscale-0" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlayer info */}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition duration-240 flex flex-col justify-center items-center">
                  <Instagram className="w-5 h-5 text-[#059669] mb-1.5" />
                  <span className="font-mono text-xs text-white uppercase font-black tracking-widest">view cut</span>
                  <span className="font-mono text-[9px] text-[#059669] mt-1 font-bold">❤ {insta.likes} Likes</span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 9. FAQs Accordion Section */}
      <section id="faqs" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-black text-[#059669] uppercase tracking-widest mb-3 inline-block">Assistance</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              We appreciate transparency. Click options to reveal detailed parameters around bookings, walk-ins, and payments.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = faqExpanded === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#121212] border border-white/10 rounded-lg overflow-hidden hover:border-[#059669]/30 transition duration-200"
                >
                  
                  {/* Accordion tab trigger clickable button */}
                  <button
                    onClick={() => setFaqExpanded(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-display font-black text-base md:text-lg text-white uppercase group-hover:text-[#059669] transition duration-200 leading-tight">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded border border-white/10 bg-[#0a0a0a] flex items-center justify-center text-neutral-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#059669]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Motion content expand area */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-4 border-t border-white/5 text-gray-400 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. Contact & Appointment Booking Platform */}
      <section id="booking" className="py-24 px-4 md:px-8 border-t border-white/10 bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-black/45 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" ref={bookingFormRef}>
            
            {/* Left side: Contact visual and critical details (5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              <div>
                <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 inline-block">Lock in Your Slot</span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
                  Schedule Your Legacy Experience
                </h2>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                  Secure your personalized session with Atlanta's prestige barbers. Use our dynamic appointment builder to choose your service, barber, and exact timing. Walk out feeling fresh and empowered.
                </p>
              </div>

              {/* Fictional Details block */}
              <div className="p-6 md:p-8 bg-neutral-900/30 border border-neutral-900 rounded-2xl space-y-6">
                
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider border-b border-neutral-800 pb-3 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-emerald-500" />
                  Barbershop Headquarters
                </h3>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-emerald-500 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-xs text-[#9ca3af] uppercase">STREET ADDRESS</h4>
                    <p className="text-white text-sm mt-1">215 Edgewood Avenue</p>
                    <p className="text-neutral-400 text-xs">Atlanta, GA 30303</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-emerald-500 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-xs text-[#9ca3af] uppercase">PHONE NUMBER</h4>
                    <p className="text-emerald-400 font-mono text-sm mt-1 hover:underline">
                      <a href="tel:4045550187">(404) 555-0187</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-emerald-500 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-xs text-[#9ca3af] uppercase">EMAIL BOOKINGS</h4>
                    <p className="text-white text-sm mt-1 hover:underline">
                      <a href="mailto:bookings@legacyblendbarber.com">bookings@legacyblendbarber.com</a>
                    </p>
                  </div>
                </div>

              </div>

              {/* Instant notification ticket info */}
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  📢 <strong className="text-white">Real-Time Confirmation Engine:</strong> All requests made here will generate an instant digital reservation ticket locally in your browser so you can view, edit, or show it at your front-desk checkout.
                </p>
              </div>

            </div>

            {/* Right side: Dynamic Appointment Request Form (7 Cols) */}
            <div id="contact" className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-lg p-6 md:p-10 relative">
              
              <AnimatePresence mode="wait">
                {!successBooking ? (
                  
                  /* Appointment request Input Form */
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleBookingSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter text-white mb-1.5 flex items-center gap-2">
                        Appointment request
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono">Fill details carefully to secure instant slots.</p>
                    </div>

                    {bookingError && (
                      <div className="p-3 bg-red-950/40 border border-[#059669]/20 rounded-lg text-emerald-250 text-xs font-mono">
                        ⚠ {bookingError}
                      </div>
                    )}

                    {/* Client Name Input */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                        Full Name <span className="text-[#059669]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Devin Rogers"
                        value={formData.clientName}
                        onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                        className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#059669] transition duration-200 font-mono"
                      />
                    </div>

                    {/* Contacts: phone & email inputs aligned */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Phone Number <span className="text-[#059669]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. (404) 555-0187"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#059669] transition duration-200 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Email Address <span className="text-[#059669]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. devin@gmail.com"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#059669] transition duration-200 font-mono"
                        />
                      </div>

                    </div>

                    {/* Barber & Service Selections aligned */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Preferred Barber <span className="text-[#059669]">*</span>
                        </label>
                        <select
                          value={formData.barberId}
                          onChange={(e) => setFormData({...formData, barberId: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-neutral-300 focus:outline-none focus:border-[#059669] transition duration-200 appearance-none cursor-pointer font-mono"
                        >
                          <option value="">-- Choose Your Specialist --</option>
                          {BARBERS.map(barber => (
                            <option key={barber.id} value={barber.id}>
                              {barber.name} ({barber.nickname})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Desired Service <span className="text-[#059669]">*</span>
                        </label>
                        <select
                          value={formData.serviceId}
                          onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-neutral-300 focus:outline-none focus:border-[#059669] transition duration-200 appearance-none cursor-pointer font-mono"
                        >
                          <option value="">-- Select Your Clean Service --</option>
                          {SERVICES.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.name} — ${service.price}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Schedule date & time inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Preferred Date <span className="text-[#059669]">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-neutral-300 focus:outline-none focus:border-[#059669] transition duration-200 cursor-pointer font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                          Desired Timeframe <span className="text-[#059669]">*</span>
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-neutral-300 focus:outline-none focus:border-[#059669] transition duration-200 appearance-none cursor-pointer font-mono"
                        >
                          <option value="">-- Select Available Time --</option>
                          {["09:00 AM", "10:00 AM", "11:00 AM", "12:30 PM", "01:30 PM", "02:30 PM", "03:30 PM", "04:30 PM", "05:30 PM", "06:30 PM", "07:30 PM"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Additional client notes details */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono font-black uppercase tracking-widest text-[#059669]">
                        Additional Notes / Special Instructions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Hair length design requests, skin sensitivities, or classic outlines details..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#059669] transition duration-200 resize-none font-mono"
                      />
                    </div>

                    {/* Trigger Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#059669] disabled:bg-[#047857] hover:bg-[#047857] text-white font-mono font-black uppercase text-sm tracking-widest rounded-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                          Verifying Schedule Availability...
                        </>
                      ) : (
                        "Request Confirmed Reservation"
                      )}
                    </button>

                  </motion.form>
                ) : (
                  
                  /* Animated success confirmation panel */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      >
                        <Check className="w-8 h-8" />
                      </motion.div>
                    </div>

                    <div>
                      <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase font-bold">RESERVATION RESERVED SECURELY</span>
                      <h3 className="font-display font-black text-3xl uppercase tracking-tight text-white mt-1">
                        You're Good To Go!
                      </h3>
                      <p className="text-neutral-400 text-sm max-w-md mx-auto mt-2">
                        Your appointment has been logged into our studio system. Present this ticket screen or serial key code when checking in at Edgewood Ave.
                      </p>
                    </div>

                    {/* Dynamic Digital Ticket layout */}
                    <div className="max-w-md mx-auto border border-neutral-800 bg-[#0a0a0c] rounded-2xl overflow-hidden font-mono text-left text-xs text-neutral-300 relative">
                      
                      {/* Ticket top jagged cutout border decorative effect */}
                      <div className="absolute top-0 inset-x-0 flex justify-between px-4 -translate-y-1.5">
                        {[...Array(12)].map((_, idx) => (
                          <div key={idx} className="w-3 h-3 bg-neutral-950 rounded-full border border-neutral-900"></div>
                        ))}
                      </div>

                      <div className="p-6 border-b border-neutral-900/60 pt-8 flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">TICKET REF CODE</p>
                          <p className="text-base text-emerald-400 font-bold">{successBooking.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-500 uppercase">DATE CONFIRMED</p>
                          <p className="font-bold text-white">{successBooking.createdAt}</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">CLIENT NAME</p>
                            <p className="font-bold text-white truncate">{successBooking.clientName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">PHONE CONTACT</p>
                            <p className="font-bold text-neutral-300">{successBooking.clientPhone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">HAIRCUT SERVICE</p>
                            <p className="font-bold text-emerald-400 truncate">{successBooking.serviceName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">TOTAL RATE</p>
                            <p className="font-bold text-white">${successBooking.price}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-neutral-900">
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">CHAIR BARBER</p>
                            <p className="font-bold text-white">{successBooking.barberName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">APMT TIME</p>
                            <p className="font-bold text-emerald-400">{successBooking.date} @ {successBooking.time}</p>
                          </div>
                        </div>
                        {successBooking.notes && (
                          <div className="pt-2">
                            <p className="text-[9px] text-neutral-500 uppercase">CLIENT MEMO</p>
                            <p className="text-neutral-400 italic text-[11px] leading-relaxed truncate">"{successBooking.notes}"</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#111114] px-6 py-4.5 text-center text-[10px] text-neutral-500 uppercase tracking-widest border-t border-neutral-900">
                        🤝 Legacy Blend Atlanta • Non-Refundable Only
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto">
                      <button 
                        onClick={() => triggerBookingSetup()}
                        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white font-mono text-xs uppercase tracking-wider rounded-lg border border-neutral-800 transition"
                      >
                        Book Another Session
                      </button>
                      <button 
                        onClick={() => setSuccessBooking(null)}
                        className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white font-mono text-xs uppercase tracking-wider rounded-lg border border-neutral-750 transition"
                      >
                        Close Ticket Receipt
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </section>

      {/* 11. Footer section */}
      <footer className="bg-[#050505] border-t border-white/10 py-16 px-4 md:px-8 text-neutral-400">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16">
            
            {/* Column 1: Brand details (4 Cols) */}
            <div className="md:col-span-4 space-y-6">
              
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#121212] border border-white/10 rounded-sm">
                  <Scissors className="w-5 h-5 text-[#059669]" />
                </div>
                <span className="font-display font-black tracking-tight text-xl uppercase leading-none text-white">
                  Legacy <span className="text-[#059669]">Blend</span>
                </span>
              </div>

              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed max-w-sm">
                Creating fresh confidence through high-end precise haircut craftsmanship in downtown Atlanta. Step up your style with Rico, Marcus, and Jay.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <Instagram className="w-4 h-4" />, href: "#instagram", label: "Instagram Link" },
                  { icon: "𝕏", href: "#x", label: "X Social Profile" },
                  { icon: "☄", href: "#threads", label: "Threads Workspace" },
                  { icon: "✦", href: "#tiktok", label: "TikTok Profile" }
                ].map((s, idx) => (
                  <a 
                    key={idx}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded border border-white/10 bg-[#121212] hover:bg-[#059669] hover:text-white hover:border-[#059669] transition duration-300 flex items-center justify-center font-bold text-xs"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

            </div>

            {/* Column 2: Quick Links (2.5 Cols) */}
            <div className="md:col-span-2.5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] font-black">Quick Navigation</h3>
              <ul className="space-y-2.5 text-xs font-mono">
                <li><a href="#services" className="hover:text-[#059669] transition">Services Menu</a></li>
                <li><a href="#barbers" className="hover:text-[#059669] transition">Meet Special Barbers</a></li>
                <li><a href="#gallery" className="hover:text-[#059669] transition">Cut Master Work Gallery</a></li>
                <li><a href="#reviews" className="hover:text-[#059669] transition">Client Recommendations</a></li>
                <li><a href="#faqs" className="hover:text-[#059669] transition">Assistance & FAQs</a></li>
              </ul>
            </div>

            {/* Column 3: Hours (3 Cols) */}
            <div className="md:col-span-3.5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] font-black">Operating Hours</h3>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">MON - FRI</span>
                  <span className="text-white font-bold">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-500">SATURDAY</span>
                  <span className="text-white font-bold">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-neutral-500">SUNDAY</span>
                  <span className="text-white font-bold">11:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Core (2 Cols) */}
            <div className="md:col-span-2 space-y-4 text-xs font-mono">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] font-black">Contact</h3>
              <p className="text-neutral-500 leading-relaxed">
                215 Edgewood Avenue<br />
                Atlanta, GA 30303
              </p>
              <p className="text-[#059669] font-mono">
                <a href="tel:4045550187" className="hover:underline">(404) 555-0187</a>
              </p>
            </div>

          </div>

          {/* Copyright section */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-mono text-center">
            <p>© 2026 Legacy Blend Barbershop Co. All Rights Reserved. Designed for young professionals.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-neutral-400 transition">Privacy Policy</a>
              <span className="text-neutral-800">•</span>
              <a href="#terms" className="hover:text-neutral-400 transition">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive slide-out drawer list panel for My Bookings */}
      <AnimatePresence>
        {showMyBookings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyBookings(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 z-50 p-6 md:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <div>
                    <h3 className="font-display font-black text-xl uppercase italic tracking-tighter text-white">Your Reserved Tickets</h3>
                    <p className="font-mono text-[10px] text-neutral-500 font-bold">List of locally stored barbering sessions</p>
                  </div>
                  <button 
                    onClick={() => setShowMyBookings(false)}
                    className="p-2 border border-white/10 rounded-sm hover:border-[#059669]/60 transition text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Booking lists */}
                <div className="space-y-6">
                  {bookings.map(book => (
                    <div 
                      key={book.id}
                      className="border border-white/10 bg-[#121212] p-5 rounded-sm relative space-y-4 hover:border-[#059669]/30 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-[#0a0a0a] border border-white/10 rounded-sm font-mono text-[9px] text-[#9ca3af] font-bold">
                            {book.id}
                          </span>
                          <h4 className="font-display font-black text-sm text-white uppercase mt-1.5">{book.serviceName}</h4>
                        </div>
                        <span className="font-display font-black text-[#059669] text-lg">${book.price}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <p className="text-[9px] text-neutral-500 uppercase font-bold">Specialist Barber</p>
                          <p className="font-bold text-white mt-0.5">{book.barberName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-neutral-500 uppercase font-bold">Confirmed Time</p>
                          <p className="font-bold text-[#059669] mt-0.5">{book.date} @ {book.time}</p>
                        </div>
                      </div>

                      {book.notes && (
                        <p className="text-[11px] text-neutral-400 italic bg-[#0a0a0a] p-2 rounded-sm border border-white/10 truncate">
                          "{book.notes}"
                        </p>
                      )}

                      {/* Cancel actions */}
                      <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-500 font-bold">Reserved on {book.createdAt}</span>
                        <button 
                          onClick={() => handleCancelBooking(book.id)}
                          className="px-2.5 py-1 text-red-500 hover:text-red-400 hover:bg-red-950/20 border border-red-900/30 rounded-sm duration-200 cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      </div>

                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
                      <p className="text-neutral-500 font-mono text-xs uppercase font-bold">No Current Bookings Found</p>
                      <p className="text-neutral-600 text-[11px] mt-1 px-4 font-mono">All appointment requests you make will appear securely here using web local persistence.</p>
                      <button 
                        onClick={() => { setShowMyBookings(false); triggerBookingSetup(); }}
                        className="mt-6 px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-mono font-black uppercase tracking-widest rounded-sm cursor-pointer"
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  )}
                </div>

              </div>
              
              {/* Drawer footer info */}
              <div className="pt-6 border-t border-white/10 mt-8 text-center text-[10px] font-mono text-neutral-500 font-bold">
                📌 Showing all validated appointment tickets. Report checkout errors at 215 Edgewood Avenue.
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
