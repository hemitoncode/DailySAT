"use client";

import type React from "react"
import { useState } from "react"
import { generateStudyPlan } from "@/services/ai/ai/generateStudyPlan"
import { StudyPlan } from "@/features/ai-planner/components/StudyPlan"
import { StudyPlanData, StudyDay, DebugPlan, ValidPlan } from "@/features/ai-planner/types/ai"
import { toast } from "react-toastify"

const AI = () => {
  const [currentScore, setCurrentScore] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [testDate, setTestDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [personalization, setPersonalization] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScore || !targetScore || !testDate) return;

    setIsLoading(true);

    try {
      const plan = await generateStudyPlan({
        currentScore: Number(currentScore),
        targetScore: Number(targetScore),
        testDate: new Date(testDate).toISOString(),
        debug: false,
        personalization,
      });

      if (plan?.isDebug && "rawResponse" in plan) {
        try {
          const jsonMatch = plan.rawResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedPlan = JSON.parse(jsonMatch[0]);
            const currentDate = new Date();
            parsedPlan.days = parsedPlan.days.map(
              (day: StudyDay, index: number) => {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + index);
                return { ...day, date: date.toISOString().split("T")[0] };
              }
            );
            setStudyPlan({
              ...parsedPlan,
              rawResponse: plan.rawResponse,
              isDebug: true,
            } as DebugPlan & ValidPlan);
          } else {
            setStudyPlan(plan);
          }
        } catch (err) {
          toast.error(`Sorry, it looks like there is an error: ${err}`);
          setStudyPlan(plan);
        }
      } else {
        setStudyPlan(plan);
      }

      setStep(2);
    } catch (error) {
      setStudyPlan({
        error: `Failed to generate plan. Error message: ${error as Error}`,
        isError: true,
      });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentScore("");
    setTargetScore("");
    setTestDate("");
    setStudyPlan(null);
    setStep(1);
  };

  const scoreDelta =
    currentScore && targetScore ? Number(targetScore) - Number(currentScore) : null;

  const inputBase =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition";

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {step === 1 ? (
        <div className="flex flex-col min-h-screen w-full">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

          {/* Header */}
          <div className="w-full bg-white border-b border-gray-200 px-16 py-9">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-500 mb-2">
              SAT Prep · AI Powered
            </p>
            <h1 className="text-4xl font-normal text-gray-900 tracking-tight leading-tight mb-2">
              Build your{" "}
              <em className="italic not-italic font-normal text-blue-500">study plan.</em>
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Enter your scores and test date — we'll generate a personalized day-by-day SAT roadmap in seconds.
            </p>
          </div>

          {/* Form body */}
          <div className="flex-1 w-full bg-slate-50 px-16 py-10">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-5 w-full mb-5">

                {/* Current Score */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-2">
                    Current Score
                  </p>
                  <label
                    htmlFor="current-score"
                    className="block text-xs font-medium text-gray-600 mb-1.5"
                  >
                    Your latest SAT score
                  </label>
                  <input
                    id="current-score"
                    type="number"
                    value={currentScore}
                    onChange={(e) => setCurrentScore(e.target.value)}
                    min={400}
                    max={1600}
                    required
                    placeholder="e.g. 1050"
                    className={inputBase}
                  />
                </div>

                {/* Target Score */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-2">
                    Target Score
                  </p>
                  <label
                    htmlFor="target-score"
                    className="block text-xs font-medium text-gray-600 mb-1.5"
                  >
                    Where you want to be
                  </label>
                  <input
                    id="target-score"
                    type="number"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    min={400}
                    max={1600}
                    required
                    placeholder="e.g. 1400"
                    className="w-full px-3.5 py-2.5 border border-blue-200 rounded-xl bg-blue-50 text-sm text-blue-800 placeholder-blue-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition"
                  />
                  {scoreDelta !== null && scoreDelta > 0 && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 text-[11px] font-semibold text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      +{scoreDelta} point goal
                    </div>
                  )}
                </div>

                {/* Test Date */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-2">
                    Test Date
                  </p>
                  <label
                    htmlFor="test-date"
                    className="block text-xs font-medium text-gray-600 mb-1.5"
                  >
                    When is your SAT?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      id="test-date"
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      required
                      min={new Date(Date.now()).toISOString().split("T")[0]}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>

                {/* About You — full width */}
                <div className="col-span-3 bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-2">
                    About You
                  </p>
                  <label
                    htmlFor="personalization"
                    className="block text-xs font-medium text-gray-600 mb-1.5"
                  >
                    Strengths, weaknesses &amp; study preferences
                  </label>
                  <textarea
                    id="personalization"
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    placeholder="e.g. I struggle with reading comprehension but I'm strong in algebra. I study best in the morning for 1–2 hours…"
                    required
                    className={`${inputBase} min-h-[88px] resize-none leading-relaxed`}
                  />
                </div>
              </div>

              {/* Submit row */}
              <div className="flex items-center gap-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-px"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating your plan…
                    </>
                  ) : (
                    <>
                      Generate Study Plan
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-gray-400 font-light whitespace-nowrap">
                  Powered by Claude AI · Plans generated in seconds
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen w-full">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

          {/* Hero */}
          <div className="w-full bg-gradient-to-br from-blue-800 to-blue-500 px-16 py-10 flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-300">
                Your personalized plan
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">SAT Study Plan</h2>
              {testDate && (
                <p className="text-sm text-blue-200 font-light">
                  Test date:{" "}
                  {new Date(testDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>

            {currentScore && targetScore && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center bg-white/10 border border-white/15 rounded-xl px-5 py-3">
                  <span className="text-2xl font-bold text-white tracking-tight leading-none">{currentScore}</span>
                  <span className="text-[10px] font-medium text-blue-300 uppercase tracking-wider mt-1">Current</span>
                </div>
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="flex flex-col items-center bg-blue-300/15 border border-blue-300/40 rounded-xl px-5 py-3">
                  <span className="text-2xl font-bold text-white tracking-tight leading-none">{targetScore}</span>
                  <span className="text-[10px] font-medium text-blue-300 uppercase tracking-wider mt-1">Target</span>
                </div>
              </div>
            )}
          </div>

          {/* Back bar */}
          <div className="w-full bg-white border-b border-gray-200 px-16 py-3 flex items-center">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-3.5 py-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Form
            </button>
          </div>

          {/* Plan body */}
          <div className="flex-1 w-full bg-slate-50 px-16 py-10">
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-10">
              <StudyPlan
                plan={studyPlan as StudyPlanData}
                currentScore={currentScore}
                targetScore={targetScore}
                testDate={testDate ? new Date(testDate) : undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AI;
