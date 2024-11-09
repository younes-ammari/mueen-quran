import React from "react";
import CanvasView from "./components/CanvasView";
import FloatingTitle from "./components/FloatingTitle";
import "./App.css";
import { RecitationProvider, useRecitation } from "./utils/context/RecitationContext";
import FloatingResult from "./components/FloatingResult";

// Navigation buttons component
function NavigationButtons() {
  const { goToNext, goToPrevious } = useRecitation();

  return (
    <div className="navigation-buttons">
      <button onClick={goToPrevious} className="nav-button prev-button">
        Previous
      </button>
      <button onClick={goToNext} className="nav-button next-button">
        Next
      </button>
    </div>
  );
}

function App() {
  return (
    <RecitationProvider>
      <div className="app-wrapper">
        <FloatingTitle />
        <CanvasView />
        <NavigationButtons />
      </div>
    </RecitationProvider>
  );
}

export default App;
