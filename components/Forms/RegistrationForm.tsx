// components/RegistrationForm.tsx
'use client';
import React, { useState, useMemo } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RegistrationFormProps {
  useSignUp: () => void;
  isLoaded: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ useSignUp, isLoaded }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const useCreateUserProfile = () => {
  return useMutation(api.users.createUserProfile);
};

const createUserProfile = useCreateUserProfile();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserProfile({
        clerkId: "",
        firstName,
        lastName,
        email,
      });
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      console.error("Error:", err);
    }
  };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
    );
  };
export default RegistrationForm;
