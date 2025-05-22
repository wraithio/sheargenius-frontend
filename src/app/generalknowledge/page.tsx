"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";

export default function GeneralKnowledge() {
  const [searchActive, setSearchActive] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const footerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const sectionIds = [
    'clipper-crash-course',
    'barber-essentials',
    'barber-shop-etiquette',
    'proper-hygiene',
    'hair-growth-essentials',
    'why-mens-hair',
    'credits'
  ];
  
  useEffect(() => {
    sectionIds.forEach(id => {
      sectionRefs.current[id] = document.getElementById(id);
    });
    
    const observerOptions = {
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.values(sectionRefs.current).forEach(section => {
      if (section) observer.observe(section);
    });
    
    if (sidebarRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        @media (min-width: 1024px) {
          .sidebar-sticky {
            position: sticky;
            top: 6rem;
            height: calc(100vh - 6rem);
            overflow-y: auto;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      Object.values(sectionRefs.current).forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || !sidebarRef.current) return;
      
      const footerRect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (footerRect.top < viewportHeight) {
        const distanceFromBottomOfViewport = viewportHeight - footerRect.top;
        sidebarRef.current.style.maxHeight = `calc(100vh - 96px - ${distanceFromBottomOfViewport}px)`;
      } else {
        sidebarRef.current.style.maxHeight = 'calc(100vh - 96px)'; // 24px top offset + 72px for margins
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        setTimeout(() => {
          const navbarOffset = 100;
          
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 300);
      }
    }
    
    const sectionToScrollTo = localStorage.getItem('scrollToSection');
    if (sectionToScrollTo) {
      const targetElement = document.getElementById(sectionToScrollTo);
      if (targetElement) {
        setTimeout(() => {
          const navbarOffset = 100;
          
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          localStorage.removeItem('scrollToSection');
        }, 300);
      }
    }
  }, []);
  
  const SidebarLink = ({ href, title }: { href: string, title: string }) => {
    const id = href.replace('#', '');
    const isActive = activeSection === id;
    
    return (
      <a 
        href={href}
        className={`block py-2 px-3 rounded-md transition-colors duration-200 ${
          isActive 
            ? 'bg-black text-white font-[NeueMontreal-Medium]' 
            : 'hover:bg-gray-100 text-gray-700 hover:text-black'
        }`}
      >
        {title}
      </a>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar setSearchActive={setSearchActive} />
      
      <div className="w-full bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-[NeueMontreal-Medium] text-4xl sm:text-5xl md:text-6xl mb-4">
            General Knowledge
          </h1>
          <p className="font-[NeueMontreal-Regular] text-gray-300 text-lg sm:text-xl max-w-3xl">
            Expert insights and essential information to enhance your grooming knowledge and experience.
          </p>
        </div>
      </div>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div 
              ref={sidebarRef}
              className="sidebar-sticky"
            >
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="font-[NeueMontreal-Medium] text-lg mb-4 px-3">Quick Links</h3>
                <nav className="space-y-1">
                  <SidebarLink href="#clipper-crash-course" title="Clippers Crash Course" />
                  <SidebarLink href="#barber-essentials" title="Barber Essentials" />
                  <SidebarLink href="#barber-shop-etiquette" title="Barber Shop Etiquette" />
                  <SidebarLink href="#proper-hygiene" title="Proper Hygiene" />
                  <SidebarLink href="#hair-growth-essentials" title="Hair Growth Essentials" />
                  <SidebarLink href="#why-mens-hair" title="Why Men's Hair?" />
                  <SidebarLink href="#credits" title="Credits & Contact" />
                </nav>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <section id="clipper-crash-course" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/barber_utensils_wide.webp"
                  alt="Barber equipment"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Clippers Crash Course
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    What do the numbers mean, Mason?
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  Hair clipper numbers refer to the guard sizes attached to
                  the clipper, which determine how much hair is left after
                  cutting. These numbers usually range from 0 to 8, with lower
                  numbers (like #0 or #1) cutting hair very short, close to
                  the scalp, and higher numbers (like #7 or #8) leaving longer
                  lengths. For instance, a #1 guard typically leaves hair
                  about 1/8 inch long, while a #8 guard leaves around an inch.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  It is important to note that different brands may have
                  slight variations, so consulting the guide provided with the
                  clippers is a good idea. Other essentials include
                  maintaining sharp blades, using clipper oil to reduce
                  friction, and cleaning the clippers regularly to ensure
                  precise cuts. Whether you are aiming for a fade, a buzz cut,
                  or just a quick trim, mastering the clipper settings is key
                  to achieving the desired style!
                </p>
              </div>
            </section>
            
            <section id="barber-essentials" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/clippers.jpg"
                  alt="Clippers and barber tools"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Barber Essentials
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    Be the sharpest tool in the shed.
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  Industry-standard barber supplies include high-quality
                  clippers and trimmers from brands like Wahl, Andis, and
                  BabylissPro, which are essential for precision cutting and
                  styling. Other must-haves are professional-grade shears,
                  combs, razors, and shaving brushes, along with sanitizing
                  solutions like Barbicide to maintain hygiene.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  Comfortable and adjustable barber chairs, along with handheld and
                  wall-mounted mirrors, are also key for creating a
                  professional setup. For purchasing these supplies, you can
                  explore <a href="https://modernbarbersupply.com/" target="_blank" className="text-blue-600 hover:text-blue-800 no-underline hover:underline">
                    Modern Barber Supply
                  </a> or <a href="https://www.barberdepots.com/" target="_blank" className="text-blue-600 hover:text-blue-800 no-underline hover:underline">
                    Barber Depot
                  </a>, which offer a wide range of trusted products for barbers.
                </p>
              </div>
            </section>
            
            <section id="barber-shop-etiquette" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/barbershop.jpg"
                  alt="Barbershop interior"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Barber Shop Etiquette
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    Come in informed and prepared.
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  Proper barbershop etiquette involves arriving on time for
                  your appointment or being prepared to wait if you are a
                  walk-in. Communicate clearly with your barber about the
                  style you want, using reference pictures if possible, and
                  trust their expertise for recommendations.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  Make sure your hair is clean before your visit, as it makes the process
                  smoother. Be courteous by not using your phone excessively,
                  respecting the barber's time, and tipping
                  appropriately—usually 15-20% of the service cost. If you are
                  unsure about barber policy or pricing, it is perfectly fine
                  to ask in advance. Barbershops are also social hubs, so do
                  not hesitate to join in on light conversation while keeping
                  the atmosphere pleasant and respectful!
                </p>
              </div>
            </section>
            
            <section id="proper-hygiene" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/shower.jpg"
                  alt="Shower and hygiene products"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Proper Hygiene
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    Clean Head = Clean Cut
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  Before heading to the barbershop, practicing proper hygiene
                  is not just courteous—it makes the haircutting process
                  easier and more enjoyable for both you and your barber.
                  Start by washing your hair thoroughly to remove any dirt,
                  oil, or product buildup, as clean hair is simpler to cut and
                  style.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  If you're sweating or coming from a workout, a
                  quick shower helps ensure you're fresh and comfortable.
                  Pay attention to your scalp health, too—if you have dandruff
                  or irritation, addressing it beforehand can improve your
                  overall experience. Additionally, trim excessive facial hair
                  or clean your neckline if you expect these areas to be
                  groomed. Arriving clean and prepared shows respect for your
                  barber's time and equipment, maintaining a professional
                  and pleasant environment for everyone.
                </p>
              </div>
            </section>
            
            <section id="hair-growth-essentials" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/oil.jpg"
                  alt="Hair oil and growth products"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Hair Growth Essentials
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    Promote healthy habits.
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  Promoting hair growth in men involves a combination of
                  healthy habits, proper scalp care, and effective products.
                  Eating a balanced diet rich in vitamins like biotin, Vitamin
                  D, and zinc can help strengthen hair from within. Staying
                  hydrated and reducing stress through regular exercise or
                  relaxation techniques can also support hair health.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  Gentle scalp massages with oils like castor or rosemary oil are
                  believed to stimulate blood circulation and improve follicle
                  health. Products such as sulfate-free shampoos, conditioners
                  with keratin, and leave-in treatments with ingredients like
                  minoxidil are effective for boosting growth and thickening
                  hair. Avoiding harsh styling tools, excessive heat, and
                  tight hairstyles is crucial to prevent damage. Consistency
                  is key—adopting these habits regularly can significantly
                  enhance hair growth over time.
                </p>
              </div>
            </section>
            
            <section id="why-mens-hair" className="mb-20 scroll-mt-24">
              <div className="group relative overflow-hidden rounded-2xl mb-8 transition-all duration-300 hover:shadow-xl">
                <Image
                  src="/comb.jpg"
                  alt="Barber combs and tools"
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <h2 className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl">
                    Why Men's Hair?
                  </h2>
                  <p className="font-[NeueMontreal-Regular] text-gray-300 mt-2">
                    Why we do what we do.
                  </p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700">
                  The team behind this website is deeply passionate about
                  exploring diverse styles of men&apos;s haircuts and
                  celebrating the rich traditions of barbershop culture. We
                  believe that hairstyling is more than just grooming—it&apos;s
                  an art form and a way to express individuality.
                </p>
                <p className="text-base sm:text-lg font-[NeueMontreal-Regular] text-gray-700 mt-4">
                  The team feels it&apos;s essential to educate men of all ages, as well
                  as parents with their children, on how to choose and
                  maintain hairstyles that suit their personalities,
                  lifestyles, and preferences. By providing valuable insights,
                  tips, and inspiration, ShearGenius aims to empower their
                  audience to approach men&apos;s hair styling with confidence
                  and creativity, fostering a greater appreciation for the
                  craftsmanship behind every great cut.
                </p>
              </div>
            </section>
            
            <section id="credits" className="mb-10 scroll-mt-24">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 sm:p-10">
                <h2 className="font-[NeueMontreal-Medium] text-3xl sm:text-4xl mb-6">
                  Credits & Contact
                </h2>
                
                <p className="text-lg mb-8 text-gray-700">
                  The team behind ShearGenius:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="font-[NeueMontreal-Medium] text-xl mb-3">Aaron Robinson</h3>
                    <div className="flex gap-4">
                      <a href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                      <a href="#" className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.5v15c0 2.484-2.016 4.5-4.5 4.5h-15c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15c2.484 0 4.5 2.016 4.5 4.5zm-4.5 0l-7.5 5.25-7.5-5.25h15zm0 15v-9.375l-7.5 5.25-7.5-5.25v9.375h15z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="font-[NeueMontreal-Medium] text-xl mb-3">Darryl Patton</h3>
                    <div className="flex gap-4">
                      <a href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                      <a href="#" className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.5v15c0 2.484-2.016 4.5-4.5 4.5h-15c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15c2.484 0 4.5 2.016 4.5 4.5zm-4.5 0l-7.5 5.25-7.5-5.25h15zm0 15v-9.375l-7.5 5.25-7.5-5.25v9.375h15z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <h3 className="font-[NeueMontreal-Medium] text-xl mb-3">Hassan Sajid</h3>
                    <div className="flex gap-4">
                      <a href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                      <a href="#" className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.5v15c0 2.484-2.016 4.5-4.5 4.5h-15c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15c2.484 0 4.5 2.016 4.5 4.5zm-4.5 0l-7.5 5.25-7.5-5.25h15zm0 15v-9.375l-7.5 5.25-7.5-5.25v9.375h15z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}

