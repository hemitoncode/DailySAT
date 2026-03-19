import React from "react";
import Header from "./Header";

interface CoinDisplayProps {
  header: string;
  number: number | undefined;
  type: string;
  icon: string;
  color: string;
}

const StatDisplay: React.FC<CoinDisplayProps> = ({
  header,
  number,
  type,
  icon,
  color,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 w-full">
      <Header title={header} icon={icon} />
      <div className="flex items-end gap-2">
        <p className="text-5xl font-bold leading-none tracking-tight" style={{ color }}>
          {number ?? 0}
        </p>
        <p className="text-sm text-gray-400 font-light mb-1">{type}</p>
      </div>
    </div>
  );
};

export default StatDisplay;
