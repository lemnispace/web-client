import { Button } from "@/components/button";
import clsx from "clsx";

export interface EditorControlItemProps {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function EditorControlItem({
  className,
  icon,
  label,
  ...props
}: EditorControlItemProps) {
  return (
    <Button
      type="button"
      plain
      className={clsx(
        "flex flex-col r w-full",
        props.disabled ? "cursor-wait" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {icon}
      <span>{label}</span>
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
        "bg-zinc-800 text-white w-auto flex flex-col p-2 md:p-4 whitespace-nowrap dark",
        props.className
      )}
    >
      {props.actions.map((a) => (
        <li key={a.label} className="w-full">
          <EditorControlItem {...a} disabled={props.disabled || a.disabled} />
        </li>
      ))}
    </ul>
  );
}
