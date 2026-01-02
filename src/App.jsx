import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
 
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
