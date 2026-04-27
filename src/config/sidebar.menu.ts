import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  page?: LazyExoticComponent<ComponentType<object>>;
};

export const CONFIGURATION_MENU: MenuItem[] = [
  {
    key: "template-designer",
    label: "Template Designer",
    path: "/template-designer",
    page: lazy(() => import("../pages/TemplateDesigner")),
  },
];
