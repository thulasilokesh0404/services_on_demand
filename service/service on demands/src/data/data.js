export const services = [
  { id: 1, name: "Home Cleaning", category: "Cleaning", price: 499, rating: 4.8, reviews: 420, icon: "Sparkles", image: "/assets/service-cleaning.jpg", description: "Deep cleaning for kitchens, bathrooms, bedrooms and living areas." },
  { id: 2, name: "Plumbing Repair", category: "Plumbing", price: 299, rating: 4.9, reviews: 318, icon: "Wrench", image: "/assets/service-plumbing.jpg", description: "Fast and reliable plumbing repairs for leaks, taps, pipes and fittings." },
  { id: 3, name: "Electrical Service", category: "Electrician", price: 299, rating: 4.8, reviews: 320, icon: "Zap", image: "/assets/service-electrical.jpg", description: "Certified electricians for switches, lights, fans and home wiring." },
  { id: 4, name: "Carpentry", category: "Carpentry", price: 399, rating: 4.7, reviews: 180, icon: "Hammer", image: "/assets/service-carpentry.jpg", description: "Furniture repair, installation and custom carpentry work." },
  { id: 5, name: "AC Repair", category: "AC Repair", price: 599, rating: 4.7, reviews: 260, icon: "Snowflake", image: "/assets/service-ac.jpg", description: "AC service, repair, gas refill and preventive maintenance." },
  { id: 6, name: "Painting", category: "Painting", price: 799, rating: 4.6, reviews: 140, icon: "Paintbrush", image: "/assets/service-painting.jpg", description: "Professional interior and exterior painting services." }
];

export const providers = [
  { id: 1, name: "Ravi Kumar", service: "Electrician", rating: 4.9, reviews: 320, jobs: 540, price: 299, image: "/assets/provider-ravi.jpg" },
  { id: 2, name: "Sunil Yadav", service: "Plumber", rating: 4.8, reviews: 210, jobs: 410, price: 299, image: "/assets/provider-sunil.jpg" },
  { id: 3, name: "Amit Verma", service: "Carpenter", rating: 4.7, reviews: 180, jobs: 380, price: 299, image: "/assets/provider-amit.jpg" }
];

export const bookings = [
  { id: "SH125456", service: "Electrician", provider: "Ravi Kumar", date: "14 Aug 2026", time: "10:00 AM", amount: 299, status: "Confirmed" },
  { id: "SH125231", service: "Plumbing", provider: "Sunil Yadav", date: "12 Aug 2026", time: "11:30 AM", amount: 399, status: "Completed" },
  { id: "SH125004", service: "Home Cleaning", provider: "Amit Verma", date: "08 Aug 2026", time: "03:00 PM", amount: 599, status: "Cancelled" }
];
