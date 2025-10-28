import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import ContactSection from '../components/ContactSection';
import SupportTickets from '../components/SupportTickets';
import FAQSection from '../components/FAQSection';

const Support: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');

  // پیکربندی تب‌ها
  const tabConfig = useMemo(() => [
    { 
      id: 'tickets' as const, 
      label: t('support.tabs.tickets'), 
      
    },
    { 
      id: 'faq' as const, 
      label: t('support.tabs.faq'), 
       
    },
    { 
      id: 'contact' as const, 
      label: t('support.tabs.contact'), 
       
    }
  ], [t]);

  // محتوای هر تب
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tickets':
        return <SupportTickets />;
      
      case 'faq':
        return <FAQSection />;
      
      case 'contact':
        return <ContactSection />;
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      itemScope
      itemType="https://schema.org/Service"
    >
      <meta itemProp="name" content={t('support.meta.title')} />
      <meta itemProp="description" content={t('support.meta.description')} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* هدر صفحه */}
          <section className="text-center mb-8" aria-labelledby="support-title">
            <h1 
              id="support-title"
              className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
              itemProp="name"
            >
              {t('support.title')}
            </h1>
            <p className={`text-lg transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('support.subtitle')}
            </p>
          </section>

          {/* تب‌های ناوبری */}
          <nav className="mb-8" aria-label={t('support.tabs.navigation')}>
            <div className={`rounded-2xl shadow-lg p-2 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex space-x-2" role="tablist">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tab-${tab.id}`}
                    className={`flex-1 py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:scale-105'
                        : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-lg mr-2" aria-hidden="true"></span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* محتوای تب‌ها */}
          <section 
            className={`rounded-2xl shadow-lg transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            role="tabpanel"
          >
            {renderTabContent()}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;