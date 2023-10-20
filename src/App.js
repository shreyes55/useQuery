import React from "react";

import useQuery from "./useQuery";

import "./styles.css";

const fetchData = async () => {
  // Replace this with your actual API call logic
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return response.json();
};

export default function App() {
  const { isLoading, error, data } = useQuery("key", fetchData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching</p>;
  return (
    <div className="App">
      {data ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <p>
                {item.title} - {item.completed ? "Completed" : "Not Completed"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}
