import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Metro Events - Home</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}
