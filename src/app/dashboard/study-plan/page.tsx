"use client"

import { Calendar } from '@/features/ai-planner/components/Calendar'
import { StudyPlanProps } from '@/features/ai-planner/components/StudyPlan'
import { Skeleton } from '@/shared/components/ui/skeleton'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StudyPlan = () => {

  const [plan, setPlan] = useState<StudyPlanProps | null>(null)

  useEffect(() => {
    const handleGetPlan = async () => {
        const response = await axios.get("/api/study-plan")
        setPlan(response.data.plan)
    }

    handleGetPlan()
  }, [])

  return (
    <>
    {plan !== null ? (
        <Calendar 
            plan={plan}
        />
    ): (
        <Skeleton className="w-full h-[450px] mb-2 bg-gray-400/60 " />
    )}
    </>

  )
}

export default StudyPlan