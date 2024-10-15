// TODO: Retry, throttle, cancel after 10 seconds
function fetchApi(endpoint: string, options?: RequestInit) {
  if (!endpoint.startsWith("/")) {
    console.error("Please append a trailing '/' on the endpoint");
    return;
  }
  try {
    const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

    const response = fetch(URL, options).then((data) => data.json());
    return response;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error(err);
    return;
  }
}

export default fetchApi;
