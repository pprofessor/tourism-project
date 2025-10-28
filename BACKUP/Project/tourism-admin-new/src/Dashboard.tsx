import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🎯 پنل مدیریت توریسم</h1>
      <p>سیستم مدیریت هتل‌ها و کاربران</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginTop: '30px'
      }}>
        <div style={{ background: '#667eea', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>🏨 هتل‌ها</h3>
          <p>مدیریت کامل</p>
        </div>
        
        <div style={{ background: '#f093fb', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>👥 کاربران</h3>
          <p>۴ سطح دسترسی</p>
        </div>
        
        <div style={{ background: '#4facfe', color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>📊 آمار</h3>
          <p>گزارش‌گیری</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;