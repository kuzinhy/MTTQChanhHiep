/**
 * Dual-Engine Text-to-Speech (TTS) Service for Vietnamese
 * 1. Web Speech API (if native vi-VN voice exists)
 * 2. Google Translate Vietnamese Audio Fallback (100% Natural Vietnamese on all devices)
 */
import { speechController } from './speechController';

export type SpeechPlaybackState = 'idle' | 'playing' | 'paused' | 'stopped' | 'completed' | 'error';

/**
 * Expands common Vietnamese administrative abbreviations for natural speech.
 */
export function expandVietnameseAbbreviations(text: string): string {
  if (!text) return '';
  return text
    .replace(/\bTP\.\s*Hồ Chí Minh\b/gi, 'Thành phố Hồ Chí Minh')
    .replace(/\bTP\.HCM\b/gi, 'Thành phố Hồ Chí Minh')
    .replace(/\bUBND\b/g, 'Ủy ban nhân dân')
    .replace(/\bHĐND\b/g, 'Hội đồng nhân dân')
    .replace(/\bMTTQ\b/g, 'Mặt trận Tổ quốc')
    .replace(/\bBCH\b/g, 'Ban chấp hành')
    .replace(/\bTW\b/g, 'Trung ương')
    .replace(/\bKP\b/g, 'Khu phố')
    .replace(/\bP\.\s*/g, 'Phường ')
    .replace(/\bQ\.\s*/g, 'Quận ')
    .replace(/\bTX\.\s*/g, 'Thị xã ')
    .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, 'ngày $1 tháng $2 năm $3');
}

/**
 * Strips HTML tags, metadata, URLs, and cleans text specifically for Vietnamese speech synthesis.
 */
export function sanitizeTextForSpeech(rawHtmlOrText: string): string {
  if (!rawHtmlOrText) return '';

  let cleaned = rawHtmlOrText;

  // 1. Remove HTML script and style tags completely
  cleaned = cleaned.replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '');

  // 2. Remove all HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // 3. Decode HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, 'và')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&hellip;/gi, '...');

  // 4. Remove long URLs
  cleaned = cleaned.replace(/(https?:\/\/[^\s]+)/gi, '');

  // 5. Remove markdown formatting
  cleaned = cleaned.replace(/[*_~`#|[\]()]/g, ' ');

  // 6. Expand abbreviations
  cleaned = expandVietnameseAbbreviations(cleaned);

  // 7. Normalize punctuation & whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Splits article text into manageable chunks (~160 chars) for smooth speech playback.
 */
export function chunkTextForSpeech(text: string, maxChunkLength = 160): string[] {
  if (!text) return [];

  const sentences = text.split(/(?<=[.!?;\n])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((currentChunk + ' ' + trimmed).length <= maxChunkLength) {
      currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      if (trimmed.length > maxChunkLength) {
        const subParts = trimmed.split(/(?<=[,:-])\s+/);
        let subChunk = '';
        for (const part of subParts) {
          if ((subChunk + ' ' + part).length <= maxChunkLength) {
            subChunk = subChunk ? `${subChunk} ${part}` : part;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = part;
          }
        }
        if (subChunk) chunks.push(subChunk);
        currentChunk = '';
      } else {
        currentChunk = trimmed;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private audioPlayer: HTMLAudioElement | null = null;
  private useGoogleAudioFallback = false;

  private currentChunks: string[] = [];
  private currentChunkIndex = 0;
  private rate = 1.0;
  private state: SpeechPlaybackState = 'idle';

  private stateListeners: Set<(state: SpeechPlaybackState, activeIndex: number, totalChunks: number) => void> = new Set();
  private voicesLoadedListeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initVoices();

        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.initVoices();
        }
      }

      try {
        const savedRate = localStorage.getItem('mttq_speech_rate');
        if (savedRate) {
          const parsed = parseFloat(savedRate);
          if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
            this.rate = parsed;
          }
        }
      } catch (e) {
        // Ignore localStorage error
      }

      speechController.registerTTSStop(() => this.stop());
    }
  }

  public isSupported(): boolean {
    return true; // Supported either via WebSpeech or HTML5 Google Audio TTS fallback
  }

  private initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    this.selectedVoice = this.getBestVietnameseVoice();
    this.useGoogleAudioFallback = !this.selectedVoice;
    this.voicesLoadedListeners.forEach(listener => listener());
  }

  public getBestVietnameseVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) return null;

    // 1. Look for exact vi-VN or vi_VN match
    const exactViVn = this.voices.find(v => 
      v.lang === 'vi-VN' || 
      v.lang === 'vi_VN' || 
      v.name.toLowerCase().includes('vietnamese') ||
      v.name.toLowerCase().includes('tiếng việt') ||
      v.name.toLowerCase().includes('hoaimy') ||
      v.name.toLowerCase().includes('namminh')
    );
    if (exactViVn) return exactViVn;

    // 2. Any voice with lang starting with 'vi'
    const anyVi = this.voices.find(v => v.lang.toLowerCase().startsWith('vi'));
    if (anyVi) return anyVi;

    return null; // Return null if no true Vietnamese voice is installed
  }

  public getRate(): number {
    return this.rate;
  }

  public setRate(newRate: number) {
    this.rate = newRate;
    try {
      localStorage.setItem('mttq_speech_rate', newRate.toString());
    } catch (e) {
      // Ignore
    }

    if (this.audioPlayer) {
      this.audioPlayer.playbackRate = newRate;
    }

    if (this.state === 'playing') {
      const savedIndex = this.currentChunkIndex;
      const savedChunks = [...this.currentChunks];
      this.stopCurrentEngine();
      this.currentChunks = savedChunks;
      this.currentChunkIndex = savedIndex;
      this.updateState('playing');
      this.speakCurrentChunk();
    }
  }

  public subscribeState(listener: (state: SpeechPlaybackState, activeIndex: number, totalChunks: number) => void) {
    this.stateListeners.add(listener);
    listener(this.state, this.currentChunkIndex, this.currentChunks.length);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public subscribeVoicesLoaded(listener: () => void) {
    this.voicesLoadedListeners.add(listener);
    return () => {
      this.voicesLoadedListeners.delete(listener);
    };
  }

  private updateState(newState: SpeechPlaybackState) {
    this.state = newState;
    this.stateListeners.forEach(listener => listener(this.state, this.currentChunkIndex, this.currentChunks.length));
  }

  public speakArticle(title: string, summary?: string, content?: string) {
    speechController.requestStartTTS();
    this.stopCurrentEngine();

    const cleanTitle = sanitizeTextForSpeech(title);
    const cleanSummary = summary ? sanitizeTextForSpeech(summary) : '';
    const cleanContent = content ? sanitizeTextForSpeech(content) : '';

    const fullArticleText = [
      cleanTitle ? `Bài viết: ${cleanTitle}.` : '',
      cleanSummary ? `Tóm tắt: ${cleanSummary}.` : '',
      cleanContent ? `Nội dung: ${cleanContent}` : ''
    ].filter(Boolean).join(' ');

    if (!fullArticleText.trim()) {
      this.updateState('completed');
      return;
    }

    this.currentChunks = chunkTextForSpeech(fullArticleText, 160);
    this.currentChunkIndex = 0;

    if (this.currentChunks.length === 0) {
      this.updateState('completed');
      return;
    }

    this.updateState('playing');
    this.speakCurrentChunk();
  }

  public speakText(text: string) {
    speechController.requestStartTTS();
    this.stopCurrentEngine();

    const cleaned = sanitizeTextForSpeech(text);
    if (!cleaned) return;

    this.currentChunks = chunkTextForSpeech(cleaned, 160);
    this.currentChunkIndex = 0;
    this.updateState('playing');
    this.speakCurrentChunk();
  }

  private speakCurrentChunk() {
    if (this.currentChunkIndex >= this.currentChunks.length) {
      this.updateState('completed');
      return;
    }

    const chunkText = this.currentChunks[this.currentChunkIndex];

    // Refresh voice selection in case voices loaded late
    const bestVoice = this.selectedVoice || this.getBestVietnameseVoice();

    if (bestVoice && this.synth) {
      // Use Web Speech API with explicit Vietnamese Voice
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang || 'vi-VN';
      utterance.rate = this.rate;

      utterance.onend = () => {
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.currentChunks.length && this.state === 'playing') {
          this.speakCurrentChunk();
        } else {
          this.updateState('completed');
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        // Fallback to Google Audio if Web Speech errors out
        this.speakWithGoogleAudio(chunkText);
      };

      this.synth.speak(utterance);
    } else {
      // Fallback: Google Translate Vietnamese TTS Audio Stream
      this.speakWithGoogleAudio(chunkText);
    }
  }

  private speakWithGoogleAudio(chunkText: string) {
    try {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      }

      const encodedText = encodeURIComponent(chunkText);
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodedText}`;

      const audio = new Audio(googleTtsUrl);
      audio.playbackRate = this.rate;

      audio.onended = () => {
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.currentChunks.length && this.state === 'playing') {
          this.speakCurrentChunk();
        } else {
          this.updateState('completed');
        }
      };

      audio.onerror = () => {
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.currentChunks.length && this.state === 'playing') {
          this.speakCurrentChunk();
        } else {
          this.updateState('completed');
        }
      };

      this.audioPlayer = audio;
      audio.play().catch(() => {
        // Handle autoplay policy block if user didn't interact
        this.updateState('paused');
      });
    } catch (e) {
      this.updateState('completed');
    }
  }

  public pause() {
    if (this.state === 'playing') {
      if (this.synth) this.synth.pause();
      if (this.audioPlayer) this.audioPlayer.pause();
      this.updateState('paused');
    }
  }

  public resume() {
    if (this.state === 'paused') {
      this.updateState('playing');
      if (this.audioPlayer) {
        this.audioPlayer.play().catch(() => {});
      } else if (this.synth) {
        this.synth.resume();
      } else {
        this.speakCurrentChunk();
      }
    } else if (this.state === 'stopped' || this.state === 'completed' || this.state === 'idle') {
      if (this.currentChunks.length > 0) {
        this.currentChunkIndex = 0;
        this.updateState('playing');
        this.speakCurrentChunk();
      }
    }
  }

  private stopCurrentEngine() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (this.audioPlayer) {
      try {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      } catch (e) {}
    }
  }

  public stop() {
    this.stopCurrentEngine();
    this.currentChunks = [];
    this.currentChunkIndex = 0;
    this.updateState('stopped');
  }

  public getState(): SpeechPlaybackState {
    return this.state;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
