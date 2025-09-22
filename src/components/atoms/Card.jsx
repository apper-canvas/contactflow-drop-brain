import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;