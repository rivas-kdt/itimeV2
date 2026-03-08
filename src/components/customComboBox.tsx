import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Command, CommandGroup, CommandInput, CommandItem } from "./ui/command";

type CustomComboBoxProps = {
  label: string;
  value: string;
  setValue: (val: string) => void;
  items: readonly string[];
  placeholder: string;
};

export function CustomComboBox({
  label,
  value,
  setValue,
  items,
  placeholder,
}: CustomComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [dialogInputValue, setDialogInputValue] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.toLowerCase().includes(dialogInputValue.toLowerCase()),
    );
  }, [dialogInputValue, items]);

  const isExactMatch = items.some(
    (item) => item.toLowerCase() === dialogInputValue.toLowerCase(),
  );

  const showAddNew = dialogInputValue.trim().length > 0 && !isExactMatch;

  const selectValue = (val: string) => {
    setValue(val);
    setOpen(false);
    setDialogInputValue("");
  };

  return (
    <div className="flex flex-col w-full gap-1">
      <label className="font-bold">{label}</label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Input
            value={value}
            readOnly
            placeholder={placeholder}
            className="border-gray-500 text-sm text-left"
          />
        </DialogTrigger>

        <DialogContent className="box-design text-black-text">
          <DialogHeader className="border-b-1 border-gray-300 pb-2">
            <DialogTitle className="flex">Search or Input Value</DialogTitle>
          </DialogHeader>
          <Command shouldFilter={false} className="text-black-text">
            <CommandInput
              placeholder="Search or type new item..."
              value={dialogInputValue}
              onValueChange={setDialogInputValue}
              autoFocus
              className="text-black-text"
            />

            <CommandGroup className="text-black-text flex flex-col w-full">
              {filteredItems.slice(0, 5).map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => selectValue(item)}
                  className="w-full relative py-2 my-2 !text-black-text bg-primary-white border-1 border-primary-op-2"
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    {item}
                  </span>
                </CommandItem>
              ))}

              {showAddNew && (
                <CommandItem
                  value={dialogInputValue}
                  onSelect={() => selectValue(dialogInputValue)}
                  className="w-full py-2 !text-white gradient-bg "
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    Add &quot;{dialogInputValue}&quot;
                  </span>
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
