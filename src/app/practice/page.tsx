import Link from "next/link";
import React from "react";
import { PageHeader } from "@/shared/components";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      <PageHeader>
        <PageHeader.Eyebrow>DailySAT · Practice</PageHeader.Eyebrow>
        <PageHeader.Title>
          Choose your <span className="text-blue-500">practice.</span>
        </PageHeader.Title>
        <PageHeader.Description>
          Pick a section to start practicing right now.
        </PageHeader.Description>
      </PageHeader>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center space-y-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">
            What SAT prep would you like to do?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/practice/math"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              Math
            </Link>
            <Link
              href="/practice/english"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              English
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
