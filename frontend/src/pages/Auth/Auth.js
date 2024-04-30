import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { TEST_CONFIG } from '../../config';
import useFetch from '../../hooks/useFetch';

const Auth = () => {
  const { fetchData } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogIn } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Auth</div>
      <button
        onClick={async () => {
          setIsLoading(true);
          const result = await fetchData(() =>
            handleLogIn(TEST_CONFIG.TEST_EMAIL, TEST_CONFIG.TEST_PASSWORD),
          );
          setIsLoading(result.isLoading);
        }}
      >
        login
      </button>
    </>
  );
};

export default Auth;
