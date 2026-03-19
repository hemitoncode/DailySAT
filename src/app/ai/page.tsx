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

  const scoreDelta = currentScore && targetScore ? Number(targetScore) - Number(currentScore) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --blue-deep: #1e3a8a;
          --blue-mid: #1d4ed8;
          --blue-bright: #3b82f6;
          --blue-light: #dbeafe;
          --blue-pale: #eff6ff;
          --ink: #0f172a;
          --muted: #64748b;
          --border: #e2e8f0;
          --surface: #f8faff;
        }

        .page-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          width: 100%;
          background: var(--surface);
        }

        /* ── STEP 1: FULL-WIDTH FORM ── */
        .form-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Top accent bar */
        .form-accent-bar {
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--blue-deep) 0%, var(--blue-mid) 50%, var(--blue-bright) 100%);
        }

        /* Header section — full width, blue tinted */
        .form-header {
          width: 100%;
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 36px 64px 32px;
          box-sizing: border-box;
        }
        .form-header-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--blue-mid);
          margin-bottom: 10px;
        }
        .form-header-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 8px;
        }
        .form-header-title em {
          font-style: italic;
          color: var(--blue-mid);
        }
        .form-header-sub {
          font-size: 14px;
          color: var(--muted);
          font-weight: 300;
        }

        /* Form body — full width grid */
        .form-body {
          flex: 1;
          background: var(--surface);
          padding: 40px 64px 64px;
          box-sizing: border-box;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          width: 100%;
          margin-bottom: 24px;
        }

        .form-grid-wide {
          grid-column: span 3;
        }

        .field-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue-mid);
          margin-bottom: 8px;
          display: block;
        }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .field-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 22px;
          animation: field-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .field-card:nth-child(1) { animation-delay: 0.05s; }
        .field-card:nth-child(2) { animation-delay: 0.10s; }
        .field-card:nth-child(3) { animation-delay: 0.15s; }
        .field-card:nth-child(4) { animation-delay: 0.20s; }

        @keyframes field-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: var(--surface);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: var(--ink);
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #cbd5e1; }
        .field-input:focus {
          border-color: var(--blue-mid);
          background: white;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.1);
          outline: none;
        }
        .field-input-blue {
          border-color: #bfdbfe;
          background: var(--blue-pale);
        }
        .field-input-blue::placeholder { color: #93c5fd; }
        .field-input-blue:focus {
          border-color: var(--blue-mid);
          background: white;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.1);
          outline: none;
        }
        .field-textarea {
          resize: none;
          min-height: 90px;
          line-height: 1.6;
        }
        .date-wrap { position: relative; }
        .date-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
        }
        .field-input-date { padding-left: 40px; }

        .delta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--blue-pale);
          border: 1px solid var(--blue-light);
          border-radius: 20px;
          padding: 3px 10px 3px 7px;
          font-size: 11px;
          font-weight: 600;
          color: var(--blue-mid);
          margin-top: 10px;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 8px;
        }

        .submit-btn {
          flex: 1;
          background: var(--blue-mid);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 15px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.55s;
        }
        .submit-btn:not(:disabled):hover::after { transform: translateX(100%); }
        .submit-btn:not(:disabled):hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.28);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .form-footnote {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 300;
          white-space: nowrap;
        }

        /* ── STEP 2: RESULTS ── */
        .results-page {
          width: 100%;
          min-height: 100vh;
          animation: page-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes page-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .results-accent-bar {
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--blue-deep) 0%, var(--blue-mid) 50%, var(--blue-bright) 100%);
        }
        .results-hero {
          width: 100%;
          background: linear-gradient(135deg, var(--blue-deep) 0%, #1e40af 100%);
          padding: 40px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-sizing: border-box;
        }
        .results-hero-left { display: flex; flex-direction: column; gap: 6px; }
        .results-hero-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #93c5fd;
        }
        .results-hero-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.03em;
        }
        .results-hero-sub { font-size: 13px; color: #bfdbfe; font-weight: 300; }
        .results-score-chips { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .score-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 12px 20px;
        }
        .score-chip-num {
          font-size: 24px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .score-chip-label {
          font-size: 10px;
          color: #93c5fd;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .score-arrow { color: #60a5fa; display: flex; align-items: center; }
        .results-back-bar {
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 12px 64px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 7px 14px;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s;
        }
        .back-btn:hover {
          background: var(--blue-pale);
          border-color: #93c5fd;
          color: var(--blue-mid);
          box-shadow: 0 2px 8px rgba(29,78,216,0.08);
        }
        .results-body {
          padding: 40px 64px 64px;
          background: var(--surface);
          box-sizing: border-box;
        }
        .results-inner {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>

      <div className="page-root">
        {step === 1 ? (
          <div className="form-page">
            <div className="form-accent-bar" />

            {/* Header */}
            <div className="form-header">
              <p className="form-header-eyebrow">SAT Prep · AI Powered</p>
              <h1 className="form-header-title">
                Build your <em>study plan.</em>
              </h1>
              <p className="form-header-sub">
                Enter your scores and test date — we'll generate a personalized day-by-day SAT roadmap in seconds.
              </p>
            </div>

            {/* Form body */}
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Current Score */}
                  <div className="field-card">
                    <span className="field-section-label">Current Score</span>
                    <label htmlFor="current-score" className="field-label">Your latest SAT score</label>
                    <input
                      id="current-score"
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(e.target.value)}
                      min={400}
                      max={1600}
                      required
                      placeholder="e.g. 1050"
                      className="field-input"
                    />
                  </div>

                  {/* Target Score */}
                  <div className="field-card">
                    <span className="field-section-label">Target Score</span>
                    <label htmlFor="target-score" className="field-label">Where you want to be</label>
                    <input
                      id="target-score"
                      type="number"
                      value={targetScore}
                      onChange={(e) => setTargetScore(e.target.value)}
                      min={400}
                      max={1600}
                      required
                      placeholder="e.g. 1400"
                      className="field-input field-input-blue"
                    />
                    {scoreDelta !== null && scoreDelta > 0 && (
                      <div className="delta-pill">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        +{scoreDelta} point goal
                      </div>
                    )}
                  </div>

                  {/* Test Date */}
                  <div className="field-card">
                    <span className="field-section-label">Test Date</span>
                    <label htmlFor="test-date" className="field-label">When is your SAT?</label>
                    <div className="date-wrap">
                      <span className="date-icon">
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
                        className="field-input field-input-date"
                      />
                    </div>
                  </div>

                  {/* Personalization — full width */}
                  <div className="field-card form-grid-wide">
                    <span className="field-section-label">About You</span>
                    <label htmlFor="personalization" className="field-label">Strengths, weaknesses & study preferences</label>
                    <textarea
                      id="personalization"
                      value={personalization}
                      onChange={(e) => setPersonalization(e.target.value)}
                      placeholder="e.g. I struggle with reading comprehension but I'm strong in algebra. I study best in the morning for 1–2 hours…"
                      required
                      className="field-input field-textarea"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={isLoading} className="submit-btn">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  <p className="form-footnote">Powered by Claude AI · Plans generated in seconds</p>
                </div>
              </form>
            </div>
          </div>

        ) : (
          <div className="results-page">
            <div className="results-accent-bar" />

            {/* Hero */}
            <div className="results-hero">
              <div className="results-hero-left">
                <p className="results-hero-eyebrow">Your personalized plan</p>
                <h2 className="results-hero-title">SAT Study Plan</h2>
                {testDate && (
                  <p className="results-hero-sub">
                    Test date: {new Date(testDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              {currentScore && targetScore && (
                <div className="results-score-chips">
                  <div className="score-chip">
                    <span className="score-chip-num">{currentScore}</span>
                    <span className="score-chip-label">Current</span>
                  </div>
                  <div className="score-arrow">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="score-chip" style={{ borderColor: "rgba(147,197,253,0.4)", background: "rgba(147,197,253,0.15)" }}>
                    <span className="score-chip-num">{targetScore}</span>
                    <span className="score-chip-label">Target</span>
                  </div>
                </div>
              )}
            </div>

            {/* Back bar */}
            <div className="results-back-bar">
              <button onClick={resetForm} className="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Form
              </button>
            </div>

            {/* Plan body */}
            <div className="results-body">
              <div className="results-inner">
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
