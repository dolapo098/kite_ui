import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CustomRouter, routes } from './routes';
import { authenticationService } from './services';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authenticationService.currentUserValue !== null,
  );

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
      />
    </BrowserRouter>
  );
}

export default App;
