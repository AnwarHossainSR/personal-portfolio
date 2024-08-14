import { useState } from 'react';

import type { ConfirmationOptions } from '@/types';

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({});

  const confirm = (newOptions: ConfirmationOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  return {
    isOpen,
    options,
    confirm,
    setIsOpen,
  };
}
