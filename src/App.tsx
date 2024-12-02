import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import LevelSelection from "./components/LevelSelection";
import QuestionScreen from "./components/QuestionScreen";
import FinalScreen from "./components/FinalScreen";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FinalScreen />} />
                <Route path="/levels" element={<WelcomeScreen />} />
                <Route path="/questions" element={<QuestionScreen />} />
                <Route path="/final" element={<LevelSelection />} />
            </Routes>
        </Router>
    );
};

export default App;
