import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { ErrorMessage, Field, Label } from "@/components/fieldset";
import { Textarea } from "@/components/textarea";
import { toKebabCase } from "@/utils/formatters";
import { useRef } from "react";

interface TextInputDialogProps {
  title: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (value: { text: string; fontSize: string }) => void;
  onClose: () => void;
  onSubmit?: (value: { text: string; fontSize: string }) => void;
  cta: string;
  open: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
}

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 20, 24] as const;

const TextInputDialog = (props: TextInputDialogProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fontSizeRef = useRef<HTMLSelectElement>(null);
  const handleSubmit = () => {
    const text = inputRef.current?.value ?? "";
    const fontSize = fontSizeRef.current?.value ?? "";
    props.onSubmit?.({ text, fontSize });
  };
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      {props.description && (
        <DialogDescription>{props.description}</DialogDescription>
      )}
      <DialogBody>
        {!!props.error && <ErrorMessage>{props.error}</ErrorMessage>}
        <Field>
          <Label>{props.label}</Label>
          <Textarea
            ref={inputRef}
            name={props.name || toKebabCase(props.label)}
            value={props.value}
            invalid={!!props.error}
            onChange={
              props.onChange &&
              ((e) =>
                props.onChange!({
                  text: e.target.value,
                  fontSize: fontSizeRef.current?.value || "",
                }))
            }
          />
        </Field>
        <Field className="flex flex-col mt-4">
          <Label>{"Font Size"}</Label>
          <select
            className="max-w-24 mt-2 rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            ref={fontSizeRef}
            name={"font-size"}
            defaultValue={FONT_SIZES[4] /*14px*/}
            onChange={
              props.onChange &&
              ((e) =>
                props.onChange!({
                  text: inputRef.current?.value || "",
                  fontSize: e.target.value,
                }))
            }
          >
            {FONT_SIZES.map((fontSize) => (
              <option key={fontSize} value={`${fontSize}`}>
                {fontSize}px
              </option>
            ))}
          </select>
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={props.onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={props.disabled}>
          {props.cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInputDialog;
