import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import authService from './Appwrite/AuthService';
import { Home, Login, Messages, MailDetail, Projects } from './Components';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const account = await authService.getAccount();
          if (account) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuthStatus();
      
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />}>
                <Route index element={<Projects />} />
                <Route path="mails" element={<Messages />} />
                <Route path="mail/:id" element={<MailDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
