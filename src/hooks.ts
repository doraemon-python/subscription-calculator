import { useState } from "react";

export const useFormField = <T extends string>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value as T);
  };

  return [value, onChange, setValue] as const;
};