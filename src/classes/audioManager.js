import sound2 from "../../static/Audio/sound2.mp3"
import sound1 from "../../static/Audio/sound1.mp3"

export default class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.AudioContext)();
        this.sounds = {
            sound1: new Audio(sound1),
            sound2: new Audio(sound2),
        };

        // Set up event listener to resume audio context
        document.getElementById('startAudio')?.addEventListener('click', () => {
            this.resumeAudioContext();
            this.playAudio();
        });
    }

    resumeAudioContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed');
            }).catch(err => {
                console.error('Error resuming AudioContext:', err);
            });
        }
    }

    playAudio() {
        Object.values(this.sounds).forEach(audio => {
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(err => {
                console.error('Error playing audio:', err);
            });
        });
    }

    pauseAudio() {
        Object.values(this.sounds).forEach(audio => {
            audio.pause();
        });
    }

    setVolume1(volume) {
        if (this.sounds.sound1) this.sounds.sound1.volume = volume;
    }

    setVolume2(volume) {
        if (this.sounds.sound2) this.sounds.sound2.volume = volume;
    }
}
