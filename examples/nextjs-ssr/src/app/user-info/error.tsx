"use client"; // Error components must be Client components

import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg min-w-fit">
        <h2 className="mb-8 text-xl text-center mx-auto">
          Something went wrong!
        </h2>
        <div className="mb-1 font-medium">Error message:</div>
        <div className="font-light">{error.message}</div>
        <a
          href="/"
          className="w-full text-white cursor-pointe rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center mt-8"
        >
          Return to home
        </a>
      </div>
    </main>
  );
}
