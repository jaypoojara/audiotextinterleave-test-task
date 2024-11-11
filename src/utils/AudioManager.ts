import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface CallBack {
  status: string;
  data?: {
    currentPosition: number;
    duration?: number;
    currentMetering?: number;
  };
}

class AudioPlayerManager {
  audioRecorderPlayer: AudioRecorderPlayer | undefined;
  currentPath: string | undefined;
  currentPosition: number;
  currentPlayerCallback: ({status, data}: CallBack) => void;

  constructor() {
    this.audioRecorderPlayer = undefined;
    this.currentPath = undefined;
    this.currentPosition = 0;
    this.currentPlayerCallback = () => {};
  }

  AUDIO_STATUS = {
    play: 'play',
    beginPlayer: 'begin_player',
    pausePlayer: 'pause_player',
    resumePlayer: 'resume_player',
    stopPlayer: 'stop_player',
  };

  async startPlayer(
    path: string,
    callback: ({status, data}: CallBack) => void,
  ) {
    if (this.currentPath === undefined) {
      this.currentPath = path;
      this.currentPlayerCallback = callback;
    } else if (this.currentPath !== path) {
      if (this.audioRecorderPlayer !== undefined) {
        await this.stopPlayer();
      }
      this.currentPath = path;
      this.currentPlayerCallback = callback;
    }

    if (this.audioRecorderPlayer === undefined) {
      this.audioRecorderPlayer = new AudioRecorderPlayer();
      this.audioRecorderPlayer.setSubscriptionDuration(0.1);
    }

    try {
      await this.audioRecorderPlayer.startPlayer(path);

      this.audioRecorderPlayer.addPlayBackListener(async e => {
        if (e.currentPosition === e.duration) {
          await this.stopPlayer();
        } else {
          this.currentPosition = e.currentPosition;
          this.currentPlayerCallback({
            status: this.AUDIO_STATUS.play,
            data: e,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async pausePlayer() {
    try {
      await this.audioRecorderPlayer?.pausePlayer();
      setTimeout(() => {
        this.currentPlayerCallback({
          status: this.AUDIO_STATUS.pausePlayer,
        });
      }, 150);
    } catch (error) {
      console.error(error);
    }
  }

  async resumePlayer() {
    try {
      await this.audioRecorderPlayer?.resumePlayer();
      this.currentPlayerCallback({
        status: this.AUDIO_STATUS.resumePlayer,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async seekToPlayer(time: number) {
    try {
      if (this.audioRecorderPlayer) {
        await this.audioRecorderPlayer.seekToPlayer(time);
        this.currentPosition = time;
        this.currentPlayerCallback({
          status: this.AUDIO_STATUS.play,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async stopPlayer() {
    await this.audioRecorderPlayer?.stopPlayer();

    this.audioRecorderPlayer?.removePlayBackListener();
    this.currentPosition = 0;
    this.currentPlayerCallback({
      status: this.AUDIO_STATUS.stopPlayer,
    });
  }
}

const audioPlayerManager = new AudioPlayerManager();
export default audioPlayerManager;
