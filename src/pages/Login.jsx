import React from "react";
import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-blue-50 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80"
          alt="Accounting Illustration"
          className="object-cover w-full h-full max-h-screen"
        />
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
