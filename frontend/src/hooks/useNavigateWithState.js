import { useNavigate } from 'react-router-dom';

export const useNavigateWithState = () => {
  const navigate = useNavigate();

  const navigateWithState = (path, stateFrom) => {
    navigate(path, { state: { from: stateFrom } });
  };

  return navigateWithState;
};

export default useNavigateWithState;
