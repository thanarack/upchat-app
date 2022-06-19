import { useEffect } from 'react';
import useRoute from '../../hooks/useRoute';

const FeaturesHome = () => {
  const { navigate } = useRoute();

  useEffect(() => {
    navigate('/login');
  }, []);

  return <div />;
};

export default FeaturesHome;
