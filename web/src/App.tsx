import { Navigate, Route, Routes } from "react-router-dom";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { LangLayout } from "./pages/LangLayout";
import { NotePage } from "./pages/NotePage";
import { NotesPage } from "./pages/NotesPage";
import { NowPage } from "./pages/NowPage";
import { WorkPage } from "./pages/WorkPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/es" replace />} />
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<HomePage />} />
        <Route path="now" element={<NowPage />} />
        <Route path="notas" element={<NotesPage />} />
        <Route path="notas/:slug" element={<NotePage />} />
        <Route path="trabajo" element={<WorkPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="*" element={<Navigate to=".." replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/es" replace />} />
    </Routes>
  );
}
