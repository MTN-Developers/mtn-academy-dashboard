// data.ts (or wherever your menu data is defined)
import {
  HiOutlineHome,
  // HiOutlineUser,
  HiOutlineUsers,
  // HiOutlineCube,
  // HiOutlineClipboardDocumentList,
  // HiOutlineDocumentChartBar,
  // HiOutlinePencilSquare,
  // HiOutlineCalendarDays,
  // HiOutlinePresentationChartBar,
  // HiOutlineDocumentText,
  // HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";
import { MdEvent } from "react-icons/md";
import { RiBookMarkedLine } from "react-icons/ri";

export const menu = [
  {
    catalog: "main",
    listItems: [
      {
        isLink: true,
        url: "/",
        icon: HiOutlineHome,
        label: "homepage",
        // No permission required, accessible to all authenticated users
      },
      {
        isLink: true,
        url: "/semesters",
        icon: RiBookMarkedLine,
        label: "Semesters",
      },
      {
        isLink: true,
        url: "/freestudy",
        icon: RiBookMarkedLine,
        label: "Free studies",
      },
      {
        isLink: true,
        url: "/users",
        icon: HiOutlineUsers,
        label: "Users",
      },
      {
        isLink: true,
        url: "/events",
        icon: MdEvent,
        label: "Events",
      },
      // {
      //   isLink: true,
      //   url: "/profile",
      //   icon: HiOutlineUser,
      //   label: "profile",
      //   module: "user", // <--- define module
      //   action: "read", // <--- define action
      // },
    ],
  },
  // {
  //   catalog: "lists",
  //   listItems: [
  //     {
  //       isLink: true,
  //       url: "/users",
  //       icon: HiOutlineUsers,
  //       label: "users",
  //       module: "user", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //     {
  //       isLink: true,
  //       url: "/products",
  //       icon: HiOutlineCube,
  //       label: "products",
  //       module: "product", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //     {
  //       isLink: true,
  //       url: "/orders",
  //       icon: HiOutlineClipboardDocumentList,
  //       label: "orders",
  //       module: "order", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //     {
  //       isLink: true,
  //       url: "/posts",
  //       icon: HiOutlineDocumentChartBar,
  //       label: "posts",
  //       module: "post", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //   ],
  // },
  // {
  //   catalog: "general",
  //   listItems: [
  //     {
  //       isLink: true,
  //       url: "/notes",
  //       icon: HiOutlinePencilSquare,
  //       label: "notes",
  //       module: "note", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //     {
  //       isLink: true,
  //       url: "/calendar",
  //       icon: HiOutlineCalendarDays,
  //       label: "calendar",
  //       module: "calendar", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //   ],
  // },
  // {
  //   catalog: "analytics",
  //   listItems: [
  //     {
  //       isLink: true,
  //       url: "/charts",
  //       icon: HiOutlinePresentationChartBar,
  //       label: "charts",
  //       module: "chart", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //     {
  //       isLink: true,
  //       url: "/logs",
  //       icon: HiOutlineDocumentText,
  //       label: "logs",
  //       module: "log", // <--- define module
  //       action: "read", // <--- define action
  //     },
  //   ],
  // },
  // {
  //   catalog: "miscellaneous",
  //   listItems: [
  //     {
  //       isLink: true,
  //       url: "/login",
  //       icon: HiOutlineArrowLeftOnRectangle,
  //       label: "log out",
  //       // Typically no permission needed to see or to log out
  //     },
  //   ],
  // },
];
