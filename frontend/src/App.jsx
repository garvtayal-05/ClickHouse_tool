// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClickHouseToFlatFile from "./pages/ClickHouseToFlatFile";
import FlatFileToClickHouse from "./pages/FlatFileToClickHouse";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clickhouse-to-flatfile" element={<ClickHouseToFlatFile />} />
      <Route path="/flatfile-to-clickhouse" element={<FlatFileToClickHouse />} />
    </Routes>
  );
}

export default App;