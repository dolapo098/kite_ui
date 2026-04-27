import { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CustomRouter, routes } from './routes';
import { authenticationService } from './services';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authenticationService.currentUserValue !== null,
  );
  const [sessionChecked, setSessionChecked] = useState(false);
  const hasFetchedSessionRef = useRef(false);

  useEffect(() => {
    if (!sessionChecked && !hasFetchedSessionRef.current) {
      hasFetchedSessionRef.current = true;
      authenticationService.fetchCurrentUser().finally(() => {
        setSessionChecked(true);
      });
    }
  }, [sessionChecked]);

  useEffect(() => {
    const subscription = authenticationService.currentUser.subscribe((user) => {
      setIsAuthenticated(user !== null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <CustomRouter
        routes={routes}
        isAuthenticated={isAuthenticated}
        sessionChecked={sessionChecked}
      />
    </BrowserRouter>
  );
}

export default App;
