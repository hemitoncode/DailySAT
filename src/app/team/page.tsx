import React from "react";
import { AnimatedTeamCard } from "@/features/team/components/AnimatedTeamCard";
import { teamMember } from "@/features/team/data/index";

const About = () => {
  const text = "Our Executives";

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

      {/* Page header */}
      <div className="w-full bg-white border-b border-gray-200 px-8 md:px-16 py-8">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-500 mb-1">
          DailySAT · Team
        </p>

        <h1
          className="text-4xl md:text-5xl text-gray-900 leading-tight"
          style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-up inline-block"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}{" "}
          <span
            className="fade-in-up text-blue-500 inline-block"
            style={{ animationDelay: `${text.length * 40 + 40}ms` }}
          >
            .
          </span>
        </h1>

        <p
          className="fade-in-up text-sm text-gray-500 font-light mt-1"
          style={{ animationDelay: `${text.length * 40 + 120}ms` }}
        >
          The people building DailySAT — dedicated to helping every student reach their score.
        </p>
      </div>

      {/* Team cards */}
      <div className="px-8 md:px-16 py-10">
        <AnimatedTeamCard testimonials={teamMember} />
      </div>
    </div>
  );
};

export default About;
