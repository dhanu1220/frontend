// import { useState, useEffect, useRef } from 'react';

// const useAudioRecording = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [transcript, setTranscript] = useState('');
//   const [nlpResults, setNlpResults] = useState([]);

//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const streamRef = useRef(null);

//   useEffect(() => {
//     // Request microphone permission on component mount
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: {
//           sampleRate: 16000,
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//         },
//       })
//       .then((stream) => {
//         console.log('Microphone access granted');
//         streamRef.current = stream;
//         setError('');
//       })
//       .catch((err) => {
//         setError('Microphone access denied. Please allow microphone access.');
//         console.error('Microphone error:', err);
//       });

//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const startRecording = () => {
//     if (!streamRef.current) {
//       setError('Microphone not available.');
//       return;
//     }

//     setError('');
//     setTranscript('');
//     setNlpResults([]);
//     audioChunksRef.current = [];

//     try {
//       let mimeType = 'audio/wav';
//       if (!MediaRecorder.isTypeSupported(mimeType)) {
//         mimeType = 'audio/webm;codecs=opus';
//       }

//       const mediaRecorder = new MediaRecorder(streamRef.current, {
//         mimeType: mimeType,
//       });

//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         console.log('Recording stopped');
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//       console.log('Recording started');
//     } catch (err) {
//       setError('Failed to start recording: ' + err.message);
//       console.error('Recording error:', err);
//     }
//   };

//   const stopRecording = async () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//       setIsRecording(false);
//       setIsLoading(true);

//       mediaRecorderRef.current.stop();

//       // Wait for the final data to be available
//       await new Promise((resolve) => {
//         mediaRecorderRef.current.onstop = resolve;
//       });

//       if (audioChunksRef.current.length > 0) {
//         const mimeType = mediaRecorderRef.current.mimeType;
//         const fileExtension = mimeType.includes('wav') ? '.wav' : '.webm';
//         const fileName = `recording${fileExtension}`;

//         const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
//         await sendAudioToServer(audioBlob, fileName);
//       } else {
//         setError('No audio data captured');
//         setIsLoading(false);
//       }
//     }
//   };

//   const sendAudioToServer = async (audioBlob, fileName = 'recording.webm', language = 'en-US') => {
//     try {
//       const formData = new FormData();
//       formData.append('audio', audioBlob, fileName);
//       formData.append('language', language);

//       const response = await fetch('http://localhost:8000/transcribe-audio', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.error) {
//         setError(data.error);
//       } else {
//         setTranscript(data.transcript || '');
//         setNlpResults(data.entities || []);
//       }
//     } catch (error) {
//       setError('Failed to transcribe audio: ' + error.message);
//       console.error('Transcription error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processAudioFile = async (file, language = 'en-US') => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const formData = new FormData();
//       formData.append('audio', file);
//       formData.append('language', language);

//       const response = await fetch('http://localhost:8000/transcribe-audio', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.error) {
//         setError(data.error);
//       } else {
//         setTranscript(data.transcript || '');
//         setNlpResults(data.entities || []);
//       }
//     } catch (error) {
//       setError('Failed to transcribe audio: ' + error.message);
//       console.error('Transcription error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearResults = () => {
//     setTranscript('');
//     setNlpResults([]);
//     setError('');
//   };

//   return {
//     isRecording,
//     isLoading,
//     error,
//     transcript,
//     nlpResults,
//     startRecording,
//     stopRecording,
//     processAudioFile,
//     clearResults,
//   };
// };

// export default useAudioRecording;





import { useState, useEffect, useRef } from 'react';
const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [nlpResults, setNlpResults] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((stream) => {
        console.log('Microphone access granted');
        streamRef.current = stream;
        setError('');
      })
      .catch((err) => {
        setError('Microphone access denied. Please allow microphone access.');
        console.error('Microphone error:', err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) {
      setError('Microphone not available.');
      return;
    }

    setError('');
    setTranscript('');
    setNlpResults([]);
    setDetectedLanguage('');
    setTranslatedText('');
    audioChunksRef.current = [];

    try {
      let mimeType = 'audio/wav';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm;codecs=opus';
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped');
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsRecording(false);
      setIsLoading(true);

      mediaRecorderRef.current.stop();

      await new Promise((resolve) => {
        mediaRecorderRef.current.onstop = resolve;
      });

      if (audioChunksRef.current.length > 0) {
        const mimeType = mediaRecorderRef.current.mimeType;
        const fileExtension = mimeType.includes('wav') ? '.wav' : '.webm';
        const fileName = `recording${fileExtension}`;

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await sendAudioToServer(audioBlob, fileName);
      } else {
        setError('No audio data captured');
        setIsLoading(false);
      }
    }
  };

  const sendAudioToServer = async (audioBlob, fileName = 'recording.webm') => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, fileName);

      const response = await fetch('http://localhost:8000/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTranscript(data.transcript || '');
        setNlpResults(data.entities || []);
        setDetectedLanguage(data.detected_language || '');
        setTranslatedText(data.translated_text || data.transcript);
      }
    } catch (error) {
      setError('Failed to transcribe audio: ' + error.message);
      console.error('Transcription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAudioFile = async (file) => {
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('http://localhost:8000/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTranscript(data.transcript || '');
        setNlpResults(data.entities || []);
        setDetectedLanguage(data.detected_language || '');
        setTranslatedText(data.translated_text || data.transcript);
      }
    } catch (error) {
      setError('Failed to transcribe audio: ' + error.message);
      console.error('Transcription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTranscript('');
    setNlpResults([]);
    setError('');
    setDetectedLanguage('');
    setTranslatedText('');
  };

  return {
    isRecording,
    isLoading,
    error,
    transcript,
    nlpResults,
    detectedLanguage,
    translatedText,
    startRecording,
    stopRecording,
    processAudioFile,
    clearResults,
  };
};

export default useAudioRecording;