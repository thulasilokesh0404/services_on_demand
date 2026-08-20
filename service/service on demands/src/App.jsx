import React, { useState } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import {
  Shield, Search, MapPin, ChevronDown, ArrowRight, Star, CheckCircle2,
  Sparkles, Wrench, Zap, Hammer, Snowflake, Paintbrush, Menu, X,
  LayoutDashboard, CalendarDays, MessageCircle, Wallet, UserRound,
  Bell, Settings, LogOut, MapPinned, HeartHandshake, CreditCard, Clock3,
  Headphones, BadgeCheck, BriefcaseBusiness, Users, IndianRupee,
  TrendingUp, MoreHorizontal, Plus, ChevronRight
} from "lucide-react";
import { services, providers, bookings } from "./data/data";

const iconMap = { Sparkles, Wrench, Zap, Hammer, Snowflake, Paintbrush };

function Logo() {
  return <Link to="/" className="flex items-center gap-2 text-lg font-bold text-indigo-600"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><Shield size={17} fill="currentColor" /></span>ServiceHub</Link>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
    <div className="container-x flex h-[72px] items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-8 md:flex">
        <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">Home</Link>
        <Link to="/services" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">Services</Link>
        <Link to="/how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">How It Works</Link>
        <Link to="/become-provider" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">Become a Provider</Link>
        <Link to="/about" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">About Us</Link>
      </nav>
      <div className="hidden items-center gap-5 md:flex"><Link to="/login" className="text-sm font-semibold text-indigo-600">Login</Link><Link to="/register" className="btn-primary px-5 py-2.5">Sign Up</Link></div>
      <button className="rounded-lg p-2 md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
    {open && <div className="border-t bg-white p-5 md:hidden"><div className="grid gap-4">{[["/","Home"],["/services","Services"],["/how-it-works","How It Works"],["/become-provider","Become a Provider"],["/about","About Us"],["/login","Login"],["/register","Sign Up"]].map(([path,label])=><Link onClick={()=>setOpen(false)} key={path} to={path} className="font-medium text-slate-700">{label}</Link>)}</div></div>}
  </header>;
}

function Footer() {
  return <footer className="bg-slate-950 text-white"><div className="container-x grid gap-10 py-14 md:grid-cols-3">
    <div><Logo/><p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">Your one-stop destination for all home services. Quality service at your doorstep.</p></div>
    <div><h4 className="font-semibold">Company</h4><div className="mt-4 grid gap-3 text-sm text-slate-400"><Link to="/about">About Us</Link><Link to="/become-provider">Become a Provider</Link><Link to="/how-it-works">How It Works</Link></div></div>
    <div><h4 className="font-semibold">Contact</h4><div className="mt-4 grid gap-3 text-sm text-slate-400"><span>+1 234 567 8900</span><span>support@servicehub.com</span></div></div>
  </div><div className="container-x border-t border-slate-800 py-5 text-center text-xs text-slate-500">© 2026 ServiceHub. All rights reserved.</div></footer>;
}

function ServiceCard({s}) {
  const Icon = iconMap[s.icon] || Sparkles;
  return <Link to={`/services/${s.id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
    <div className="relative h-40 overflow-hidden bg-indigo-50"><img src={s.image} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-4 top-4 service-icon"><Icon size={20}/></div></div>
    <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{s.name}</h3><p className="mt-1 text-xs text-slate-500">{s.category}</p></div><span className="flex items-center gap-1 text-sm font-semibold"><Star size={14} fill="#f59e0b" className="text-amber-500"/>{s.rating}</span></div><div className="mt-5 flex items-center justify-between"><span className="text-sm text-slate-500">Starts at <b className="text-slate-900">₹{s.price}</b></span><span className="text-sm font-semibold text-indigo-600">Book <ArrowRight size={15} className="ml-1 inline"/></span></div></div>
  </Link>;
}

function ProviderCard({p}) {
  return <div className="card p-4"><div className="flex items-center gap-3"><img src={p.image} className="h-14 w-14 rounded-full object-cover ring-4 ring-indigo-50"/><div><h3 className="font-bold text-slate-900">{p.name}</h3><p className="text-xs text-slate-500">{p.service}</p><p className="mt-1 flex items-center gap-1 text-xs"><Star size={12} fill="#f59e0b" className="text-amber-500"/><b>{p.rating}</b> <span className="text-slate-400">({p.reviews})</span></p></div></div><div className="mt-4 flex items-center justify-between border-t pt-3 text-xs"><span className="text-indigo-600"><BadgeCheck size={12} className="mr-1 inline"/>Verified</span><span className="text-slate-500">Starts at <b className="text-slate-900">₹{p.price}</b></span></div></div>;
}

function Home() {
  const navigate = useNavigate();
  const [q,setQ] = useState("");
  return <><Navbar/><main>
    <section className="hero-grid border-b border-slate-100"><div className="container-x grid min-h-[560px] items-center gap-10 py-16 lg:grid-cols-2">
      <div><span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600"><Sparkles size={13}/>Service On Demand</span>
        <h1 className="mt-6 text-5xl font-extrabold leading-[1.03] tracking-tight text-slate-900 md:text-6xl">All Services<br/><span className="text-indigo-600">At Your Doorstep</span></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-500">Book trusted professionals for home services, repairs, cleaning, beauty, and more — anytime, anywhere.</p>
        <div className="mt-7 flex max-w-[560px] flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 px-3"><Search size={18} className="text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} className="w-full py-3 text-sm outline-none" placeholder="What service do you need?"/></div>
          <button onClick={()=>navigate(`/services${q?`?q=${encodeURIComponent(q)}`:""}`)} className="btn-primary rounded-2xl">Search</button>
        </div>
        <div className="mt-8 grid max-w-xl grid-cols-4 gap-4 text-xs"><Stat n="500+" t="Services"/><Stat n="10K+" t="Professionals"/><Stat n="1M+" t="Happy Customers"/><Stat n="4.8" t="Avg. Ratings" star/></div>
      </div>
      <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute inset-10 rounded-full bg-indigo-100/70 blur-sm"/><img src="/assets/hero-worker.jpg" className="relative mx-auto h-[420px] w-full rounded-[28px] object-cover shadow-soft"/><div className="absolute right-0 top-1/2 rounded-2xl bg-white p-4 shadow-soft"><div className="flex items-center gap-3"><img src="/assets/provider-ravi.jpg" className="h-10 w-10 rounded-full object-cover"/><div><b className="text-sm">Electrician</b><p className="text-xs text-slate-500">15 min away</p><span className="text-xs font-bold text-amber-500">★ 4.8</span></div></div></div></div>
    </div></section>

    <section className="py-16"><div className="container-x"><div className="flex items-end justify-between"><div><p className="text-sm font-semibold text-indigo-600">Trusted experts</p><h2 className="section-title mt-2">Top Service Providers</h2></div><Link to="/services" className="hidden text-sm font-semibold text-indigo-600 sm:block">See All <ArrowRight className="inline" size={15}/></Link></div><div className="mt-8 grid gap-5 md:grid-cols-3">{providers.map(p=><ProviderCard p={p} key={p.id}/>)}</div></div></section>

    <section className="bg-white py-16"><div className="container-x"><p className="text-sm font-semibold text-indigo-600">Simple process</p><h2 className="section-title mt-2">How It Works</h2><p className="muted mt-2">Get your work done in 4 simple steps</p><div className="mt-9 grid gap-4 md:grid-cols-4">{["Choose Service","Book Instantly","Professional Arrives","Work Done"].map((x,i)=><div className="card p-6" key={x}><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 font-bold text-indigo-600">{i+1}</span><h3 className="mt-5 font-bold">{x}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{["Select the service you need from our list","Pick a time and book your service","Our expert will arrive at your location","Get the work done and pay securely"][i]}</p></div>)}</div></div></section>

    <section className="bg-indigo-600 py-14 text-white"><div className="container-x"><h2 className="text-3xl font-bold">Why Choose ServiceHub?</h2><div className="mt-9 grid gap-8 md:grid-cols-4">{[[Users,"Trusted Professionals","Verified & experienced experts"],[CreditCard,"Secure Payments","100% secure payment options"],[Clock3,"On-Time Service","Punctual and reliable service"],[Headphones,"24/7 Support","We're here to help you"]].map(([I,t,d])=><div key={t}><I size={28}/><h3 className="mt-4 font-bold">{t}</h3><p className="mt-1 text-sm text-indigo-100">{d}</p></div>)}</div></div></section>

    <section className="py-16"><div className="container-x"><div className="overflow-hidden rounded-3xl bg-indigo-50"><div className="grid items-center md:grid-cols-2"><div className="p-8 md:p-14"><p className="text-sm font-semibold text-indigo-600">Grow with us</p><h2 className="mt-2 text-3xl font-bold">Become a Service Provider</h2><p className="mt-3 text-slate-500">Earn money by providing services in your area.</p><Link to="/register" className="btn-primary mt-7">Join Now</Link></div><div className="flex h-72 items-end justify-center"><img src="/assets/cta-provider.jpg" className="h-full w-full object-cover object-top"/></div></div></div></div></section>
  </main><Footer/></>;
}

function HowItWorks(){
  const steps = [
    [Search, "Choose a Service", "Browse our trusted home services and select what you need."],
    [CalendarDays, "Book Instantly", "Choose your preferred date and time and confirm your booking."],
    [MapPinned, "Professional Arrives", "A verified professional comes to your doorstep on time."],
    [CheckCircle2, "Get the Work Done", "Enjoy quality service and make a secure payment after completion."]
  ];
  return <><Navbar/><main><section className="bg-indigo-50 py-16"><div className="container-x text-center"><p className="text-sm font-semibold text-indigo-600">Simple & Easy</p><h1 className="mt-2 text-4xl font-extrabold text-slate-900 md:text-5xl">How It Works</h1><p className="mx-auto mt-4 max-w-2xl text-slate-500">Book a trusted professional in just four simple steps.</p></div></section><section className="py-16"><div className="container-x grid gap-6 md:grid-cols-4">{steps.map(([I,title,desc],i)=><div className="card p-7" key={title}><span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><I size={23}/></span><span className="mt-5 block text-xs font-bold text-indigo-600">STEP {i+1}</span><h2 className="mt-2 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div>)}</div></section></main><Footer/></>;
}

function BecomeProvider(){
  return <><Navbar/><main><section className="bg-indigo-600 py-20 text-white"><div className="container-x grid items-center gap-10 md:grid-cols-2"><div><p className="text-sm font-semibold text-indigo-100">Grow with ServiceHub</p><h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Become a Service Provider</h1><p className="mt-5 max-w-xl leading-7 text-indigo-100">Turn your skills into income. Join our platform, connect with customers in your area, and grow your service business.</p><Link to="/register" className="btn-primary mt-7 inline-block bg-white text-indigo-600">Join Now</Link></div><img src="/assets/cta-provider.jpg" className="h-80 w-full rounded-3xl object-cover"/></div></section><section className="py-16"><div className="container-x"><h2 className="section-title">Why join us?</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{[[IndianRupee,"Earn More","Get more customers and grow your income."],[Users,"Reach Customers","Connect with customers looking for your services."],[BadgeCheck,"Build Trust","Get verified and build a strong professional profile."]].map(([I,t,d])=><div className="card p-7" key={t}><I className="text-indigo-600" size={28}/><h3 className="mt-4 font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div></div></section></main><Footer/></>;
}

function AboutUs(){
  return <><Navbar/><main><section className="bg-slate-50 py-20"><div className="container-x text-center"><p className="text-sm font-semibold text-indigo-600">About ServiceHub</p><h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">Making Home Services Simple</h1><p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500">ServiceHub connects customers with trusted professionals for reliable home services, repairs, cleaning, beauty, and more.</p></div></section><section className="py-16"><div className="container-x grid gap-8 md:grid-cols-3">{[[Shield,"Trusted","We connect you with verified and experienced professionals."],[HeartHandshake,"Reliable","We make booking and getting service at home simple and convenient."],[Headphones,"Support","Our team is here to help you throughout your service journey."]].map(([I,t,d])=><div className="card p-7" key={t}><I className="text-indigo-600" size={30}/><h2 className="mt-4 text-xl font-bold">{t}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div></section></main><Footer/></>;
}

function Stat({n,t,star}) { return <div><div className="flex items-center gap-1 text-base font-bold">{star&&<Star size={14} fill="#f59e0b" className="text-amber-500"/>}{n}</div><p className="mt-1 text-slate-500">{t}</p></div> }

function ServicesPage() {
  const [search,setSearch]=useState(""); const [cat,setCat]=useState("All");
  const cats=["All","Cleaning","Plumbing","Electrician","Carpentry","AC Repair","Painting"];
  const filtered=services.filter(s=>(cat==="All"||s.category===cat)&&s.name.toLowerCase().includes(search.toLowerCase()));
  return <><Navbar/><main className="container-x py-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-semibold text-indigo-600">Browse services</p><h1 className="section-title mt-2">Find the right service</h1><p className="muted mt-2">Trusted professionals, transparent pricing and easy booking.</p></div><div className="relative w-full md:max-w-sm"><Search className="absolute left-4 top-3.5 text-slate-400" size={18}/><input className="input pl-11" placeholder="Search service..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="hide-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold ${cat===c?"bg-indigo-600 text-white":"bg-white text-slate-600 border border-slate-200"}`}>{c}</button>)}</div><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(s=><ServiceCard s={s} key={s.id}/>)}</div></main><Footer/></>;
}

function ServiceDetails({id}) {
  const s=services.find(x=>x.id===Number(id))||services[0]; const Icon=iconMap[s.icon]||Sparkles; const navigate=useNavigate();
  return <><Navbar/><main className="container-x py-10"><Link to="/services" className="text-sm font-semibold text-indigo-600">← Back to services</Link><div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_.8fr]"><div className="card overflow-hidden"><img src={s.image} className="h-[360px] w-full object-cover"/><div className="p-7"><div className="flex items-center gap-3"><span className="service-icon"><Icon/></span><div><h1 className="text-3xl font-bold">{s.name}</h1><p className="text-sm text-slate-500">{s.category}</p></div></div><div className="mt-5 flex items-center gap-4 text-sm"><span className="flex items-center gap-1 font-semibold"><Star size={16} fill="#f59e0b" className="text-amber-500"/>{s.rating}</span><span className="text-slate-400">({s.reviews} reviews)</span><span className="font-bold">₹{s.price} onwards</span></div><p className="mt-7 leading-7 text-slate-600">{s.description}</p><h2 className="mt-8 text-xl font-bold">What's included</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{["Professional service","Verified expert","Transparent pricing","Post-service support"].map(x=><div key={x} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 size={18} className="text-emerald-500"/>{x}</div>)}</div></div></div><div className="card h-fit p-7"><p className="text-sm font-semibold text-indigo-600">Book now</p><h2 className="mt-2 text-2xl font-bold">Get it done today</h2><div className="mt-6 flex justify-between border-b pb-4"><span className="text-slate-500">Starting price</span><b>₹{s.price}</b></div><div className="mt-4 flex justify-between border-b pb-4"><span className="text-slate-500">Platform fee</span><b>₹20</b></div><div className="mt-4 flex justify-between text-lg"><span>Total</span><b>₹{s.price+20}</b></div><button onClick={()=>navigate(`/booking/${s.id}`)} className="btn-primary mt-7 w-full">Book Now</button><p className="mt-3 text-center text-xs text-slate-400">No payment required until confirmation</p></div></div></main><Footer/></>;
}

function Auth({register=false}) {
  const nav=useNavigate();
  const submit=e=>{
    e.preventDefault();
    const name=register ? (e.target.name?.value || "Navya") : "Navya";
    localStorage.setItem("servicehub_user",JSON.stringify({name,role:"customer"}));
    nav("/customer");
  };
  return <div className="min-h-screen bg-slate-50"><div className="container-x flex min-h-screen items-center justify-center py-10"><div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-soft md:grid-cols-2"><div className="hidden bg-indigo-600 p-12 text-white md:block"><Logo/><h1 className="mt-20 text-4xl font-bold">{register?"Join ServiceHub":"Welcome back"}</h1><p className="mt-5 leading-7 text-indigo-100">Book trusted professionals and manage every service from one simple place.</p><div className="mt-10 space-y-4">{["Verified professionals","Transparent pricing","Secure payments"].map(x=><div className="flex items-center gap-3" key={x}><CheckCircle2/>{x}</div>)}</div></div><div className="p-8 md:p-12"><Logo/><h2 className="mt-10 text-3xl font-bold">{register?"Create your account":"Sign in to your account"}</h2><p className="mt-2 text-sm text-slate-500">{register?"Start booking services in minutes.":"Continue to your ServiceHub dashboard."}</p><form onSubmit={submit} className="mt-8 space-y-4">{register&&<input name="name" className="input" placeholder="Full name" required/>}<input className="input" type="email" placeholder="Email address" required/><input className="input" type="password" placeholder="Password" required/>{register&&<select className="input"><option>Customer</option><option>Service Provider</option></select>}<button className="btn-primary w-full">{register?"Create Account":"Login"}</button></form><p className="mt-6 text-center text-sm text-slate-500">{register?"Already have an account? ":"Don't have an account? "}<Link className="font-semibold text-indigo-600" to={register?"/login":"/register"}>{register?"Login":"Sign Up"}</Link></p></div></div></div></div>;
}

function DashboardLayout({children,role="customer"}) {
  const [mobile,setMobile]=useState(false);
  const customerItems=[["/customer",LayoutDashboard,"Dashboard"],["/customer/bookings",CalendarDays,"My Bookings"],["/services",Sparkles,"Services"],["#",MessageCircle,"Messages"],["#",MapPinned,"My Address"],["#",Wallet,"My Wallet"],["#",Bell,"Notifications"],["#",Settings,"Settings"]];
  const providerItems=[["/provider",LayoutDashboard,"Dashboard"],["/provider/jobs",BriefcaseBusiness,"Jobs"],["#",CalendarDays,"Calendar"],["#",IndianRupee,"Earnings"],["#",Users,"Customers"],["#",MessageCircle,"Messages"],["#",Star,"Reviews"],["#",Settings,"Settings"]];
  const items=role==="provider"?providerItems:customerItems;
  return <div className="min-h-screen bg-slate-50"><header className="sticky top-0 z-40 border-b bg-white"><div className="flex h-[72px] items-center justify-between px-5 lg:px-8"><div className="flex items-center gap-4"><button className="rounded-lg p-2 lg:hidden" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button><Logo/></div><div className="flex items-center gap-4"><button className="relative rounded-xl p-2 text-slate-500"><Bell size={20}/><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"/></button><img src="/assets/provider-ravi.jpg" className="h-9 w-9 rounded-full object-cover"/></div></div></header><div className="flex"><aside className={`fixed inset-y-[72px] left-0 z-30 w-64 border-r bg-white p-4 transition lg:sticky lg:top-[72px] lg:block lg:h-[calc(100vh-72px)] ${mobile?"block":"hidden"}`}><div className="space-y-1">{items.map(([to,I,label])=><NavLink key={label} to={to} className={({isActive})=>`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive?"bg-indigo-50 text-indigo-600":"text-slate-600 hover:bg-slate-50"}`}><I size={18}/>{label}</NavLink>)}</div><div className="absolute bottom-6 left-4 right-4"><button onClick={()=>{localStorage.removeItem("servicehub_user");location.href="/";}} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"><LogOut size={18}/>Logout</button></div></aside><main className="dashboard-shell w-full">{children}</main></div></div>;
}

function CustomerDashboard(){
  const [userName,setUserName]=useState("Navya");
  const [greeting,setGreeting]=useState("Good Morning");
  React.useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("servicehub_user") || "{}");
    setUserName(!user.name || user.name === "Yeshwanth" ? "Navya" : user.name);
    const updateGreeting=()=>{
      const hour=new Date().getHours();
      setGreeting(hour >= 5 && hour < 12 ? "Good Morning" : hour >= 12 && hour < 17 ? "Good Afternoon" : "Good Evening");
    };
    updateGreeting();
    const timer=setInterval(updateGreeting,60000);
    return ()=>clearInterval(timer);
  },[]);
  return <DashboardLayout><div className="container-x py-8 mobile-bottom-space"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><p className="text-sm text-slate-500">{greeting}! 👋</p><h1 className="mt-1 text-3xl font-bold">Hi, {userName}</h1></div><div className="card bg-indigo-600 p-5 text-white md:w-64"><p className="text-xs text-indigo-100">Wallet Balance</p><p className="mt-2 text-2xl font-bold">₹1,250.00</p><button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-semibold text-indigo-600">Add Money</button></div></div><div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]"><div><div className="relative"><Search className="absolute left-4 top-3.5 text-slate-400" size={18}/><input className="input pl-11" placeholder="Search for a service..."/></div><div className="mt-5 rounded-2xl bg-indigo-100 p-7"><p className="text-sm font-semibold text-indigo-600">Special Offer</p><h2 className="mt-2 text-2xl font-bold">Get 20% OFF<br/>On Your First Booking</h2><button className="btn-primary mt-5">Use Code: WELCOME20</button></div><h2 className="mt-8 text-xl font-bold">Popular Services</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{services.map(s=><Link to={`/services/${s.id}`} className="card p-4 text-center" key={s.id}><span className="service-icon mx-auto"><Sparkles size={18}/></span><p className="mt-3 text-xs font-semibold">{s.category}</p></Link>)}</div><h2 className="mt-8 text-xl font-bold">Upcoming Booking</h2><div className="card mt-4 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><img src="/assets/provider-ravi.jpg" className="h-12 w-12 rounded-full object-cover"/><div><b>Electrician</b><p className="text-xs text-slate-500">Today, 10:00 AM • #SH125456</p></div></div><div className="flex gap-2"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">Confirmed</span><button className="btn-secondary px-4 py-2">Track</button></div></div></div><div><h2 className="text-xl font-bold">Recent Bookings</h2><div className="mt-4 space-y-3">{bookings.map(b=><div className="card p-4" key={b.id}><div className="flex justify-between"><div><b className="text-sm">{b.service}</b><p className="mt-1 text-xs text-slate-500">{b.date} • {b.time}</p></div><span className={`text-xs font-semibold ${b.status==="Cancelled"?"text-red-500":"text-emerald-600"}`}>{b.status}</span></div></div>)}</div></div></div></div></DashboardLayout>}

function BookingsPage(){return <DashboardLayout><div className="container-x py-8 mobile-bottom-space"><h1 className="text-3xl font-bold">My Bookings</h1><p className="mt-2 text-sm text-slate-500">Track and manage your service bookings.</p><div className="mt-7 space-y-4">{bookings.map(b=><div className="card p-5" key={b.id}><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex items-center gap-4"><div className="service-icon"><Wrench/></div><div><h3 className="font-bold">{b.service}</h3><p className="text-sm text-slate-500">{b.provider} • {b.date} • {b.time}</p><p className="mt-1 text-xs text-slate-400">Booking ID: {b.id}</p></div></div><div className="flex items-center gap-4"><b>₹{b.amount}</b><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold">{b.status}</span><ChevronRight className="text-slate-400"/></div></div></div>)}</div></div></DashboardLayout>}

function BookingPage({id}) {
  const s=services.find(x=>x.id===Number(id))||services[0]; const nav=useNavigate(); const [date,setDate]=useState(""); const [time,setTime]=useState("10:00 AM");
  const confirm=()=>{const old=JSON.parse(localStorage.getItem("servicehub_bookings")||"[]");old.push({id:"SH"+Date.now(),service:s.name,provider:"Ravi Kumar",date:date||"Today",time,amount:s.price+20,status:"Confirmed"});localStorage.setItem("servicehub_bookings",JSON.stringify(old));nav("/customer/bookings");};
  return <><Navbar/><main className="container-x py-10"><div className="grid gap-8 lg:grid-cols-[1fr_380px]"><div className="card p-7"><p className="text-sm font-semibold text-indigo-600">Booking</p><h1 className="mt-2 text-3xl font-bold">{s.name}</h1><div className="mt-7 space-y-6"><div><label className="mb-2 block text-sm font-semibold">Select date</label><input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)}/></div><div><label className="mb-2 block text-sm font-semibold">Select time</label><select className="input" value={time} onChange={e=>setTime(e.target.value)}>{["09:00 AM","10:00 AM","11:30 AM","02:00 PM","04:00 PM","06:00 PM"].map(x=><option key={x}>{x}</option>)}</select></div><div><label className="mb-2 block text-sm font-semibold">Service address</label><textarea className="input min-h-28" placeholder="Enter your full address"/></div></div></div><div className="card h-fit p-7"><div className="flex gap-4"><img src={s.image} className="h-20 w-20 rounded-xl object-cover"/><div><h2 className="font-bold">{s.name}</h2><p className="text-sm text-slate-500">Verified professional</p><p className="mt-1 text-sm">★ {s.rating}</p></div></div><div className="mt-7 space-y-3 border-t pt-5 text-sm"><div className="flex justify-between"><span>Service charge</span><b>₹{s.price}</b></div><div className="flex justify-between"><span>Platform fee</span><b>₹20</b></div><div className="flex justify-between border-t pt-3 text-lg"><span>Total</span><b>₹{s.price+20}</b></div></div><button onClick={confirm} className="btn-primary mt-6 w-full">Confirm Booking</button></div></div></main><Footer/></>;
}

function ProviderDashboard(){return <DashboardLayout role="provider"><div className="container-x py-8 mobile-bottom-space"><p className="text-sm text-slate-500">Good Morning, Ravi 👋</p><h1 className="mt-1 text-3xl font-bold">Provider Dashboard</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Today's Jobs","3",BriefcaseBusiness],["Pending Requests","5",Clock3],["Total Earnings","₹18,500",IndianRupee],["Rating","4.9 ★",Star]].map(([a,b,I])=><div className="card p-5" key={a}><I className="text-indigo-600"/><p className="mt-4 text-sm text-slate-500">{a}</p><p className="mt-1 text-2xl font-bold">{b}</p></div>)}</div><div className="mt-7 grid gap-5 lg:grid-cols-[1fr_330px]"><div className="card p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Today's Schedule</h2><button className="text-sm font-semibold text-indigo-600">View all</button></div><div className="mt-5 space-y-3">{bookings.slice(0,3).map((b,i)=><div className="rounded-xl border p-4" key={i}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><b>{b.time} • {b.service}</b><p className="mt-1 text-sm text-slate-500">Customer: Yeshwanth • ₹{b.amount}</p></div><div className="flex gap-2"><button className="btn-secondary px-4 py-2">Reject</button><button className="btn-primary px-4 py-2">Accept</button></div></div></div>)}</div></div><div className="card p-6"><h2 className="text-xl font-bold">This Month</h2><p className="mt-7 text-4xl font-bold">₹42,800</p><p className="mt-2 flex items-center gap-1 text-sm font-semibold text-emerald-600"><TrendingUp size={16}/>12.8% vs last month</p><div className="mt-8 h-28 rounded-xl bg-indigo-50 p-3"><div className="flex h-full items-end gap-2">{[35,55,40,70,60,85,75,95].map((h,i)=><div key={i} className="flex-1 rounded-t bg-indigo-500" style={{height:`${h}%`}}/>)}</div></div></div></div></div></DashboardLayout>}

function AdminDashboard(){return <DashboardLayout role="provider"><div className="container-x py-8 mobile-bottom-space"><p className="text-sm text-slate-500">Administration</p><h1 className="mt-1 text-3xl font-bold">Admin Dashboard</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Total Users","12,450",Users],["Providers","1,230",BriefcaseBusiness],["Bookings","8,430",CalendarDays],["Revenue","₹24.5L",IndianRupee]].map(([a,b,I])=><div className="card p-5" key={a}><I className="text-indigo-600"/><p className="mt-4 text-sm text-slate-500">{a}</p><p className="mt-1 text-2xl font-bold">{b}</p></div>)}</div><div className="mt-7 grid gap-5 lg:grid-cols-[1fr_360px]"><div className="card p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Revenue Overview</h2><button className="btn-secondary px-3 py-2">Last 30 days <ChevronDown className="ml-2" size={15}/></button></div><div className="mt-8 flex h-64 items-end gap-3 border-b border-l p-4">{[30,44,38,62,48,72,58,80,70,92,78,96].map((h,i)=><div key={i} className="flex-1 rounded-t-lg bg-indigo-500" style={{height:`${h}%`}}/>)}</div></div><div className="card p-6"><h2 className="text-xl font-bold">Recent Bookings</h2><div className="mt-5 space-y-4">{bookings.map(b=><div key={b.id} className="flex justify-between border-b pb-4 text-sm"><div><b>{b.service}</b><p className="text-xs text-slate-500">{b.provider}</p></div><span className="font-semibold">₹{b.amount}</span></div>)}</div></div></div></div></DashboardLayout>}

export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/services" element={<ServicesPage/>}/>
    <Route path="/how-it-works" element={<HowItWorks/>}/>
    <Route path="/become-provider" element={<BecomeProvider/>}/>
    <Route path="/about" element={<AboutUs/>}/>
    <Route path="/services/:id" element={<ServiceDetails id={location.pathname.split("/").pop()}/>}/>
    <Route path="/booking/:id" element={<BookingPage id={location.pathname.split("/").pop()}/>}/>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/register" element={<Auth register/>}/>
    <Route path="/customer" element={<CustomerDashboard/>}/>
    <Route path="/customer/bookings" element={<BookingsPage/>}/>
    <Route path="/provider" element={<ProviderDashboard/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="*" element={<Home/>}/>
  </Routes>
}