import { BrowserRouter, Route, Routes } from "react-router-dom";
import VerificationCode from "./pages/VerificationCode";
import Success from "./pages/Success";

function App() {
  return (
    <>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerificationCode />} />
          <Route path="/success" element={<Success />} />
        </Routes>{" "}
      </BrowserRouter>
    </>
  );
}

export default App;
