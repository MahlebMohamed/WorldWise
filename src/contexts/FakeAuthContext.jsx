import { createContext, useContext, useReducer } from "react";


const AuthContext = createContext();

const initiaState = {
    user: null,
    isAutenticated: false,
}

function reducer(state, action) {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                user: action.paylod,
                isAutenticated: true
            }

        case 'logout':
            return {
                ...state,
                user: null,
                isAutenticated: false
            }

        default:
            throw new Error('Unknown action')
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
    const [{ user, isAutenticated }, dispatch] = useReducer(reducer, initiaState);

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
            dispatch({ type: 'login', paylod: FAKE_USER });
    }

    function logout() {
        dispatch({ type: 'logout' });
    }

    return <AuthContext.Provider value={{
        user,
        isAutenticated,
        login,
        logout
    }}>
        {children}
    </AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error('AuthContext was used outside AuthProvider');

    return context;
}

export { AuthProvider, useAuth };