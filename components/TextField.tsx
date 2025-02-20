import clsx from "clsx";
import { InputHTMLAttributes } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface TextFieldProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  icon?: React.ReactNode;
  rules: RegisterOptions<T, Path<T>>;
}
const TextField = <T extends FieldValues>({
  label,
  name,
  register,
  error,
  rules,
  icon,
  ...rest
}: TextFieldProps<T>) => {
  return (
    <div className="w-full">
      <div className="flex relative gap-5 items-center w-full border rounded-xl shadow-[0px_4px_10px_-4px_#00000040] px-3">
        <label className="cursor-pointer hover:opacity-80 transition-opacity" htmlFor={name}>{label}</label>
        <input
          {...register(name, rules)}
          id={name}
          className={clsx(
            "py-3 w-full border-none bg-transparent",
            "placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0",
            error && "border-red-500"
          )}
          {...rest}
          autoComplete="off"
        />
        {icon && (
          <span className="absolute grid place-content-center inset-y-0 right-2 hover:opacity-80 transition-opacity">
            {icon}
          </span>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default TextField;
