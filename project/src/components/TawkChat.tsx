import { useRef } from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { useAuth } from '../contexts/AuthContext';

const TawkChat = () => {
  const { user } = useAuth();
  const tawkMessengerRef = useRef<any>();

  const propertyId = '687a2b351786aa1911e6cf6a';
  const widgetId = '1j0ejhiht';

  // Pass user data to Tawk.to to identify logged-in users
  const visitor = user ? {
    name: user.name,
    email: user.email,
  } : {};

  return (
    <TawkMessengerReact
      propertyId={propertyId}
      widgetId={widgetId}
      ref={tawkMessengerRef}
      visitor={visitor}
    />
  );
};

export default TawkChat;
