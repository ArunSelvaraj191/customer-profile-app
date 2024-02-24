import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/" />
    </Routes>
  );
}

export default App;
