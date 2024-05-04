const useFetch = () => {
  const fetchData = async callback => {
    const callResponse = {
      isLoading: true,
      status: null,
      data: null,
      error: null,
    };
    try {
      const response = await callback();
      callResponse.data = response.data;
      callResponse.status = response.status;
      callResponse.error = null;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      callResponse.data = null;
      callResponse.status = error.response?.status;
      callResponse.error = message;
    } finally {
      callResponse.isLoading = false;
      return callResponse;
    }
  };

  return { fetchData };
};

export default useFetch;
