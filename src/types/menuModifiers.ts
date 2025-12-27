export type ModifierSelectionType = "single" | "multiple";
export type ModifierStatus = "active" | "inactive";

export type ModifierGroup = {
  _id: string;
  name: string;
  selectionType: ModifierSelectionType;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  displayOrder: number;
  status: ModifierStatus;
};

export type ModifierOption = {
  _id: string;
  groupId: string;
  name: string;
  priceAdjustment: number;
  status: ModifierStatus;
};
