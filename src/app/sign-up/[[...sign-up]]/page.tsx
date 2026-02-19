import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Castello account",
};

// Required for static export with catch-all route
export function generateStaticParams() {
  return [{ "sign-up": [] }];
}

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600 mb-8">
          Account registration will be available soon.
        </p>
        <p className="text-sm text-gray-500">
          Contact us at enquiries@castello.international
        </p>
      </div>
    </div>
  );
}
