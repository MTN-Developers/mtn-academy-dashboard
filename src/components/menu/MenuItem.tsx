// MenuItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import { useAuth } from "../../contexts/AuthContext";

interface MenuItem {
  isLink: boolean;
  url?: string;
  icon: IconType;
  label: string;
  module?: string; // permission module
  action?: "create" | "read" | "update" | "delete"; // permission action
  onClick?: () => void;
}

interface MenuItemProps {
  onClick?: () => void;
  catalog: string;
  listItems: MenuItem[];
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, catalog, listItems }) => {
  // 🔑 Use your AuthContext to check permissions
  const { hasPermission } = useAuth();

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
      <span className="hidden xl:block px-2 xl:text-sm 2xl:text-base 3xl:text-lg uppercase">
        {catalog}
      </span>

      {listItems.map((listItem, index) => {
        // ✅ If the item has a module/action, check permission
        if (listItem.module && listItem.action) {
          const isAllowed = hasPermission(listItem.module, listItem.action);
          if (!isAllowed) {
            // 🎯 Skip rendering if user is not allowed
            return null;
          }
        }

        // If item is a link
        if (listItem.isLink) {
          return (
            <NavLink
              key={index}
              onClick={onClick}
              to={listItem.url || ""}
              className={({ isActive }) =>
                isActive
                  ? "btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-active btn-ghost btn-block justify-start"
                  : "btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-ghost btn-block justify-start"
              }
            >
              <listItem.icon className="xl:text-2xl 2xl:text-3xl 3xl:text-4xl" />
              <span className="xl:text-sm 2xl:text-base 3xl:text-lg capitalize">
                {listItem.label}
              </span>
            </NavLink>
          );
        }
        // If it's not a link but a button
        else {
          return (
            <button
              key={index}
              onClick={listItem.onClick}
              className="btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-ghost btn-block justify-start"
            >
              <listItem.icon className="xl:text-2xl 2xl:text-3xl 3xl:text-4xl" />
              <span className="xl:text-sm 2xl:text-base 3xl:text-lg capitalize">
                {listItem.label}
              </span>
            </button>
          );
        }
      })}
    </div>
  );
};

export default MenuItem;
