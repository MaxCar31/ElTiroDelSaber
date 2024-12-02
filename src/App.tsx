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
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/levels" element={<LevelSelection />} />
                <Route path="/questions" element={<QuestionScreen />} />
                <Route path="/final" element={<FinalScreen />} />
            </Routes>
        </Router>
    );
};

export default App;
