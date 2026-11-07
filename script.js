let isOpening = false;

function openEnvelope() {
  if (isOpening) return;
  isOpening = true;

  const envelope = document.getElementById('envelope');
  const tapHint = document.querySelector('.tap-hint');

  if (tapHint) {
    tapHint.style.opacity = '0';
  }

  // Flap folds open & card ascends
  envelope.classList.add('is-open');

  // Waits 1.25s for envelope animation to finish, then smoothly transitions to page2.html
  setTimeout(() => {
    document.body.classList.add('page-fade-out');

    setTimeout(() => {
      window.location.href = 'page2.html';
    }, 650);
  }, 1250);
}