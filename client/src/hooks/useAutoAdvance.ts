import react, { useRef } from "react";

interface UseAutoAdvanceReturn {
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleInputChange: (value: string, index: number) => void;
}

export const useAutoAdvance = (fieldsCount: number): UseAutoAdvanceReturn => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    // Move to next field if value entered and not last field
    if (value && index < fieldsCount - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  return {
    refs,
    handleInputChange,
  };
};
