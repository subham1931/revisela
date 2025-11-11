'use client';

import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-[#0890A8] mb-4">Contact Us</h1>
      <p className="text-gray-600 text-lg max-w-2xl text-center mb-8">
        Have questions or need support? Fill out the form below, and we’ll get back to you soon.
      </p>

      <form className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0890A8]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0890A8]"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
            rows={4}
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0890A8]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#0890A8] text-white font-medium py-2 rounded-lg hover:scale-105 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
