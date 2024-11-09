import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import splitMessageIntoChunks from "../functions/splitMessageIntoChunks";

// Create context with undefined initial value
const RecitationContext = createContext({
  userText: "",
  setUserText: (text) => {},
  processedMessages: [],
  setProcessedMessages: (messages = []) => {},
  currentIndex: 0,
  goToNext: () => {},
  goToPrevious: () => {},
});

export function RecitationProvider({ children }) {
  // Initialize state with default values
  const [userText, setUserText] = useState("");
  const [processedMessages, setProcessedMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add a handler for updating user text
  const handleSetUserText = (text) => {
    setUserText(text);
  };

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch("YOUR_API_ENDPOINT");
      const data = await response.json();

      const chunkedMessages = data.flatMap((item) =>
        splitMessageIntoChunks(item.message)
      );
      setProcessedMessages(chunkedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // setProcessedMessages([
      //   "السلام عليكم، أنا معين",
      //   "مساعدك الذكي للقرآن",
      // ]);
      setProcessedMessages([]);
    }
  }, []);

  // Fetch messages only once when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  // Add navigation handlers
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Only increment if we're not at the end of the messages
      if (prevIndex < processedMessages.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [processedMessages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Only decrement if we're not at the beginning
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, []);

  // Update the context value to include navigation
  const contextValue = {
    userText,
    setUserText: handleSetUserText,
    handleSetUserText,
    processedMessages,
    setProcessedMessages,
    currentIndex,
    goToNext,
    goToPrevious,
  };

  return (
    <RecitationContext.Provider value={contextValue}>
      {children}
    </RecitationContext.Provider>
  );
}

export function useRecitation() {
  const context = useContext(RecitationContext);
  if (!context) {
    throw new Error("useRecitation must be used within a RecitationProvider");
  }
  return context;
}
