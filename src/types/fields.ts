export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  onSelected?: () => void;
}

export interface ICustomOptionProps {
  name: string;
  isActive: boolean;
  optionKey: string;
}

export interface ICustomOption {
  value: string;
  label: string;
  description: string;
  component: React.FC<ICustomOptionProps>;
}
