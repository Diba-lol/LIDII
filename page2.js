document.addEventListener('DOMContentLoaded', () => {

  // 1. Reading Progress Bar
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      const bar = document.getElementById('progressBar');
      if (bar) bar.style.width = `${progress}%`;
    }
  });

  // 2. Intersection Observer for Scroll Reveals
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(target => revealObserver.observe(target));
});


// ================= 1. KEEPSAKE ENVELOPE TOGGLE =================
let isPocketOpen = false;

function togglePocketEnvelope() {
  const envelope = document.getElementById('pocketEnvelope');
  const label = document.getElementById('pocketLabel');
  if (!envelope) return;

  isPocketOpen = !isPocketOpen;

  if (isPocketOpen) {
    envelope.classList.add('is-open');
    if (label) label.textContent = 'tap again to close ♡';
  } else {
    envelope.classList.remove('is-open');
    if (label) label.textContent = 'tap envelope to open 💌';
  }
}


// ================= 2. CANDLE BLOWOUT & REVEAL =================
let candleExtinguished = false;

function extinguishCandle() {
  if (candleExtinguished) return;
  candleExtinguished = true;

  const cake = document.getElementById('artisanCake');
  const promiseCard = document.getElementById('secretPromise');
  const hint = document.getElementById('cakeHint');

  // Visual extinction
  if (cake) cake.classList.add('extinguished');
  if (hint) {
    hint.textContent = 'Your wish has been made! ✨';
    hint.style.color = '#fff';
  }

  // Display the secret letter
  setTimeout(() => {
    if (promiseCard) {
      promiseCard.style.display = 'block';
      promiseCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 400);

  // Confetti burst
  try {
    launchGoldConfetti();
  } catch (err) {
    console.warn('Confetti error:', err);
  }

  // Optional celebratory audio
  try {
    playChimeTune();
  } catch (err) {
    console.warn('Audio blocked by browser:', err);
  }
}


// ================= 3. CASSETTE AUDIO ENGINE =================
let isAudioPlaying = false;

function toggleMelody() {
  const cassette = document.getElementById('cassettePlayer');
  const prompt = document.getElementById('tapePrompt');
  const audio = document.getElementById('birthdaySong');

  if (audio) {
    // If local song.mp3 exists
    if (!isAudioPlaying) {
      audio.play().then(() => {
        isAudioPlaying = true;
        if (cassette) cassette.classList.add('spinning');
        if (prompt) prompt.textContent = 'My Girl 🎵';
      }).catch(() => {
        // Fallback to built-in synthesizer if MP3 fails
        fallbackSynth(cassette, prompt);
      });
    } else {
      audio.pause();
      isAudioPlaying = false;
      if (cassette) cassette.classList.remove('spinning');
      if (prompt) prompt.textContent = 'tap to play music box 🤍';
    }

    audio.onended = () => {
      isAudioPlaying = false;
      if (cassette) cassette.classList.remove('spinning');
      if (prompt) prompt.textContent = 'tap to replay 🤍';
    };
  } else {
    // Fallback synthesizer if no <audio> tag exists
    fallbackSynth(cassette, prompt);
  }
}

// Built-in Music Box Synthesizer
let audioCtx = null;
let synthInterval = null;

function fallbackSynth(cassette, prompt) {
  isAudioPlaying = !isAudioPlaying;

  if (isAudioPlaying) {
    if (cassette) cassette.classList.add('spinning');
    if (prompt) prompt.textContent = 'MY GIRL 🎵';

    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];
      let i = 0;

      synthInterval = setInterval(() => {
        if (!isAudioPlaying) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[i % notes.length], audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
        i++;
      }, 480);
    } catch (e) {
      console.warn('Synthesizer audio blocked:', e);
    }
  } else {
    if (cassette) cassette.classList.remove('spinning');
    if (prompt) prompt.textContent = 'tap to play music box 🤍';
    if (synthInterval) clearInterval(synthInterval);
  }
}

function playChimeTune() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const chord = [523.25, 659.25, 783.99, 1046.50];
  chord.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.09));
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime + (i * 0.09));
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (i * 0.09) + 0.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + (i * 0.09));
    osc.stop(audioCtx.currentTime + (i * 0.09) + 0.8);
  });
}

function launchGoldConfetti() {
  const colors = ['#d4af37', '#fce09b', '#f472b6', '#fb7185', '#ffffff'];
  for (let i = 0; i < 50; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = `${50 + (Math.random() * 30 - 15)}vw`;
    conf.style.top = '65vh';
    conf.style.width = `${Math.random() * 8 + 6}px`;
    conf.style.height = `${Math.random() * 10 + 6}px`;
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    conf.style.zIndex = '9999';
    conf.style.pointerEvents = 'none';

    document.body.appendChild(conf);

    const targetX = (Math.random() - 0.5) * 550;
    const targetY = -Math.random() * 380 - 100;
    const rotation = Math.random() * 720;

    conf.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1800 + Math.random() * 600,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }).onfinish = () => conf.remove();
  }
}