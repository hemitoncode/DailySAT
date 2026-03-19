import { ReactNode } from "react";
import { cn } from "@/utils/utils";

type PageHeaderProps = {
  children: ReactNode;
  className?: string;
  accentClassName?: string;
  contentClassName?: string;
};

type SectionProps = {
  children: ReactNode;
  className?: string;
};

const PageHeaderRoot = ({
  children,
  className,
  accentClassName,
  contentClassName,
}: PageHeaderProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400",
          accentClassName,
        )}
      />
      <div
        className={cn(
          "w-full bg-white border-b border-gray-200 px-8 md:px-16 py-8",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Eyebrow = ({ children, className }: SectionProps) => (
  <p
    className={cn(
      "text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-500 mb-1",
      className,
    )}
  >
    {children}
  </p>
);

const Title = ({ children, className }: SectionProps) => (
  <h1
    className={cn(
      "text-4xl md:text-5xl text-gray-900 leading-tight",
      className,
    )}
    style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
  >
    {children}
  </h1>
);

const Description = ({ children, className }: SectionProps) => (
  <p className={cn("text-sm text-gray-500 font-light mt-1", className)}>
    {children}
  </p>
);

type PageHeaderComposition = typeof PageHeaderRoot & {
  Eyebrow: typeof Eyebrow;
  Title: typeof Title;
  Description: typeof Description;
};

const PageHeader = PageHeaderRoot as PageHeaderComposition;

PageHeader.Eyebrow = Eyebrow;
PageHeader.Title = Title;
PageHeader.Description = Description;

export default PageHeader;
