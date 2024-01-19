export type Poll = {
  _id: string;
  content: string;
  isMultiSelection: boolean;
  options: Option[];
  createdAt: string;
  validTo: string;
};

export type Option = {
  name: string;
};
