import React, { useEffect, useState } from "react";
import FloatingChat from "./FloatingChat";

export default function FloatingResult() {
  // Sample messages - replace with your actual messages
  const messages = [
    "السلام عليكم، أنا معين، مساعدك الذكي للقرآن",
    "كيف يمكنني مساعدتك اليوم؟",
    "يمكنني الإجابة على الأسئلة حول القرآن",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const correctText = "الحمد لله رب العالمين";
  const userText = "الحمد رب  العالمين";

  const compareTexts = (correct, user) => {
    // Split texts into words
    const correctWords = correct.split(' ');
    const userWords = user.split(' ');
    
    const compareCharacters = (correctWord, userWord) => {
      const correctChars = [...correctWord];
      const userChars = [...userWord];
      const result = [];
      
      let i = 0;
      let j = 0;
      
      while (i < correctChars.length || j < userChars.length) {
        if (i >= correctChars.length) {
          // Extra characters in user input
          result.push({
            char: userChars[j],
            status: 'extra',
            key: `extra-${j}`
          });
          j++;
        } else if (j >= userChars.length) {
          // Missing characters from user input
          result.push({
            char: correctChars[i],
            status: 'missing',
            key: `missing-${i}`
          });
          i++;
        } else if (correctChars[i] === userChars[j]) {
          // Matching characters
          result.push({
            char: correctChars[i],
            status: 'correct',
            key: `correct-${i}`
          });
          i++;
          j++;
        } else {
          // Wrong character
          result.push({
            char: correctChars[i],
            userChar: userChars[j],
            status: 'wrong',
            key: `wrong-${i}`
          });
          i++;
          j++;
        }
      }
      
      return result;
    };

    return (
      <div lang="ar" style={{ direction: 'rtl' }}>
        {correctWords.map((word, wordIndex) => {
          const userWord = userWords[wordIndex] || '';
          const charComparison = compareCharacters(word, userWord);
          
          return (
            <React.Fragment key={wordIndex}>
              <span className="word">
                {charComparison.map((result) => {
                  switch (result.status) {
                    case 'correct':
                      return <span key={result.key} className="correct-char">{result.char}</span>;
                    case 'wrong':
                      return (
                        <span key={result.key} className="wrong-char" title={`Correct: ${result.char}, Your input: ${result.userChar}`}>
                          {result.char}
                        </span>
                      );
                    case 'missing':
                      return <span key={result.key} className="missing-char">{result.char}</span>;
                    case 'extra':
                      return <span key={result.key} className="extra-char">{result.char}</span>;
                    default:
                      return null;
                  }
                })}
              </span>
              {/* Add space between words, except for last word */}
              {wordIndex < correctWords.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="floating-result">
      <div className="text-comparison">
        {/* <div className="comparison-row">
          <span className="label">النص الصحيح:</span>
          <div className="text">{correctText}</div>
        </div> */}
        <div className="comparison-row">
          {/* <span className="label">نصك:</span> */}
          <div className="text">{compareTexts(correctText, userText)}</div>
        </div>
      </div>
    </div>
  );
}
