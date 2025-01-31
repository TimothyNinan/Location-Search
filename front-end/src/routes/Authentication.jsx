import { useContext, createContext, useState, useEffect } from "react";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    // is user already logged in with their google account?
    // react state gets reset when user refreshes the page, so
    // persist the logged in state by storing the result in localStorage
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('gomap'));

    const gomap = (k) => {
        setLoggedIn(true)
    }
  
    // allow loggedIn state and gomap function to be visible for all children
    // primary used in login & map component where loggedIn state will be changed & viewed
    return (<AuthContext.Provider value={{ loggedIn, gomap }}>
                {children}
            </AuthContext.Provider>)
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};