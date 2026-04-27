import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import TemplateDesignerPage from "./pages/TemplateDesigner";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/template-designer" replace />} />
        <Route path="template-designer" element={<TemplateDesignerPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/template-designer" replace />} />
    </Routes>
  );
}
