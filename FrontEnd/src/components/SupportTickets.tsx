import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// انواع داده‌ها - موقت تا API وصل بشه
interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'technical' | 'payment' | 'reservation' | 'general' | 'suggestion';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  sentAt: string;
  read: boolean;
}

const SupportTickets: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // داده‌های نمونه - موقت
  const sampleTickets: SupportTicket[] = useMemo(() => [
    {
      id: '1',
      subject: 'مشکل در پرداخت آنلاین',
      description: 'هنگام پرداخت آنلاین با خطا مواجه می‌شوم',
      category: 'payment',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      messages: [
        {
          id: '1-1',
          content: 'سلام، هنگام پرداخت آنلاین با خطای "تراکنش ناموفق" مواجه می‌شوم.',
          sender: 'user',
          sentAt: '2024-01-15T10:30:00Z',
          read: true
        },
        {
          id: '1-2',
          content: 'سلام، لطفاً شماره کارت و بانک مورد استفاده را اعلام کنید.',
          sender: 'support',
          sentAt: '2024-01-15T11:15:00Z',
          read: true
        }
      ]
    },
    {
      id: '2',
      subject: 'سوال درباره تور استانبول',
      description: 'نیاز به اطلاعات بیشتر درباره هتل‌های تور استانبول دارم',
      category: 'reservation',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-12T09:45:00Z',
      messages: [
        {
          id: '2-1',
          content: 'سلام، می‌خواستم درباره امکانات هتل‌های تور استانبول اطلاعات بیشتری داشته باشم.',
          sender: 'user',
          sentAt: '2024-01-10T14:20:00Z',
          read: true
        },
        {
          id: '2-2',
          content: 'سلام، اطلاعات کامل هتل‌ها در صفحه تور موجود است. برای جزئیات بیشتر می‌توانید با پشتیبانی تماس بگیرید.',
          sender: 'support',
          sentAt: '2024-01-11T16:30:00Z',
          read: true
        }
      ]
    }
  ], []);

  // وضعیت‌های تیکت به فارسی
  const statusConfig = {
    open: { label: 'باز', color: 'bg-yellow-500' },
    in_progress: { label: 'در حال بررسی', color: 'bg-blue-500' },
    resolved: { label: 'حل شده', color: 'bg-green-500' },
    closed: { label: 'بسته', color: 'bg-gray-500' }
  };

  // اولویت‌ها به فارسی
  const priorityConfig = {
    low: { label: 'کم', color: 'bg-gray-400' },
    medium: { label: 'متوسط', color: 'bg-yellow-500' },
    high: { label: 'بالا', color: 'bg-orange-500' },
    urgent: { label: 'فوری', color: 'bg-red-500' }
  };

  // دسته‌بندی‌ها به فارسی
  const categoryConfig = {
    technical: 'فنی',
    payment: 'پرداخت',
    reservation: 'رزرو',
    general: 'عمومی',
    suggestion: 'پیشنهاد'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    // TODO: ارسال به API
    console.log('ارسال پاسخ:', newMessage);
    setNewMessage('');
    alert('پاسخ شما ارسال شد');
  };

  // نمایش لیست تیکت‌ها
  const TicketList: React.FC = () => (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        تیکت‌های شما ({sampleTickets.length})
      </h3>

      {sampleTickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => setSelectedTicket(ticket)}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-white hover:bg-gray-50 border border-gray-200'
          } ${
            selectedTicket?.id === ticket.id 
              ? 'ring-2 ring-blue-500' 
              : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className={`font-semibold transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {ticket.subject}
            </h4>
            <div className="flex space-x-2 space-x-reverse">
              <span className={`px-2 py-1 rounded text-xs text-white ${
                priorityConfig[ticket.priority].color
              }`}>
                {priorityConfig[ticket.priority].label}
              </span>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                statusConfig[ticket.status].color
              }`}>
                {statusConfig[ticket.status].label}
              </span>
            </div>
          </div>

          <p className={`text-sm mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {ticket.description}
          </p>

          <div className="flex justify-between items-center text-xs">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {categoryConfig[ticket.category]}
            </span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // نمایش جزئیات تیکت و مکالمات
  const TicketDetail: React.FC = () => {
    if (!selectedTicket) return null;

    return (
      <div className={`rounded-lg transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* هدر تیکت */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {selectedTicket.subject}
              </h3>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {selectedTicket.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedTicket(null)}
              className={`p-2 rounded transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* مکالمات */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {selectedTicket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                    message.sender === 'user'
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800'
                      : theme === 'dark'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user'
                      ? theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(message.sentAt).toLocaleString('fa-IR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* فرم ارسال پاسخ (فقط برای تیکت‌های باز) */}
        {selectedTicket.status === 'open' && (
          <div className="p-4 border-t border-gray-600">
            <form onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="پاسخ خود را وارد کنید..."
                className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                }`}
                rows={3}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ارسال پاسخ
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* لیست تیکت‌ها */}
        <div>
          <TicketList />
        </div>

        {/* جزئیات تیکت انتخاب شده */}
        <div>
          {selectedTicket ? (
            <TicketDetail />
          ) : (
            <div className={`text-center py-12 rounded-lg transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">{t('support.tickets.noTicketSelected')}</h3>
<p>{t('support.tickets.noTicketSelectedMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;