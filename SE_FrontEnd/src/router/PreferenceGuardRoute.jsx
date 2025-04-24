
import { Navigate } from 'react-router-dom';  // ← you must import this

const PreferenceGuardRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');
    const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';
    if (!token) return <Navigate to="/login" />;
    if (!preferencesCompleted && window.location.pathname !== '/preferences') {
      return <Navigate to="/preferences" />;
    }
    return children;
};

export default PreferenceGuardRoute;