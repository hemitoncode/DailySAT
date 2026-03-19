import React from "react";
import { useRouter } from "next/navigation";
import { redirectionRoutesType } from "@/features/dashboard/types/option-redirect-routes";

interface OptionProps {
  icon: React.ReactNode;
  header: string;
  redirect: redirectionRoutesType;
}

const Option: React.FC<OptionProps> = ({ icon, header, redirect }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirect);
  };

  return (
    <div
      onClick={handleRedirect}
      className="flex items-center gap-3.5 bg-white border border-gray-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-px transition group"
    >
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 group-hover:text-blue-600 transition">
          {header}
        </p>
      </div>
      <div className="ml-auto text-gray-300 group-hover:text-blue-400 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default Option;
