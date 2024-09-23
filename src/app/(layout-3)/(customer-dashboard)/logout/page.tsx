"use client";
import { useEffect,Suspense } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();

    router.replace('/'); 
  }, [router]);

  return <div>Logging out...</div>; 
};

export default Logout;
