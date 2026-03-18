import { Difficulty } from "@/features/practice/types/difficulty";
import { SubjectFor } from "@/features/practice/types/subject";
import { Type } from "@/features/practice/types/subject";
import axios from "axios";

export const handleFetchQuestion = async <T extends Type>(
  type: T,
  difficulty: Difficulty,
  subject: SubjectFor<T>
) => {
  const response = await axios.get(
    `/api/get-question?type=${type}&subject=${subject}&difficulty=${difficulty}`
  );
  return response;
};
