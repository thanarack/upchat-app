import useRoute from '../../hooks/useRoute';
import { Counter } from '../counter/Counter';

const FeaturesHome = () => {
  const { navigate } = useRoute();

  return (
    <div>
      <div onClick={() => navigate('/dashboard')} role="button">
        เข้าใช้งานแอพ
      </div>
    </div>
  );
};

export default FeaturesHome;
