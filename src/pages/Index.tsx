
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect the home page to the inbox list
  return <Navigate to="/lists/inbox" replace />;
};

export default Index;
