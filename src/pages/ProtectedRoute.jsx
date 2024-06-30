import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/FakeAuthContext";


export default function ProtectedRoute({ children }) {
    const { isAutenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(function () {
        if (!isAutenticated)
            navigate('/');

    }, [isAutenticated, navigate]);


    // return children
    return isAutenticated ? children : null
    // lazm ndire hakda psq had le component rahi ul return children avec d'execute le useEffect 
}
