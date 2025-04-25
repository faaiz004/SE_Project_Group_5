import { Navigate } from 'react-router-dom';  // ← you must import this

const PrivateRoute = ({ children }) => {

    const token = localStorage.getItem('jwt');
    return token ? children : <Navigate to="/login" />;

};

export default PrivateRoute;