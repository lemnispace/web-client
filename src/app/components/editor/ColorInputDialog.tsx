import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { ErrorMessage, Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";
import { toKebabCase } from "@/utils/formatters";
import { useRef } from "react";

interface ColorInputDialogProps {
  title: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClose: () => void;
  onSubmit?: (color: string | undefined) => void;
  cta: string;
  open: boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
}
const ColorInputDialog = (props: ColorInputDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    const value = inputRef.current?.value;
    props.onSubmit?.(value);
  };
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      {props.description && (
        <DialogDescription>{props.description}</DialogDescription>
      )}
      <DialogBody>
        <Field className="w-24">
          <Label className="sr-only">{props.label}</Label>
          <Input
            type="color"
            ref={inputRef}
            name={props.name || toKebabCase(props.label)}
            value={props.value}
            invalid={!!props.error}
            onChange={
              props.onChange && ((e) => props.onChange!(e.target.value))
            }
          />
          {!!props.error && <ErrorMessage>{props.error}</ErrorMessage>}
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

export default ColorInputDialog;
