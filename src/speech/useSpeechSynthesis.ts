/**
 * React Hook for Article / Text-to-Speech (TTS)
 */
import { useState, useEffect, useCallback } from 'react';
import { speechSynthesisService, SpeechPlaybackState } from './speechSynthesisService';

export function useSpeechSynthesis() {
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>(speechSynthesisService.getState());
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [rate, setRateState] = useState<number>(speechSynthesisService.getRate());
  const [isSupported] = useState<boolean>(speechSynthesisService.isSupported());

  useEffect(() => {
    const unsubscribeState = speechSynthesisService.subscribeState((newState, chunkIdx, total) => {
      setPlaybackState(newState);
      setActiveChunkIndex(chunkIdx);
      setTotalChunks(total);
    });

    const unsubscribeVoices = speechSynthesisService.subscribeVoicesLoaded(() => {
      // Refresh component if needed on voices loaded
    });

    return () => {
      unsubscribeState();
      unsubscribeVoices();
    };
  }, []);

  const speakArticle = useCallback((title: string, summary?: string, content?: string) => {
    speechSynthesisService.speakArticle(title, summary, content);
  }, []);

  const speakText = useCallback((text: string) => {
    speechSynthesisService.speakText(text);
  }, []);

  const pause = useCallback(() => {
    speechSynthesisService.pause();
  }, []);

  const resume = useCallback(() => {
    speechSynthesisService.resume();
  }, []);

  const stop = useCallback(() => {
    speechSynthesisService.stop();
  }, []);

  const changeRate = useCallback((newRate: number) => {
    setRateState(newRate);
    speechSynthesisService.setRate(newRate);
  }, []);

  return {
    isSupported,
    playbackState,
    isPlaying: playbackState === 'playing',
    isPaused: playbackState === 'paused',
    activeChunkIndex,
    totalChunks,
    rate,
    speakArticle,
    speakText,
    pause,
    resume,
    stop,
    changeRate
  };
}
