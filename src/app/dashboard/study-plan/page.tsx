"use client";

import { Calendar } from "@/features/ai-planner/components/Calendar";
import { StudyPlanProps } from "@/features/ai-planner/components/StudyPlan";
import { Skeleton } from "@/shared/components/ui/skeleton";
import axios from "axios";
import React, { useEffect, useState } from "react";

const StudyPlan = () => {
  const [plan, setPlan] = useState<StudyPlanProps | null>(null);

  useEffect(() => {
    const handleGetPlan = async () => {
      const response = await axios.get("/api/study-plan");
      setPlan(response.data.plan);
    };

    handleGetPlan();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        {plan !== null ? (
          <Calendar plan={plan} className="min-h-[calc(100vh-4rem)]" />
        ) : (
          <Skeleton className="w-full min-h-[calc(100vh-4rem)] mb-2 bg-gray-400/60 " />
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
