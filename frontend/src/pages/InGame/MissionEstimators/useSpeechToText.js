import React, { useState, useEffect } from 'react';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const useSpeechToText = duration => {
  const [listening, setListening] = useState(false);
  const { transcript, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.warn('Browser dose not support speech recognition.');
      return;
    }
    SpeechRecognition.startListening({ continuous: true });
    setListening(true);

    const timer = setTimeout(() => {
      SpeechRecognition.stopListening();
      setListening(false);
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration]);

  const reset = () => {
    setTranscript('');
  };

  const stop = status => {
    setListening(status);
  };

  return { transcript, listening, reset, stop };
};

export default useSpeechToText;
