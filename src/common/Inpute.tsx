import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          className={`w-full rounded-lg border-[1.5px] px-4 py-1 text-black outline-none transition 
            ${error ? "border-red-500" : "border-stroke focus:border-primary"}  ${className}`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
