"use client";

import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { getToken } = useAuth();

  async function testApi() {
    const token = await getToken();

    const response = await fetch("http://localhost:4000/clerk-test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <main>
      <h1>Product Z</h1>

      <button onClick={testApi}>
        Test Nest Auth
      </button>
    </main>
  );
}