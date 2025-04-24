import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('jwt');
  const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';

  if (token) {
    return preferencesCompleted ? <Navigate to="/explore" /> : <Navigate to="/preferences/gender" />;
  }

  return children;  
};

export default PublicRoute;
