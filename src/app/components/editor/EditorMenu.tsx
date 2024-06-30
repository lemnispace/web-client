import { Button } from "@/components/button";
import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type HTMLButtonProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "color"
>;

export interface EditorControlItemProps extends HTMLButtonProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  download?: boolean;
  active?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  variant?: "plain" | "outline";
}

type EditorControlButtonProps = Omit<
  EditorControlItemProps,
  "active" | "wrapperClassName"
>;

export function EditorControlItem({
  className,
  icon,
  label,
  variant,
  labelClassName,
  ...props
}: EditorControlButtonProps) {
  return (
    <Button
      {...(variant === "outline" ? { outline: true } : { plain: true })}
      className={clsx(
        "flex flex-col r w-full",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {icon}
      <span className={clsx("text-sm", labelClassName)}>{label}</span>
    </Button>
  );
}

interface EditorMenuProps {
  actions: EditorControlItemProps[];
  className?: string;
  disabled?: boolean;
}

export default function EditorMenu(props: EditorMenuProps) {
  return (
    <ul
      className={clsx(
        "bg-zinc-800 text-white w-auto md:min-w-fit flex whitespace-nowrap dark overflow-auto no-scrollbar",
        props.className
      )}
    >
      {props.actions.map(({ active, wrapperClassName, ...a }) => {
        const disabled = props.disabled || a.disabled;
        return (
          <li
            key={a.label}
            className={clsx(
              "w-full py-2 min-w-fit",
              active && !disabled && "bg-zinc-600/90",
              wrapperClassName
            )}
          >
            <EditorControlItem {...a} disabled={disabled} />
          </li>
        );
      })}
    </ul>
  );
}
