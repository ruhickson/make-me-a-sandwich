import React, { useEffect } from 'react';
import './App.css';
import MainApp from './components/MainApp';
import notificationService from './utils/notificationService';

function App() {
  useEffect(() => {
    // Register service worker and request notification permissions
    const initializeNotifications = async () => {
      try {
        await notificationService.registerServiceWorker();
        const hasPermission = await notificationService.requestPermission();
        
        if (hasPermission) {
          console.log('Notification permissions granted');
          // You can now schedule meal reminders
          // notificationService.scheduleMealReminder('08:00', 'Time for breakfast!');
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <div className="App">
      <MainApp userProfile={null} onLogout={() => {}} />
    </div>
  );
}

export default App; 