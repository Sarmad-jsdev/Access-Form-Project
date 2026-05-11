import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import getDashboardRoute from "../utils/DashboardRoute";

const PublicRoute = ({ children }) => {

   const { user, loading } = useContext(AuthContext);

   if(loading) return null;

   // ✅ If logged in → redirect to respective dashboard
   if(user){

      return (
         <Navigate
            to={getDashboardRoute(user.role)}
            replace
         />
      );
   }

   // ⛔ If not logged in → allow access
   return children;
};

export default PublicRoute;
