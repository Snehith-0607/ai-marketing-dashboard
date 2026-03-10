import { useState, FormEvent, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - InsightAI";
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border border-[#E2E8F0]">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] flex items-center justify-center text-white text-xl">
              ✦
            </div>
            <div className="text-left">
              <CardTitle className="text-xl font-bold text-[#0F172A]">InsightAI</CardTitle>
              <CardDescription className="text-sm text-[#64748B]">
                AI-Powered Marketing Analytics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-sm text-[#0F172A]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-sm text-[#0F172A]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500" data-testid="text-login-error">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white text-sm font-medium h-10"
            >
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
            <div className="h-px bg-[#E2E8F0] flex-1" />
            <span>or</span>
            <div className="h-px bg-[#E2E8F0] flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-white text-sm font-medium h-10 border-[#E2E8F0]"
          >
            Continue with Google
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xs text-[#64748B] hover:text-[#111827] underline-offset-2 hover:underline"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

