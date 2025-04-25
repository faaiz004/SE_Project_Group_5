import { Navigate } from 'react-router-dom';

const PreferenceGuardRoute = ({ children }) => {
  const token = localStorage.getItem('jwt');
  const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';

  if (!token) return <Navigate to="/login" />;

  if (!preferencesCompleted) {
    return <Navigate to="/preferences/gender" />;
  }

  return children;
};

export default PreferenceGuardRoute;
