import { useState, useEffect } from "react";

const queryCache = {};
const pendingRequests = {};

function useQuery(key, fetchData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Check if the data is already in the cache
    if (queryCache[key]) {
      setData(queryCache[key]);
      return;
    }

    // Check if a request is already in progress for this key
    if (pendingRequests[key]) {
      // If a request is in progress, add the current component to its subscribers
      pendingRequests[key].subscribers.push({ setIsLoading, setError, setData });
      return;
    }

    // If no request is in progress, create a new request object
    pendingRequests[key] = {
      subscribers: [{ setIsLoading, setError, setData }],
      promise: fetchData().then((result) => {
        // Store the data in the cache
        queryCache[key] = result;

        // Resolve all subscribers with the fetched data
        pendingRequests[key].subscribers.forEach((subscriber) => {
          subscriber.setIsLoading(false);
          subscriber.setError(null);
          subscriber.setData(result);
        });

        // Remove the pending request object
        delete pendingRequests[key];
      }).catch((err) => {
        // Reject the subscribers with the error
        pendingRequests[key].subscribers.forEach((subscriber) => {
          subscriber.setIsLoading(false);
          subscriber.setError(err);
        });

        // Remove the pending request object
        delete pendingRequests[key];
      }),
    };

    // Set loading state while the request is in progress
    setIsLoading(true);
  }, [key, fetchData]);

  return { isLoading, error, data };
}


export default useQuery;