import React, { useCallback, useEffect, useState } from "react";
import FloatingChat from "./FloatingChat";
import { useRecitation } from "../utils/context/RecitationContext";

export default function FloatingResult({ userText }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const { processedMessages } = useRecitation();

  // Cycle through messages
  useEffect(() => {
    console.log("processedMessages CHANGED");
    if (processedMessages.length === 0) return;

    // Reset current message when new messages arrive
    setCurrentMessage(0);

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % processedMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [processedMessages]);

  const correctText = "الحمد لله رب العالمين";

  // Compare texts component with memoization
  const CompareTexts = useCallback(
    ({ correct, user }) => {
      // Split texts into words and ensure proper string handling
      const correctWords = String(correct).split(" ");
      const userWords = String(user).split(" ");

      // Find the maximum length to handle extra words in user input
      const maxLength = Math.max(correctWords.length, userWords.length);

      return (
        <div lang="ar" style={{ direction: "rtl" }}>
          {Array.from({ length: maxLength }).map((_, wordIndex) => {
            const correctWord = correctWords[wordIndex] || "";
            const userWord = userWords[wordIndex] || "";

            // Determine word status
            const wordStatus = !correctWord
              ? "extra-word"
              : !userWord
              ? "missing-word"
              : correctWord === userWord
              ? "correct-word"
              : "wrong-word";

            return (
              <React.Fragment key={wordIndex}>
                <span className={wordStatus}>
                  {(correctWord || userWord)
                    .split("")
                    .map((letter, letterIndex) => {
                      const correctLetter = correctWord[letterIndex] || "";
                      const userLetter = userWord[letterIndex] || "";

                      // Determine letter status
                      const letterStatus = !correctLetter
                        ? "extra-letter"
                        : !userLetter
                        ? "missing-letter"
                        : correctLetter === userLetter
                        ? "correct-letter"
                        : "wrong-letter";

                      return (
                        <span key={letterIndex} className={letterStatus}>
                          {correctWord ? correctLetter : userLetter}
                        </span>
                      );
                    })}
                </span>
                {wordIndex < maxLength - 1 && " "}
              </React.Fragment>
            );
          })}
        </div>
      );
    },
    [userText]
  );

  const SubtitleDisplay = useCallback(() => {
    console.log("SubtitleDisplay CHANGED", processedMessages);
    if (!processedMessages || processedMessages.length === 0) {
      return <p className="result" dir="rtl"></p>;
    }
    return (
      <p className="result" dir="rtl">
        {processedMessages[currentMessage % processedMessages.length]}
      </p>
    );
  }, [processedMessages, currentMessage]);

  // User text component with proper comparison
  const UserTextDisplay = useCallback(() => {
    return <CompareTexts correct={correctText} user={userText || ""} />;
  }, [userText, correctText, CompareTexts]);
  // const UserTextDisplay = useCallback(() => {
  //   return <p>
  //     {userText || ""}
  //   </p>;
  // }, [userText]);

  return (
    <div className="floating-result">
      <div className="text-comparison">
        <div className="comparison-row">
          <div className="text">
            <UserTextDisplay />
          </div>
        </div>
      </div>
      <div className="result-container">
        <SubtitleDisplay />
      </div>
    </div>
  );
}
