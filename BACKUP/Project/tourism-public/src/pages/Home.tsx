import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 1,
      title: "رزرو تور",
      description: "تورهای داخلی و خارجی با بهترین قیمت و کیفیت",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "رزرو هتل",
      description: "هتل‌های لوکس و اقتصادی در سراسر ایران و جهان",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "بلیط",
      description: "پرواز، قطار و اتوبوس با تضمین بهترین قیمت",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "خدمات سفر",
      description: "ویزا، بیمه و راهنمای سفر حرفه‌ای",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
        </svg>
      ),
      color: "from-orange-500 to-orange-600"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('جستجو برای:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* هیرو سکشن */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
                   یه سفر بدون نگرانی ...
          </h1>
          <p className="text-xl mb-8 opacity-90">
  
              </p>
          
          {/* جستجو */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-lg">
            <div className="flex flex-col md:flex-row gap-2">
              <input 
                type="text" 
                placeholder="دنبال چی میگردی ؟"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-3 text-gray-800 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="جستجو برای خدمات سفر"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                aria-label="جستجو"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* خدمات */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            خدمات ویژه ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map(service => (
              <div 
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-center leading-relaxed">
                    {service.description}
                  </p>
                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;