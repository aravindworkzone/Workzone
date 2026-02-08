import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../redux/api/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? null;

  const {isLoading,isSuccess,isError} = useVerifyEmailQuery(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {isLoading && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Verifying email...
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Please wait
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <h2 className="text-2xl font-bold text-green-600">
              ✅ Email Verified
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Your email has been successfully verified.
            </p>
            
          </>
        )}

        {isError && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              ❌ Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              This link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
