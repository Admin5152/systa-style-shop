import { BracketLabel } from "@/components/ui/BracketLabel";

export function TopUtilityBar() {
  return (
    <div className="w-full bg-background border-b border-border py-1.5 px-4">
      <div className="container mx-auto flex items-center justify-between text-xs tracking-widest uppercase font-heading">
        <div className="hidden md:block w-1/3 text-left">
          <BracketLabel className="text-[10px]">SS_'26 · BUUBU EDITION</BracketLabel>
        </div>
        <div className="w-full md:w-1/3 text-center font-bold">
          WORLDWIDE SHIPPING
        </div>
        <div className="hidden md:block w-1/3 text-right">
          <BracketLabel className="text-[10px]">BE YOURSELF</BracketLabel>
        </div>
      </div>
    </div>
  );
}
