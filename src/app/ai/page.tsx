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

        .serif { font-family: 'Instrument Serif', Georgia, serif; }

        /* NAV */
        .top-nav {
          width: 100%;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 60px;
          box-sizing: border-box;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: -0.02em;
        }
        .nav-logo-dot {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--blue-mid), var(--blue-bright));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--blue-mid);
          background: var(--blue-pale);
          border: 1px solid var(--blue-light);
          border-radius: 20px;
          padding: 3px 10px;
          letter-spacing: 0.02em;
        }

        /* STEP 1 SPLIT */
        .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 60px);
          width: 100%;
        }

        /* LEFT PANEL */
        .left-panel {
          background: linear-gradient(160deg, var(--blue-deep) 0%, #1e40af 55%, var(--blue-mid) 100%);
          padding: 64px 56px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .left-geo-1 {
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          top: -80px; right: -80px;
        }
        .left-geo-2 {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          bottom: 100px; left: -60px;
        }
        .left-geo-3 {
          position: absolute;
          width: 120px; height: 120px;
          background: rgba(255,255,255,0.04);
          border-radius: 24px;
          transform: rotate(20deg);
          bottom: 60px; right: 60px;
        }
        .left-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 16px;
        }
        .left-headline {
          font-size: clamp(36px, 4vw, 52px);
          line-height: 1.1;
          color: white;
          font-weight: 400;
          margin-bottom: 20px;
        }
        .left-headline em { font-style: italic; color: #93c5fd; }
        .left-sub {
          font-size: 15px;
          color: #bfdbfe;
          line-height: 1.65;
          font-weight: 300;
          max-width: 380px;
        }
        .stat-row {
          display: flex;
          gap: 28px;
          margin-top: 48px;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-num {
          font-size: 28px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .stat-label { font-size: 11px; color: #93c5fd; font-weight: 400; letter-spacing: 0.04em; }
        .stat-divider { width: 1px; background: rgba(255,255,255,0.15); margin: 4px 0; }
        .feature-list { display: flex; flex-direction: column; gap: 14px; }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #bfdbfe;
          font-weight: 300;
        }
        .feature-check {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* RIGHT PANEL */
        .right-panel {
          background: white;
          padding: 56px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          box-sizing: border-box;
        }
        .form-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .form-subtitle {
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 36px;
          font-weight: 300;
        }
        .field-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--blue-mid);
          margin-bottom: 10px;
        }
        .field-group {
          margin-bottom: 28px;
          animation: field-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .field-group:nth-child(1) { animation-delay: 0.06s; }
        .field-group:nth-child(2) { animation-delay: 0.12s; }
        .field-group:nth-child(3) { animation-delay: 0.18s; }
        @keyframes field-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
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
        .field-textarea { resize: none; min-height: 100px; line-height: 1.6; }
        .delta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue-pale);
          border: 1px solid var(--blue-light);
          border-radius: 20px;
          padding: 4px 10px 4px 8px;
          font-size: 11px;
          font-weight: 600;
          color: var(--blue-mid);
          margin-top: 10px;
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
        .form-divider {
          border: none;
          border-top: 1px dashed var(--border);
          margin: 28px 0;
        }
        .submit-btn {
          width: 100%;
          background: var(--blue-mid);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 14px 20px;
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
          box-shadow: 0 8px 24px rgba(29,78,216,0.3);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .form-footnote {
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 12px;
          font-weight: 300;
        }

        /* STEP 2 RESULTS */
        .results-page {
          width: 100%;
          min-height: calc(100vh - 60px);
          animation: page-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes page-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .results-hero {
          width: 100%;
          background: linear-gradient(135deg, var(--blue-deep) 0%, #1e40af 100%);
          padding: 40px 56px;
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
          padding: 12px 56px;
          display: flex;
          align-items: center;
          gap: 16px;
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
          padding: 40px 56px 64px;
          background: var(--surface);
          min-height: 400px;
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
        {/* Top Nav */}
        <nav className="top-nav">
          <div className="nav-logo">
            <div className="nav-logo-dot">
              <svg className="h-4 w-4" style={{ color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            ScorePath
          </div>
          <span className="nav-badge">AI Study Planner</span>
        </nav>

        {step === 1 ? (
          <div className="split-layout">
            {/* LEFT — branding panel */}
            <div className="left-panel">
              <div className="left-geo-1" />
              <div className="left-geo-2" />
              <div className="left-geo-3" />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p className="left-eyebrow">SAT Prep · AI Powered</p>
                <h1 className="left-headline serif">
                  Your path to a<br />
                  <em>higher score</em><br />
                  starts here.
                </h1>
                <p className="left-sub">
                  Enter your scores and test date. Our AI builds a day-by-day study plan tailored to close your gap — fast.
                </p>
                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-num">+240</span>
                    <span className="stat-label">Avg. score gain</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-num">30</span>
                    <span className="stat-label">Days max prep</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-num">AI</span>
                    <span className="stat-label">Personalized</span>
                  </div>
                </div>
              </div>

              <div className="feature-list" style={{ position: "relative", zIndex: 1 }}>
                {[
                  "Day-by-day study schedule",
                  "Weakness-targeted practice",
                  "Adapts to your test date",
                  "Built in seconds by Claude AI",
                ].map((f) => (
                  <div className="feature-item" key={f}>
                    <div className="feature-check">
                      <svg className="h-3 w-3" style={{ color: "#93c5fd" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="right-panel">
              <p className="form-title">Build your study plan</p>
              <p className="form-subtitle">Fill in your details and we'll generate a personalized SAT roadmap.</p>

              <form onSubmit={handleSubmit}>
                {/* Score fields */}
                <div className="field-group">
                  <p className="field-section-label">Score Range</p>
                  <div className="score-grid">
                    <div>
                      <label htmlFor="current-score" className="field-label">Current SAT Score</label>
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
                    <div>
                      <label htmlFor="target-score" className="field-label">Target SAT Score</label>
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
                    </div>
                  </div>
                  {scoreDelta !== null && scoreDelta > 0 && (
                    <div className="delta-pill">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      +{scoreDelta} point goal
                    </div>
                  )}
                </div>

                {/* Personalization */}
                <div className="field-group">
                  <p className="field-section-label">About You</p>
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

                {/* Test Date */}
                <div className="field-group">
                  <p className="field-section-label">Test Date</p>
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

                <hr className="form-divider" />

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
              </form>
            </div>
          </div>

        ) : (
          <div className="results-page">
            {/* Hero bar */}
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
