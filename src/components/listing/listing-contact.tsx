"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MessageSquare, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface ListingContactProps {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
  };
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    photo: string;
    agency: string;
  };
}

export function ListingContact({ listing, agent }: ListingContactProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in this property: ${listing.title} (${formatPrice(listing.price, listing.currency)}). Please contact me with more details.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Agent Info */}
      <div className="flex items-center gap-4">
        <Image
          src={agent.photo}
          alt={agent.name}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
          <p className="text-sm text-gray-500">{agent.agency}</p>
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowPhone(!showPhone)}
          leftIcon={<Phone className="h-4 w-4" />}
        >
          {showPhone ? agent.phone : "Show Phone"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = `mailto:${agent.email}`}
          leftIcon={<Mail className="h-4 w-4" />}
        >
          Email
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or send a message</span>
        </div>
      </div>

      {/* Contact Form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Your full name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="your@email.com"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Your phone number"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            leftIcon={<MessageSquare className="h-4 w-4" />}
          >
            Send Message
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
          <p className="mt-1 text-sm text-gray-500">
            {agent.name} will get back to you soon.
          </p>
        </div>
      )}

      {/* Schedule Tour */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full"
          leftIcon={<Calendar className="h-4 w-4" />}
        >
          Schedule a Tour
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        By submitting, you agree to our Terms of Service and Privacy Policy.
      </p>
    </Card>
  );
}
