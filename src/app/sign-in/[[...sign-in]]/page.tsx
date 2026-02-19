import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Castello account",
};

// Required for static export with catch-all route
export function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-gray-600 mb-8">
          Authentication will be available soon.
        </p>
        <p className="text-sm text-gray-500">
          Contact us at enquiries@castello.international
        </p>
      </div>
    </div>
  );
}
