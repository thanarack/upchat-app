import { useEffect } from 'react';
import useRoute from '../../../hooks/useRoute';

const SettingGeneral = () => {
  const { navigate } = useRoute();

  useEffect(() => {
    navigate('/settings/rooms');
  }, []);

  return <div />;
};

export default SettingGeneral;
