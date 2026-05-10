"use client";

import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const CORRECT_PASSWORD = "216829";
const STORAGE_KEY = "demo_access_granted";

export function DemoPasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === CORRECT_PASSWORD) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleComplete = (val: string) => {
    if (val === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, val);
      setIsAuthorized(true);
    } else {
      setError(true);
      // Brief shake effect could be added here
      setTimeout(() => setError(false), 500);
      setValue("");
    }
  };

  if (isAuthorized === null) {
    return null; // or a loading spinner
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0E100F] text-[#FFF7DD] font-sf-pro-display">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Password Required</h1>
        <p className="text-[#FFF7DD]/60">Enter the 6-digit code to access the demo</p>
      </div>

      <div className={`transition-transform duration-300 ${error ? "animate-shake" : ""}`}>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(val) => setValue(val)}
          onComplete={handleComplete}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
            <InputOTPSlot index={1} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
            <InputOTPSlot index={2} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
          </InputOTPGroup>
          <InputOTPSeparator className="text-white/20" />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
            <InputOTPSlot index={4} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
            <InputOTPSlot index={5} className="w-12 h-14 text-2xl border-white/20 bg-white/5" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="mt-4 text-red-400 font-medium animate-in fade-in slide-in-from-top-1">
          Incorrect password. Please try again.
        </p>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
