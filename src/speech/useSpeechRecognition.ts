/**
 * React Hook for Voice Input (STT - Speech-to-Text)
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  speechRecognitionService, 
  RecognitionState, 
  RecognitionError 
} from './speechRecognitionService';

export function useSpeechRecognition() {
  const [state, setState] = useState<RecognitionState>('idle');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<RecognitionError | null>(null);
  const [isSupported] = useState<boolean>(speechRecognitionService.isSupported());

  useEffect(() => {
    const unsubscribe = speechRecognitionService.subscribe((data) => {
      setState(data.state);
      setFinalTranscript(data.finalTranscript);
      setInterimTranscript(data.interimTranscript);
      setError(data.error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const startListening = useCallback(() => {
    speechRecognitionService.startListening();
  }, []);

  const stopListening = useCallback(() => {
    speechRecognitionService.stopListening();
  }, []);

  const abortListening = useCallback(() => {
    speechRecognitionService.abortListening();
  }, []);

  const resetTranscripts = useCallback(() => {
    speechRecognitionService.resetTranscripts();
  }, []);

  return {
    isSupported,
    state,
    isListening: state === 'listening',
    finalTranscript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    abortListening,
    resetTranscripts
  };
}
