import { menu } from "./data";
import MenuItem from "./MenuItem";
import { IconType } from "react-icons";

// Renamed interface to avoid conflict with the imported component
interface MenuItemType {
  isLink: boolean;
  url?: string;
  icon: IconType;
  label: string;
  module?: string;
  action?: "create" | "read" | "update" | "delete";
  onClick?: () => void;
}

interface MenuCategory {
  catalog: string;
  listItems: MenuItemType[];
}

const Menu = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-5">
        {(menu as MenuCategory[]).map((item, index) => (
          <MenuItem
            key={index}
            catalog={item.catalog}
            listItems={item.listItems}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
