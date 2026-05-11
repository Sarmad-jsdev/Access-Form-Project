const getDashboardRoute = (role) => {

   switch(role){

      case "admin":
         return "/AdminDashboard";

      case "creator":
         return "/CreatorDashboard";

      case "respondent":
         return "/Respondent";

        default:
        return "/";
   }
};

export default getDashboardRoute;
