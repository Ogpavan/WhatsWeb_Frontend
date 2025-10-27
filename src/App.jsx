import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Connect from "./pages/Connect";
import Campaigns from "./pages/Campaigns";
import NotFound from "./pages/NotFound";
// ...import other pages...

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/connect" />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/campaigns" element={<Campaigns />} />
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

