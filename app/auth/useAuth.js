import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";
// import userinfoApi from "../api/userinfo";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = async (authToken, email) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
    // Stores the JWT token sent from the backend in AuthStorage from expo
    // This allows us to restore user everytime the app is closed and reloaded
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, logIn, logOut };
};
