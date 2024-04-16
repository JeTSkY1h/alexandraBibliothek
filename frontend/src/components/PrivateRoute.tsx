import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../hooks/UserUtils"

interface PrivateRouteProps {
    path: string;
    element: React.ReactElement;
};

const PrivateRoute: React.FC<PrivateRouteProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login', { state: { from: location } });
        }
    }, [navigate, location]);

    return null;
}

export default PrivateRoute;