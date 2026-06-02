import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
