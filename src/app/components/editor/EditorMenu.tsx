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
}

export function EditorControlItem({
  className,
  icon,
  label,
  ...props
}: EditorControlItemProps) {
  return (
    <Button
      plain
      className={clsx(
        "flex flex-col r w-full",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {icon}
      <span className="text-sm">{label}</span>
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
        "bg-zinc-800 text-white w-auto flex py-2 whitespace-nowrap dark overflow-auto",
        props.className
      )}
    >
      {props.actions.map((a) => (
        <li key={a.label} className="w-full py-0 md:py-2">
          <EditorControlItem {...a} disabled={props.disabled || a.disabled} />
        </li>
      ))}
    </ul>
  );
}
