"use client";

import React, { useEffect, useState } from "react";
import SubjectSidebar from "@/features/practice/components/SubjectSidebar";
import QuestionContent from "@/features/practice/components/QuestionContent";
import SessionProgress from "@/features/practice/components/SessionProgress";
import { CalculatorOptions } from "@/features/practice/components/CalculatorOption";
import {
  englishSubjectsArray,
  mathSubjectsArray,
} from "@/features/practice/data/subject";
import { Difficulty } from "@/features/practice/types/difficulty";
import { EnglishSubjects, Type } from "@/features/practice/types/subject";
import { useParams } from "next/navigation";
import { QUESTION_IS_CORRECT_POINTS } from "@/shared/data/constant";
import { useCalculatorModalStore } from "@/stores/modals";
import { useCalcModeModalStore } from "@/stores/calc";

const PracticePage = () => {
  const params = useParams();
  const { type } = params;
  const closeCalculatorModal = useCalculatorModalStore(
    (state) => state.closeModal,
  );
  const setCalcMode = useCalcModeModalStore((state) => state.setMode);

  if (type !== "math" && type !== "english") {
    throw new Error("Proper slug is not provided. Try again.");
  }

  const [selectedTopic, setSelectedTopic] = useState<EnglishSubjects>("All");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);

  if (!type) {
    throw new Error("Type query parameter is required");
  }

  useEffect(() => {
    if (type !== "math") {
      closeCalculatorModal();
      setCalcMode("none");
    }
  }, [type, closeCalculatorModal, setCalcMode]);

  const handleAnswered = (isCorrect: boolean, coinReward?: number) => {
    if (isCorrect) {
      const reward = coinReward ?? QUESTION_IS_CORRECT_POINTS;
      setCoinsEarned((prev) => prev + reward);
      setCorrectCount((prev) => prev + 1);
      setCurrentStreak((prev) => {
        const updated = prev + 1;
        setMaxStreak((max) => Math.max(max, updated));
        return updated;
      });
    } else {
      setWrongCount((prev) => prev + 1);
      setCurrentStreak(0);
    }
  };
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen gap-6 px-4 md:px-10 py-6">
        {/* Sidebar */}
        <aside className="w-full md:w-72 rounded-md p-4 overflow-y-auto">
          <SubjectSidebar
            subject={type === "math" ? "Math" : "English"}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            subjects={
              type === "math" ? mathSubjectsArray : englishSubjectsArray
            }
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </aside>

        {/* Question Content */}
        <main className="flex-1 flex flex-col space-y-8">
          <div className="rounded-md p-6 flex-grow overflow-auto">
            <QuestionContent
              subject={selectedTopic}
              difficulty={difficulty}
              type={type as Type}
              onAnswered={handleAnswered}
            />
          </div>
        </main>

        {/* Score Panel */}
        <aside className="w-full md:w-72 rounded-md p-4 overflow-y-auto">
          <SessionProgress
            correctCount={correctCount}
            wrongCount={wrongCount}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
            coinsEarned={coinsEarned}
          />
        </aside>
      </div>
      {type === "math" && <CalculatorOptions />}
    </>
  );
};

export default PracticePage;
