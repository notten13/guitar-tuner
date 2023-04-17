document.addEventListener('alpine:init', () => {
  const audioContext = new AudioContext();

  const presets = {
    guitarStandard: [
      { note: 'E2', label: 'E', frequency: 82 },
      { note: 'A2', label: 'A', frequency: 110 },
      { note: 'D2', label: 'D', frequency: 147 },
      { note: 'G2', label: 'G', frequency: 196 },
      { note: 'B2', label: 'B', frequency: 247 },
      { note: 'E3', label: 'e', frequency: 330 },
    ],
  };

  const primaryGainControl = audioContext.createGain();
  primaryGainControl.gain.setValueAtTime(0.4, 0);
  primaryGainControl.connect(audioContext.destination);

  Alpine.data('notes', () => ({
    currentPreset: presets['guitarStandard'],
    currentPresetName: 'guitarStandard',
    currentNote: null,
    currentOscillator: null,

    playNote(requestedNote) {
      this.stop();

      const note = this.currentPreset.find(
        ({ note }) => note === requestedNote
      );

      if (!note) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      oscillator.connect(primaryGainControl);

      oscillator.frequency.setValueAtTime(note.frequency, 0);

      oscillator.start();

      this.currentOscillator = oscillator;
      this.currentNote = requestedNote;
    },

    stop() {
      if (this.currentOscillator) {
        this.currentOscillator.stop(audioContext.currentTime);
        this.currentOscillator = null;
        this.currentNote = null;
      }
    },
  }));
});
