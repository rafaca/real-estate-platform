import { Search, Bell, Key, MapPin } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Intelligently",
    description:
      "Use our powerful search with filters, map drawing, and travel time calculations to find properties that match your exact needs.",
  },
  {
    icon: Bell,
    title: "Get Instant Alerts",
    description:
      "Save your searches and receive real-time notifications via email, push, or SMS when new properties match your criteria.",
  },
  {
    icon: MapPin,
    title: "Explore Neighborhoods",
    description:
      "Access detailed neighborhood data including schools, safety scores, transit options, and local amenities before you visit.",
  },
  {
    icon: Key,
    title: "Connect & Close",
    description:
      "Contact agents directly, schedule viewings, and move through the buying or renting process with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Finding your perfect property has never been easier. Our platform
            guides you through every step of the journey.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Step Number & Icon */}
              <div className="relative inline-flex">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.description}</p>

              {/* Connector Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
