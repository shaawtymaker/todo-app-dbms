
import { Navigate } from 'react-router-dom';

export default function Index() {
  // Redirect to dashboard
  return <Navigate to="/" replace />;
}
