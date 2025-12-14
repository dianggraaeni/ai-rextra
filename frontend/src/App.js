import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StartTest from "./pages/StartTest"; // <-- Import halaman baru
import RiasecTest from "./pages/RiasecTest";
import IkigaiTest from "./pages/IkigaiTest";
import SelfExplore from "./pages/SelfExplore";
import CvMaker from "./pages/CvMaker";
import CombinedResults from "./pages/CombinedResults";
import FeedbackForm from "./pages/FeedbackForm";
import ResultPage from "./pages/ResultPage"; // <-- Import halaman baru
import ThankYou from "./pages/ThankYou"; // <-- Import halaman terima kasih

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/start-test" element={<StartTest />} /> {/* <-- Rute baru */}
        <Route path="/test-riasec" element={<RiasecTest />} />
        <Route path="/test-ikigai" element={<IkigaiTest />} />
        <Route path="/assessment" element={<IkigaiTest />} />
        <Route path="/results" element={<CombinedResults />} />
        <Route path="/self-explore" element={<SelfExplore />} />
        <Route path="/cv-maker" element={<CvMaker />} />
        <Route path="/test-result" element={<CombinedResults />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/result/:hash" element={<ResultPage />} /> {/* <-- Rute baru */}
        <Route path="/thank-you" element={<ThankYou />} /> {/* <-- Rute halaman terima kasih */}
      </Routes>
    </Router>
  );
}

export default App;
