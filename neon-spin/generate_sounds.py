import math
import struct
import wave
import os

os.makedirs('public/sounds', exist_ok=True)

def generate_wav(filename, samples, sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        
        for sample in samples:
            packed_value = struct.pack('<h', int(sample * 32767.0))
            wav_file.writeframes(packed_value)

# 1. Spin Click (Mechanical Clunk)
spin_samples = []
for i in range(int(44100 * 0.15)):
    t = i / 44100.0
    freq = 800 - (t * 4000)
    if freq < 100: freq = 100
    env = math.exp(-t * 25)
    val = math.sin(2 * math.pi * freq * t) * env
    spin_samples.append(val * 0.4)
generate_wav('public/sounds/spin.wav', spin_samples)

# 2. Rolling (Repeated Tick)
roll_samples = []
duration = 1.0 # 1 second loop
ticks_per_sec = 8
for i in range(int(44100 * duration)):
    t = i / 44100.0
    pos = t * ticks_per_sec
    local_pos = pos - math.floor(pos)
    
    # Tick sound
    env = math.exp(-local_pos * 40)
    freq = 600
    # Square wave for mechanical feel
    val = 1.0 if math.sin(2 * math.pi * freq * local_pos) > 0 else -1.0
    roll_samples.append(val * env * 0.1)
generate_wav('public/sounds/rolling.wav', roll_samples)

# 3. Win (Arpeggio Chime)
win_samples = []
notes = [523.25, 659.25, 783.99, 1046.50] * 3 # C E G C arpeggio repeated
note_dur = 0.1
for r in range(len(notes)):
    freq = notes[r]
    for i in range(int(44100 * note_dur)):
        t = i / 44100.0
        env = math.exp(-t * 10)
        # Sine wave chime
        val = math.sin(2 * math.pi * freq * t) * env
        win_samples.append(val * 0.5)
generate_wav('public/sounds/win.wav', win_samples)

print("Audio files generated in public/sounds/")
