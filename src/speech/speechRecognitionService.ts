/**
 * Native Browser Speech Recognition Service (STT - Speech-to-Text)
 * 100% Free, no API keys, no external services.
 */
import { speechController } from './speechController';

export type RecognitionState = 'idle' | 'listening' | 'success' | 'error';

export interface RecognitionError {
  code: string;
  messageVi: string;
}

export type RecognitionCallback = (data: {
  state: RecognitionState;
  finalTranscript: string;
  interimTranscript: string;
  error: RecognitionError | null;
}) => void;

// TypeScript declaration for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private finalTranscript = '';
  private interimTranscript = '';
  private state: RecognitionState = 'idle';
  private currentError: RecognitionError | null = null;
  private listeners: Set<RecognitionCallback> = new Set();
  private userStoppedExplicitly = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Register with global speech controller so TTS stops when STT starts
      speechController.registerSTTStop(() => this.stopListening());
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  private createRecognitionInstance() {
    if (!this.isSupported()) return null;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const instance = new SpeechRecognitionClass();

    instance.lang = 'vi-VN';
    instance.continuous = true;
    instance.interimResults = true;
    instance.maxAlternatives = 1;

    instance.onstart = () => {
      this.isListening = true;
      this.currentError = null;
      this.updateState('listening');
    };

    instance.onresult = (event: any) => {
      let currentFinal = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcript + ' ';
        } else {
          currentInterim += transcript;
        }
      }

      if (currentFinal) {
        this.finalTranscript += currentFinal;
      }
      this.interimTranscript = currentInterim;

      this.notifyListeners();
    };

    instance.onerror = (event: any) => {
      const errorCode = event.error;

      // Ignore normal aborted events caused by explicit user stop
      if (errorCode === 'aborted' && this.userStoppedExplicitly) {
        return;
      }

      const mappedError = this.mapErrorCodeToVietnamese(errorCode);
      this.currentError = mappedError;
      this.isListening = false;
      this.updateState('error');
    };

    instance.onend = () => {
      this.isListening = false;

      // If stopped due to natural silence end (and not explicit stop or error), show success state
      if (this.state === 'listening') {
        this.updateState('success');
      }
    };

    return instance;
  }

  private mapErrorCodeToVietnamese(code: string): RecognitionError {
    switch (code) {
      case 'not-allowed':
      case 'permission-denied':
        return {
          code,
          messageVi: 'Bạn chưa cho phép website sử dụng micro. Bạn vẫn có thể nhập ý kiến bằng bàn phím.'
        };
      case 'audio-capture':
        return {
          code,
          messageVi: 'Không tìm thấy micro trên thiết bị. Bạn vẫn có thể nhập ý kiến bằng bàn phím.'
        };
      case 'no-speech':
        return {
          code,
          messageVi: 'Không nghe thấy giọng nói. Vui lòng thử nói lại hoặc nhập từ bàn phím.'
        };
      case 'network':
        return {
          code,
          messageVi: 'Không thể kết nối dịch vụ nhận dạng giọng nói lúc này. Vui lòng kiểm tra kết nối mạng.'
        };
      case 'service-not-allowed':
        return {
          code,
          messageVi: 'Trình duyệt chưa hỗ trợ dịch vụ giọng nói này.'
        };
      default:
        return {
          code,
          messageVi: 'Không thể nhận dạng giọng nói. Vui lòng thử lại hoặc nhập bằng bàn phím.'
        };
    }
  }

  public subscribe(callback: RecognitionCallback) {
    this.listeners.add(callback);
    callback({
      state: this.state,
      finalTranscript: this.finalTranscript,
      interimTranscript: this.interimTranscript,
      error: this.currentError
    });
    return () => {
      this.listeners.delete(callback);
    };
  }

  private updateState(newState: RecognitionState) {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        state: this.state,
        finalTranscript: this.finalTranscript,
        interimTranscript: this.interimTranscript,
        error: this.currentError
      });
    });
  }

  public startListening() {
    if (!this.isSupported()) {
      this.currentError = {
        code: 'unsupported',
        messageVi: 'Trình duyệt của bạn chưa hỗ trợ nhập bằng giọng nói.'
      };
      this.updateState('error');
      return;
    }

    // Stop any active Text-To-Speech speaker playback first
    speechController.requestStartSTT();

    this.userStoppedExplicitly = false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.currentError = null;

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
    }

    this.recognition = this.createRecognitionInstance();
    if (!this.recognition) return;

    try {
      this.recognition.start();
    } catch (err: any) {
      console.warn('Recognition start error:', err);
      this.currentError = {
        code: 'start-failed',
        messageVi: 'Không thể khởi động micro. Vui lòng bấm thử lại.'
      };
      this.updateState('error');
    }
  }

  public stopListening() {
    this.userStoppedExplicitly = true;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    this.interimTranscript = '';
    if (this.state === 'listening') {
      this.updateState('success');
    }
  }

  public abortListening() {
    this.userStoppedExplicitly = true;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.updateState('idle');
  }

  public resetTranscripts() {
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.currentError = null;
    this.updateState('idle');
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
