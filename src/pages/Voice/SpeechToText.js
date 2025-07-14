import { useState, useEffect, useRef } from 'react';

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [nlpResults, setNlpResults] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    // Request microphone permission on component mount
    navigator.mediaDevices.getUserMedia({ 
      audio: { 
        sampleRate: 16000, 
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      } 
    })
    .then((stream) => {
      console.log('Microphone access granted');
      streamRef.current = stream;
      setError('');
    })
    .catch((err) => {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('error:', err);
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
    audioChunksRef.current = [];

    try {
      // Try to use WAV format first, fall back to WebM if not supported
      let mimeType = 'audio/wav';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: mimeType
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

  const stopRecordingAndSend = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsRecording(false);
      setIsLoading(true);
      
      mediaRecorderRef.current.stop();
      
      // Wait for the final data to be available
      await new Promise(resolve => {
        mediaRecorderRef.current.onstop = resolve;
      });

      if (audioChunksRef.current.length > 0) {
        // Determine the correct MIME type and file extension
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
      formData.append('language', language);

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
      }
    } catch (error) {
      setError('Failed to transcribe audio: ' + error.message);
      console.error('Transcription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Test text for New York and John' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Test API response:', data);
      setNlpResults(data.entities);
      setTranscript('Test text for New York and John');
    } catch (error) {
      setError('Test API failed: ' + error.message);
      console.error('Test API error:', error);
    }
    setIsLoading(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (isRecording) {
      stopRecordingAndSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🎤 Speech Recognition App
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Language
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transcribed Text
          </label>
          <textarea
            value={transcript}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] resize-none"
            placeholder="Your speech will appear here..."
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={isRecording ? stopRecordingAndSend : startRecording}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isLoading}
          >
            {isRecording ? '🛑 Stop & Send' : '🎤 Start Recording'}
          </button>
          
          <button
            onClick={testApi}
            className="py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
            disabled={isLoading}
          >
            🧪 Test API
          </button>
        </div>

        {isLoading && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-gray-600">Processing...</span>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center">
              <div className="animate-pulse bg-red-500 rounded-full h-3 w-3 mr-3"></div>
              <span className="text-green-600 font-medium">🎧 Listening...</span>
            </div>
          </div>
        )}

        {nlpResults.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              📋 Named Entities:
            </h2>
            <div className="space-y-2">
              {nlpResults.map((entity, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                  <span className="text-gray-700 font-medium">{entity.text}</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {entity.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;