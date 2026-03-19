"use client";

import type React from "react"
import { useState } from "react"
import { generateStudyPlan } from "@/services/ai/ai/generateStudyPlan"
import { StudyPlan } from "@/features/ai-planner/components/StudyPlan"
import { StudyPlanData, StudyDay, DebugPlan, ValidPlan } from "@/features/ai-planner/types/ai"
import {toast} from "react-toastify"

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

  return (
    <>
      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sat-root * { font-family: 'DM Sans', sans-serif; }
        .sat-display { font-family: 'Fraunces', Georgia, serif; }

        .sat-input {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sat-input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
          outline: none;
        }

        .sat-btn {
          position: relative;
          overflow: hidden;
          transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
        }
        .sat-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .sat-btn:not(:disabled):hover::after {
          transform: translateX(100%);
        }
        .sat-btn:not(:disabled):hover {
          background-color: #1e40af;
          box-shadow: 0 8px 24px rgba(29, 78, 216, 0.35);
          transform: translateY(-1px);
        }
        .sat-btn:not(:disabled):active {
          transform: translateY(0);
        }

        .sat-card {
          animation: sat-rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes sat-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sat-field {
          animation: sat-fadein 0.35s ease both;
        }
        .sat-field:nth-child(1) { animation-delay: 0.05s; }
        .sat-field:nth-child(2) { animation-delay: 0.10s; }
        .sat-field:nth-child(3) { animation-delay: 0.15s; }
        .sat-field:nth-child(4) { animation-delay: 0.20s; }
        @keyframes sat-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .score-pill {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
        }

        .sat-dot-bg {
          background-image: radial-gradient(circle, #dbeafe 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .back-btn {
          transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .back-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          box-shadow: 0 2px 8px rgba(29,78,216,0.08);
        }
      `}</style>

      <div className="sat-root min-h-screen sat-dot-bg flex items-start justify-center py-10 px-4">
        {step === 1 ? (
          <div className="sat-card w-full max-w-xl">
            {/* Header stripe */}
            <div className="rounded-t-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-7 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-blue-400 opacity-20" />
              <div className="absolute top-4 right-16 w-14 h-14 rounded-full bg-blue-300 opacity-15" />

              <div className="relative z-10 flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-blue-100 text-xs font-medium tracking-widest uppercase">AI-Powered Planner</span>
              </div>

              <h2 className="sat-display text-white text-3xl font-semibold relative z-10 leading-tight">
                Build Your SAT<br />
                <span className="italic font-light">Study Plan</span>
              </h2>
              <p className="text-blue-100 text-sm mt-2 relative z-10 font-light">
                Tell us where you are — we'll map the path to where you want to be.
              </p>
            </div>

            {/* Form body */}
            <div className="bg-white rounded-b-2xl shadow-xl shadow-blue-900/10 border border-blue-50 border-t-0">
              <form onSubmit={handleSubmit} className="px-8 py-7">
                <div className="space-y-5">

                  {/* Scores row — side by side */}
                  <div className="sat-field">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-3">
                      Score Range
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="current-score"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Current Score
                        </label>
                        <div className="relative">
                          <input
                            id="current-score"
                            type="number"
                            value={currentScore}
                            onChange={(e) => setCurrentScore(e.target.value)}
                            min={400}
                            max={1600}
                            required
                            placeholder="e.g. 1050"
                            className="sat-input w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-300 text-sm font-medium"
                          />
                          {currentScore && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">/ 1600</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="target-score"
                          className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                          Target Score
                        </label>
                        <div className="relative">
                          <input
                            id="target-score"
                            type="number"
                            value={targetScore}
                            onChange={(e) => setTargetScore(e.target.value)}
                            min={400}
                            max={1600}
                            required
                            placeholder="e.g. 1400"
                            className="sat-input w-full px-4 py-2.5 border border-blue-200 rounded-xl bg-blue-50/50 text-blue-800 placeholder-blue-200 text-sm font-medium"
                          />
                          {targetScore && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-400 font-medium">/ 1600</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Score delta badge */}
                    {currentScore && targetScore && Number(targetScore) > Number(currentScore) && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="score-pill rounded-full px-3 py-1 flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-[11px] font-semibold text-blue-700">
                            +{Number(targetScore) - Number(currentScore)} point goal
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personalization */}
                  <div className="sat-field">
                    <label
                      htmlFor="personalization"
                      className="block text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1.5"
                    >
                      About You
                    </label>
                    <textarea
                      id="personalization"
                      value={personalization}
                      onChange={(e) => setPersonalization(e.target.value)}
                      placeholder="Describe your strengths, weaknesses, and how you like to study…"
                      required
                      className="sat-input w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-300 text-sm font-light resize-none min-h-[96px] leading-relaxed"
                    />
                  </div>

                  {/* Test date */}
                  <div className="sat-field">
                    <label
                      htmlFor="test-date"
                      className="block text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1.5"
                    >
                      Test Date
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        id="test-date"
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        required
                        min={new Date(Date.now()).toISOString().split("T")[0]}
                        max={
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                        className="sat-input w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-dashed border-gray-200" />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="sat-btn w-full bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2.5">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Generating your plan…</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Generate Study Plan
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-3 font-light">
                  Powered by Claude AI · Plans update in seconds
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div className="sat-card w-full max-w-2xl space-y-5">
            {/* Back button */}
            <button
              onClick={resetForm}
              className="back-btn flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Form
            </button>

            {/* Plan card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-50 overflow-hidden">
              {/* Thin top accent */}
              <div className="h-1 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600" />
              <div className="p-7">
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
    </>
  );
};

export default AI;
