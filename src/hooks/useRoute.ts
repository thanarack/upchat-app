import { useLocation, useNavigate } from 'react-router-dom';

const useRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return { navigate, location };
};

export default useRoute;
