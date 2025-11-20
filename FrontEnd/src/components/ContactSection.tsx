import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface ContactChannel {
  type: 'phone' | 'email' | 'telegram' | 'whatsapp' | 'instagram';
  label: string;
  value: string;
  icon: string;
}

const ContactSection: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  // اطلاعات تماس و شبکه‌های اجتماعی با استفاده از ترجمه
  const contactChannels = useMemo((): ContactChannel[] => [
    {
      type: 'phone',
      label: t('support.contact.channelsList.phone.label'),
      value: t('support.contact.channelsList.phone.value'),
      icon: '📞'
    },
    {
      type: 'email',
      label: t('support.contact.channelsList.email.label'),
      value: t('support.contact.channelsList.email.value'),
      icon: '📧'
    },
    {
      type: 'telegram',
      label: t('support.contact.channelsList.telegram.label'),
      value: t('support.contact.channelsList.telegram.value'),
      icon: '✈️'
    },
    {
      type: 'whatsapp',
      label: t('support.contact.channelsList.whatsapp.label'),
      value: t('support.contact.channelsList.whatsapp.value'),
      icon: '💬'
    },
    {
      type: 'instagram',
      label: t('support.contact.channelsList.instagram.label'),
      value: t('support.contact.channelsList.instagram.value'),
      icon: '📷'
    }
  ], [t]);

  // هندلر کلیک بر روی هر کانال تماس
  const handleContactClick = (channel: ContactChannel) => {
    switch (channel.type) {
      case 'phone':
        window.open(`tel:${channel.value}`, '_self');
        break;
      case 'email':
        window.open(`mailto:${channel.value}`, '_self');
        break;
      case 'telegram':
      case 'whatsapp':
      case 'instagram':
        window.open(channel.value, '_blank', 'noopener,noreferrer');
        break;
    }
  };

  // هندلر ارسال فرم گزارش سریع
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      alert(t('support.contact.validation.minLength'));
      return;
    }
    // TODO: ارسال به API
    alert(t('support.contact.quickReport.success'));
    setMessage('');
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* اطلاعات تماس */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {t('support.contact.channels')}
          </h2>
          
          <div className="space-y-3">
            {contactChannels.map((channel) => (
              <button
                key={channel.type}
                onClick={() => handleContactClick(channel)}
                className={`w-full text-right p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl ml-3" aria-hidden="true">
                      {channel.icon}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">{channel.label}</div>
                      <div className={`text-sm mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {channel.value}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* اطلاعات شرکت */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {t('support.contact.companyInfo')}
          </h2>
          
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="space-y-3">
              <div>
                <strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('support.contact.companyAddress')}:
                </strong>
                <p className={`mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('support.contact.companyAddressValue')}
                </p>
              </div>
              
              <div>
                <strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('support.contact.workingHours')}:
                </strong>
                <p className={`mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('support.contact.workingHoursValue')}
                </p>
              </div>
              
              <div>
                <strong className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {t('support.contact.responseTime')}:
                </strong>
                <p className={`mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('support.contact.responseTimeValue')}
                </p>
              </div>
            </div>
          </div>

          {/* وضعیت پشتیبانی */}
          <div className={`mt-6 p-4 rounded-lg text-center transition-colors duration-300 ${
            theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
          }`}>
            <div className="text-lg font-semibold">
              {t('support.contact.supportStatus.online')}
            </div>
            <p className="text-sm mt-1">
              {t('support.contact.supportStatus.onlineMessage')}
            </p>
          </div>
        </div>

      </div>

      {/* فرم تماس سریع */}
      <div className={`mt-8 p-6 rounded-2xl transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {t('support.contact.quickReportTitle')}
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('support.contact.quickReportPlaceholder')}
            className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            }`}
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-sm transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {message.length}/500 {t('support.contact.charCount')}
            </span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={message.trim().length < 10}
            >
              {t('support.contact.quickReportSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;