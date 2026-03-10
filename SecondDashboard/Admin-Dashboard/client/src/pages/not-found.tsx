import { Link } from "wouter";
import { ArrowLeft, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-6">
        <Frown className="w-8 h-8 text-[#94A3B8]" />
      </div>
      <h1 className="text-3xl font-bold text-[#1C2434] mb-2">Page not found</h1>
      <p className="text-sm text-[#64748B] mb-6 text-center max-w-sm">
        The page you are looking for doesn't exist. Here are some helpful links:
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-[#465FFF] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3A50E0] transition-colors"
        data-testid="link-back-home"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
