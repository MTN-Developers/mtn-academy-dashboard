import { IconType } from "react-icons";

export type ActionType = "read" | "delete" | "create" | "update";

export interface MenuItem {
  isLink: boolean;
  url: string;
  icon: IconType;
  label: string;
  module?: string;
  action?: ActionType;
}

export interface MenuCategory {
  catalog: string;
  listItems: MenuItem[];
}
