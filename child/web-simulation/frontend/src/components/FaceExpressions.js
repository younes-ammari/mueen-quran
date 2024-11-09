import { Html } from "@react-three/drei";
import React, { useState, useEffect, useRef } from "react";
import { apiUrl } from "../configs";
import { useRecitation } from "../utils/context/RecitationContext";

export default function FaceExpressions({ isTalking: initialTalking = false }) {
  // Add internal talking state
  const [isTalking, setIsTalking] = useState(initialTalking);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Recitation context
  const { handleSetUserText, userText, processedMessages, setProcessedMessages } = useRecitation();

  // Add recording state and refs
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Add toggle handler
  const handleToggleTalking = () => {
    setIsTalking((prev) => !prev);
  };

  // Effect to animate mouth when talking
  useEffect(() => {
    if (!isTalking) {
      setMouthOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 300); // Slightly slower for more natural movement

    return () => clearInterval(interval);
  }, [isTalking]);

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Add state to track if audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  const currentAudioRef = useRef(null);

  // Effect to handle message queue
  useEffect(() => {
    if (processedMessages.length > 0 && !isPlaying) {
      const text = processedMessages.join(' ');
      console.log("Starting speech for:", text);
      triggerSpeak(text);
    }
  }, [processedMessages, isPlaying]);

  const triggerSpeak = async (text) => {
    try {
      // Prevent multiple audio playbacks
      if (isPlaying) {
        console.log("Already playing, skipping...");
        return;
      }

      setIsLoading(true);
      setIsPlaying(true);
      setIsTalking(true);

      // Stop any existing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const response = await fetch(`${apiUrl}/generate-speech/?text=${encodeURIComponent(text)}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const { file_name } = await response.json();
      const audioResponse = await fetch(`${apiUrl}/speech/${file_name}`);
      
      if (!audioResponse.ok) throw new Error('Failed to fetch audio file');

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsTalking(false);
        setIsLoading(false);
        setIsPlaying(false);
        currentAudioRef.current = null;
        
        // Clear messages after completion
        setTimeout(() => {
          setProcessedMessages([]);
        }, 500);
      };

      audio.onerror = () => {
        console.error('Error playing audio');
        setIsTalking(false);
        setIsLoading(false);
        setIsPlaying(false);
        setProcessedMessages([]);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error('Error in triggerSpeak:', error);
      setIsTalking(false);
      setIsLoading(false);
      setIsPlaying(false);
      setProcessedMessages([]);
      currentAudioRef.current = null;
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Function to handle recording toggle
  const handleToggleRecording = async () => {
    // Test message simulation
    const messages = [
      "السلام عليكم أنا معين",
      "الروبوت الفريد من نوعه في تعلم القرآن الكريم",
    ];
    
    // Stop any existing audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Reset states in correct order
    setIsPlaying(false);
    setIsTalking(false);
    setIsLoading(false);
    
    // Set new messages after a small delay to ensure states are reset
    // setTimeout(() => {
    //   setProcessedMessages(messages);
    // }, 100);

    // return;
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Create new MediaRecorder instance
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        // Handle data available event
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // Handle recording stop event
        mediaRecorder.onstop = async () => {
          try {
            // Create audio blob from chunks
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });

            // Create FormData and properly append file and ayat
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.wav"); // Add filename
            // formData.append('ayat', "انا اعطيناك الكوثر");
            formData.append("ayat", "1");

            // Make API call with FormData
            const response = await fetch(`${apiUrl}/transcribe-audio/`, {
              method: "POST",
              body: formData, // Send formData instead of body object
            });
            console.log("formData:", formData);

            const data = await response.json();
            console.log("Transcription response:", data);

            // Update the userText in context with the transcribed text
            if (data.transcription) {
              const editedData = data.transcription.replace(/\n/g, " ").trim();
              console.log("editedData", editedData);
              handleSetUserText(editedData);
              setIsTalking(true);
            }
            // Clear chunks and stop tracks
            audioChunksRef.current = [];
            stream.getTracks().forEach((track) => track.stop());
          } catch (error) {
            console.error("Error processing audio:", error);
            setIsTalking(false);
          }
        };

        // Start recording
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  return (
    <>
      <Html
        position={[2.23, 2.74, -0.725]}
        transform
        scale={0.062}
        rotation={[0.0, -29.88, -0.00]}
        center
        zIndexRange={[2, 0]}
        
      // position={[2.28, 2.255, -0.728]}
      // transform
      // scale={0.062}
      // rotation={[0.0, -29.88, 0.2]}
      // center
      // zIndexRange={[1, 0]}
      >
        <div className="face-expressions-container">
          {/* Add toggle button */}
          {/* <button
            onClick={handleToggleTalking}
            className="toggle-talking-btn"
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "5px 10px",
              borderRadius: "4px",
              background: "#333",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isTalking ? "Stop Talking" : "Start Talking"}
          </button> */}

          {/* Add recording button */}
          <button
            onClick={handleToggleRecording}
            className="toggle-recording-btn"
            disabled={isLoading}
            style={{
              position: "absolute",
              top: "-60px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "5px 10px",
              borderRadius: "4px",
              background: isRecording ? "#ff4444" : isLoading ? "#999" : "#333",
              color: "white",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading
              ? "Loading..."
              : isRecording
              ? "Stop Recording"
              : "Start Recording"}
          </button>

          {/* Eyes */}
          <div className="face-expressions">
            <div className="face-container">
              <div className="eyes">
                <div className="eye" />
                <div className="eye" />
              </div>
              <div className="mouth-container">
                <div className={`mouth ${mouthOpen ? "talking" : ""}`} />
              </div>
            </div>
          </div>
          {/* Mouth */}
        </div>
      </Html>
    </>
  );
}
