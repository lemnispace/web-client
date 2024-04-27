import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { Input } from "@/components/input";
import { toKebabCase } from "@/utils/formatters";

interface TextInputDialogProps {
  title: string;
  label: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClose: () => void;
  onSubmit?: () => void;
  cta: string;
  open: boolean;
  name?: string;
}
const TextInputDialog = (props: TextInputDialogProps) => {
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      {props.description && (
        <DialogDescription>{props.description}</DialogDescription>
      )}
      <DialogBody>
        <Field>
          <Label>{props.label}</Label>
          <Input
            name={props.name || toKebabCase(props.label)}
            type="text"
            value={props.value}
            onChange={
              props.onChange && ((e) => props.onChange!(e.target.value))
            }
          />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={props.onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={props.onSubmit}>
          {props.cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInputDialog;
