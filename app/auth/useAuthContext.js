import AuthContext from "../auth/context";
const useAuthContext = () => {
 const user = useContext(AuthContext);
 if (user === undefined) {
 throw new Error("useAuthContext can only be used inside AuthProvider");
 }
 return user;
};
export default useAuthContext;