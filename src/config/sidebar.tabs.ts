import Subtract1 from "../assets/icons/Subtract_1.svg";
import QualityIcon from "../assets/icons/Quality_control.svg";
import { CONFIGURATION_MENU } from "./sidebar.menu";

export type SidebarTabConfig = {
  key: "configuration";
  label: string;
  bg: string;
  icon: {
    src: string;
    baseScale: number;
  };
  defaultPath: string;
  menu: typeof CONFIGURATION_MENU;
};

export const SIDEBAR_TABS: SidebarTabConfig[] = [
  {
    key: "configuration",
    label: "Configuration",
    bg: Subtract1,
    icon: { src: QualityIcon, baseScale: 1.2 },
    defaultPath: "/template-designer",
    menu: CONFIGURATION_MENU,
  },
];

export const SHOW_ICONS = false;
