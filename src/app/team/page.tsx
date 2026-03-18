import React from "react";
import { AnimatedTeamCard } from "@/features/team/components/AnimatedTeamCard";
import "./team.css";
import { teamMember } from "@/features/team/data/index";

const About = () => {
  const text = "Our Executives";
  

  return (
    <div>
      <div className="text-center mt-8">
        <h2 className="text-5xl tracking-tight font-extrabold text-blue-900">
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-up inline-block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {char === " " ? "\u00A0" : char} {/* Preserve spaces */}
            </span>
          ))}
        </h2>
      </div>
      <AnimatedTeamCard testimonials={teamMember} />
    </div>
  );
};

export default About;
