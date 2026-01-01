// Brand Constants - Krishna Properties
export const BRAND = {
  name: "Krishna Properties",
  tagline: "Local guidance for open plots",
  consultant: {
    name: "Bhukya Krishna",
    title: "Senior Property Consultant",
    experience: "15+ years",
  },
  regions: ["East Hyderabad", "Hyderabad–Warangal corridor"],
} as const;

// Contact Information
export const CONTACT = {
  phone: "+919848151456",
  phoneDisplay: "+91 9848 151 456",
  email: "krishnaproperties9848@gmail.com",
  whatsapp: "919848151456",
  whatsappLink: "https://wa.me/919848151456",
  responseTime: "under 1 hour",
  languages: ["English", "Telugu"],
} as const;

// Office Locations
export const OFFICES = {
  corporate: {
    name: "Corporate Office",
    address: "H.No: 8-3-940/A, Flat No. 205, Tirumala Shah Apartments, Ameerpet X Roads, Hyderabad – 500 073",
  },
  branch: {
    name: "Branch Office",
    address: "D.No: 2-1-46/1, 3rd Floor, Sri Venkateswara Housing Colony, Above KS Bakers, Opp. Metro Pillar No. 865, Uppal, Medchal-Malkajgiri District, Telangana – 500 039",
  },
} as const;

// Services
export const SERVICES = [
  {
    id: "plot-shortlisting",
    title: "Plot Shortlisting",
    shortDescription: "Shortlist open plots by budget, location, and timeline across East Hyderabad and the Hyderabad–Warangal corridor.",
    fullDescription: "We help you filter through available plots based on your specific requirements including budget range, preferred localities, road access, neighborhood quality, and your investment timeline. Our local knowledge ensures you see only relevant options.",
    icon: "MapPinned",
    benefits: [
      "Budget-aligned options",
      "Location-specific filtering",
      "Timeline-based recommendations",
      "Access to off-market opportunities",
    ],
  },
  {
    id: "document-support",
    title: "Document & Site Check Support",
    shortDescription: "Guidance to review basic documents and on-ground details before you pay an advance.",
    fullDescription: "Before you commit any money, we guide you through essential document verification and site inspection. We help you understand what to look for in title documents, layout approvals, and physical site conditions.",
    icon: "FileText",
    benefits: [
      "Title document review guidance",
      "Layout approval verification",
      "On-site physical inspection",
      "Clear documentation checklist",
    ],
  },
  {
    id: "negotiation-registration",
    title: "Negotiation & Registration Support",
    shortDescription: "Help coordinating with sellers and understanding the paperwork steps through registration.",
    fullDescription: "From price negotiation to final registration, we coordinate between you and the seller, help you understand each step of the process, and ensure smooth completion of your property transaction.",
    icon: "Handshake",
    benefits: [
      "Price negotiation assistance",
      "Seller coordination",
      "Registration process guidance",
      "Post-sale support",
    ],
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ravi Kumar",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    location: "Uppal, Hyderabad",
    rating: 5,
    quote: "Krishna garu guided me patiently through location options and basic document checks. The process felt clear and well explained.",
    investment: "Srisailam Highway",
  },
  {
    id: 2,
    name: "Anjali Reddy",
    role: "IT Professional",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    location: "East Hyderabad",
    rating: 5,
    quote: "Even while I was outside India, he shared photos and updates regularly and helped me shortlist options near the corridor.",
    investment: "Mumbai Highway",
  },
  {
    id: 3,
    name: "Sandeep Chowdary",
    role: "Business Owner",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    location: "Warangal",
    rating: 5,
    quote: "He explained the key documents to verify and coordinated smoothly between us and the seller. It was straightforward and stress-free.",
    investment: "Warangal Highway",
  },
  {
    id: 4,
    name: "Lakshmi Devi",
    role: "Doctor",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    location: "Hyderabad",
    rating: 5,
    quote: "He shared clear location details and helped me compare options based on my needs. The guidance was honest and practical.",
    investment: "Nagpur Highway",
  },
  {
    id: 5,
    name: "Suresh Babu",
    role: "Civil Engineer",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    location: "Hyderabad",
    rating: 5,
    quote: "He coordinated smoothly and kept me updated at each step, which made it much easier to decide remotely.",
    investment: "Srisailam Highway",
  },
  {
    id: 6,
    name: "Padmavati Devi",
    role: "Retired Principal",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
    location: "Warangal",
    rating: 5,
    quote: "He treated us with respect and guided us honestly based on our budget and needs. We felt confident with his suggestions.",
    investment: "Warangal Highway",
  },
  {
    id: 7,
    name: "Venkat Rao",
    role: "NRI - USA",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    location: "Dallas, USA",
    rating: 5,
    quote: "Being overseas, I needed someone I could trust. Krishna garu sent regular updates with photos and handled everything transparently.",
    investment: "ORR East",
  },
  {
    id: 8,
    name: "Priya Sharma",
    role: "Teacher",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    location: "Secunderabad",
    rating: 5,
    quote: "First-time buyer here. He explained everything step by step without rushing. Very patient and helpful throughout.",
    investment: "Pocharam",
  },
] as const;

// Sample Brochures
export const BROCHURES = [
  {
    id: "sri-lakshmi-enclave",
    title: "Sri Lakshmi Enclave",
    location: "Srisailam Highway",
    region: "East Hyderabad",
    plotSizes: "150 - 500 sq. yards",
    priceRange: "₹18,000 - ₹25,000 per sq. yard",
    highlights: ["DTCP Approved", "Near ORR Exit", "Gated Community", "24/7 Security"],
    thumbnail: "/brochures/sri-lakshmi-enclave-thumb.jpg",
    pdfUrl: "/brochures/sri-lakshmi-enclave.pdf",
    status: "Available",
  },
  {
    id: "green-valley-phase2",
    title: "Green Valley Phase 2",
    location: "Warangal Highway",
    region: "Warangal",
    plotSizes: "200 - 400 sq. yards",
    priceRange: "₹12,000 - ₹18,000 per sq. yard",
    highlights: ["Clear Title", "Wide Roads", "Near NH-163", "Water Connection"],
    thumbnail: "/brochures/green-valley-thumb.jpg",
    pdfUrl: "/brochures/green-valley.pdf",
    status: "Available",
  },
  {
    id: "krishna-gardens",
    title: "Krishna Gardens",
    location: "Pocharam",
    region: "East Hyderabad",
    plotSizes: "120 - 300 sq. yards",
    priceRange: "₹22,000 - ₹30,000 per sq. yard",
    highlights: ["HMDA Layout", "Corner Plots Available", "Near IT Corridor", "Parks & Amenities"],
    thumbnail: "/brochures/krishna-gardens-thumb.jpg",
    pdfUrl: "/brochures/krishna-gardens.pdf",
    status: "Available",
  },
  {
    id: "sunrise-meadows",
    title: "Sunrise Meadows",
    location: "Nagpur Highway",
    region: "East Hyderabad",
    plotSizes: "167 - 500 sq. yards",
    priceRange: "₹15,000 - ₹20,000 per sq. yard",
    highlights: ["LP Approved", "Avenue Plantation", "Underground Drainage", "Street Lights"],
    thumbnail: "/brochures/sunrise-meadows-thumb.jpg",
    pdfUrl: "/brochures/sunrise-meadows.pdf",
    status: "Available",
  },
  {
    id: "lake-view-residency",
    title: "Lake View Residency",
    location: "Mumbai Highway",
    region: "East Hyderabad",
    plotSizes: "200 - 600 sq. yards",
    priceRange: "₹20,000 - ₹28,000 per sq. yard",
    highlights: ["Lake Facing Plots", "Premium Location", "Investment Grade", "Easy EMI Options"],
    thumbnail: "/brochures/lake-view-thumb.jpg",
    pdfUrl: "/brochures/lake-view.pdf",
    status: "Few Left",
  },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/brochures", label: "Brochures" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/insights", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

// UTM Parameters Convention
export const UTM_CONVENTIONS = {
  sources: ["google", "facebook", "instagram", "whatsapp", "direct", "referral", "gbp"],
  mediums: ["organic", "cpc", "social", "email", "referral"],
  campaigns: {
    prefix: "kp_", // Krishna Properties prefix
    examples: ["kp_easthyderabad_plots", "kp_warangal_launch", "kp_nri_outreach"],
  },
} as const;
