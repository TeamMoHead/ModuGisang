const useFetch = () => {
  const fetchData = async callback => {
    const callResponse = {
      isLoading: true,
      data: null,
      error: null,
    };

    try {
      const response = await callback();
      callResponse.data = response.data;
      callResponse.error = null;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      callResponse.data = null;
      callResponse.error = message;
    } finally {
      callResponse.isLoading = false;
      return callResponse;
    }
  };

  const fetchDataWithStatus = async callback => {
    const callResponse = {
      isLoading: true,
      data: null,
      error: null,
      status: null,
      statusText: null,
    };

    try {
      const response = await callback();
      callResponse.data = response.data;
      callResponse.status = response.status;
      callResponse.statusText = response.statusText;
      callResponse.error = null;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      callResponse.data = null;
      callResponse.error = message;
      callResponse.status = error.response?.status;
      callResponse.statusText = error.response?.statusText;
    } finally {
      callResponse.isLoading = false;
      return callResponse;
    }
  };

  return { fetchData, fetchDataWithStatus };
};

export default useFetch;
