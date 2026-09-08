/**
 * Single Speech Controller to coordinate Speech Synthesis (TTS) and Speech Recognition (STT).
 * Prevents mutual audio interference (speaker playback feed into microphone input).
 */

type StopHandler = () => void;

class SpeechController {
  private activeTTSStopHandler: StopHandler | null = null;
  private activeSTTStopHandler: StopHandler | null = null;

  registerTTSStop(handler: StopHandler) {
    this.activeTTSStopHandler = handler;
  }

  registerSTTStop(handler: StopHandler) {
    this.activeSTTStopHandler = handler;
  }

  /**
   * Called before starting Speech Recognition (Microphone).
   * Ensures all Speech Synthesis (Speaker) is completely cancelled.
   */
  requestStartSTT() {
    if (this.activeTTSStopHandler) {
      this.activeTTSStopHandler();
    }
  }

  /**
   * Called before starting Speech Synthesis (Text-to-Speech).
   * Ensures Speech Recognition (Microphone) is completely stopped.
   */
  requestStartTTS() {
    if (this.activeSTTStopHandler) {
      this.activeSTTStopHandler();
    }
  }

  /**
   * Stop everything when navigating away or closing pages.
   */
  stopAll() {
    if (this.activeTTSStopHandler) this.activeTTSStopHandler();
    if (this.activeSTTStopHandler) this.activeSTTStopHandler();
  }
}

export const speechController = new SpeechController();
