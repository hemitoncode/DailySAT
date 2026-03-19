import React from "react";
import Image from "next/image";

interface HeaderProps {
  icon: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <Image src={`/icons/${icon}.png`} width={20} height={20} alt="icon" />
      </div>
      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 ml-2.5">
        {title}
      </p>
    </div>
  );
};

export default Header;
