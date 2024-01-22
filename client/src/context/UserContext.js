import { createContext, useState } from "react";
import { api } from "../utils/apiHelper";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  // creates a cookie to keep authenticated user 
  const cookie = Cookies.get("authenticatedUser"); 
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  const signIn = async (credentials) => {
    // sends a get request to api to get user 
    const response = await api("/users", "GET", null, credentials); 
    if (response.status === 200) {
      const user = await response.json();
      user.password = credentials.password;
      setAuthUser(user); 
      Cookies.set("authenticatedUser", JSON.stringify(user), {expires: 1}); 
      return user; 
    } else if (response.status === 401) {
      return null; 
    } else {
      throw new Error();
    }
  }
  // signs out user function 
  const signOut = () => {
    setAuthUser(null); 
    Cookies.remove("authenticatedUser"); 
  }

  return (
    <UserContext.Provider value={{
      authUser, 
      actions: {
        signIn, 
        signOut
      }
    }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;