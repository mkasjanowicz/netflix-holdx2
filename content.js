/**
 * Netflix Hold 2x Speed - Content Script
 */

let targetSpeed = 2.0;
let activationZone = 'right';
let holdDelay = 350;

// State variables
let timer = null;
let isHoldingSpeedup = false;
let hasSpedUp = false;
let originalSpeed = 1.0;
let activeVideo = null;
let startCoords = { x: 0, y: 0 };
const MOVEMENT_THRESHOLD = 15; // pixels

// Load settings from storage
function loadSettings() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({
      speed: 2.0,
      zone: 'right',
      delay: 350
    }, (items) => {
      targetSpeed = parseFloat(items.speed);
      activationZone = items.zone;
      holdDelay = parseInt(items.delay);
    });
  }
}

// Initial load
loadSettings();

// Listen for runtime settings changes
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.speed) targetSpeed = parseFloat(changes.speed.newValue);
      if (changes.zone) activationZone = changes.zone.newValue;
      if (changes.delay) holdDelay = parseInt(changes.delay.newValue);
    }
  });
}

// Helper: Get coordinates for mouse or touch events
function getCoordinates(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

// Helper: Enforce speed target on video ratechange
function enforceSpeed(e) {
  if (isHoldingSpeedup && activeVideo && activeVideo.playbackRate !== targetSpeed) {
    activeVideo.playbackRate = targetSpeed;
  }
}

// Helper: Create or get the HUD element inside the video's parent container
function getOrCreateHUD(video) {
  const container = video.parentElement;
  if (!container) return null;

  let hud = container.querySelector('.netflix-hold-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.className = 'netflix-hold-hud';
    hud.innerHTML = `
      <span class="speed-text">${targetSpeed.toFixed(1)}x</span>
      <div class="arrow-icon-group">
        <span class="arrow-icon"></span>
        <span class="arrow-icon"></span>
      </div>
    `;
    container.appendChild(hud);
  }
  return hud;
}

// Check if clicked element is inside control overlays
function isInsideControls(target, y) {
  // Exclude clicking on standard interactive elements (buttons, sliders, settings, next episode)
  const isControlElement = target.closest(
    '.watch-video--controls-container, ' +
    '.nf-player-controls, ' +
    '.player-controls-wrapper, ' +
    'button, ' +
    'a, ' +
    '[role="button"], ' +
    '.slider-container, ' +
    'input'
  );

  if (isControlElement) return true;

  // Fallback: Exclude clicks in the bottom 16% of the window where controls reside
  const bottomThreshold = window.innerHeight * 0.84;
  if (y > bottomThreshold) return true;

  // Exclude clicks in the top 12% of the window (Netflix top bar with back button, title)
  const topThreshold = window.innerHeight * 0.12;
  if (y < topThreshold && target.closest('.watch-video--back-container, .watch-video--back-button')) {
    return true;
  }

  return false;
}

// Check if coordinates fall inside the activation zone
function isInsideActivationZone(x) {
  const width = window.innerWidth;
  if (activationZone === 'right') {
    return x > width * 0.5; // Right 50%
  } else if (activationZone === 'right30') {
    return x > width * 0.7; // Right 30%
  }
  return true; // Anywhere
}

// Handle trigger activation
function startHold(e) {
  // Only handle left click (button 0) for mouse events
  if (e.type === 'mousedown' && e.button !== 0) return;

  const video = document.querySelector('video');
  if (!video) return;

  const coords = getCoordinates(e);
  
  // Verify click is not in the player controls or navigation bars
  if (isInsideControls(e.target, coords.y)) return;

  // Verify click is in the activation zone
  if (!isInsideActivationZone(coords.x)) return;

  // Store starting coordinates and state
  activeVideo = video;
  startCoords = coords;
  hasSpedUp = false;

  // Clear any existing timer just in case
  if (timer) clearTimeout(timer);

  // Set long-press activation timer
  timer = setTimeout(() => {
    activateSpeedup();
  }, holdDelay);
}

// Activate speedup action
function activateSpeedup() {
  if (!activeVideo) return;
  
  isHoldingSpeedup = true;
  hasSpedUp = true;
  
  // Store the normal speed Netflix is currently running at
  originalSpeed = activeVideo.playbackRate || 1.0;
  
  // Set target speed and listen for overrides from Netflix engine
  activeVideo.playbackRate = targetSpeed;
  activeVideo.addEventListener('ratechange', enforceSpeed);
  
  // Show HUD
  const hud = getOrCreateHUD(activeVideo);
  if (hud) {
    hud.querySelector('.speed-text').textContent = `${targetSpeed.toFixed(1)}x`;
    hud.classList.add('active');
  }
}

// Handle trigger release
function endHold(e) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  if (isHoldingSpeedup) {
    isHoldingSpeedup = false;
    
    if (activeVideo) {
      // Remove ratechange listener first so we don't trigger enforcement on restore
      activeVideo.removeEventListener('ratechange', enforceSpeed);
      activeVideo.playbackRate = originalSpeed;
      
      // Hide HUD
      const hud = getOrCreateHUD(activeVideo);
      if (hud) {
        hud.classList.remove('active');
      }
    }
  }
}

// Cancel if user drags/moves too much before speedup activates
function handleMove(e) {
  if (timer) {
    const coords = getCoordinates(e);
    const dx = coords.x - startCoords.x;
    const dy = coords.y - startCoords.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > MOVEMENT_THRESHOLD) {
      clearTimeout(timer);
      timer = null;
    }
  }
}

// Prevent click event (play/pause) if we performed a speedup hold
function handleCaptureClick(e) {
  if (hasSpedUp) {
    e.stopPropagation();
    e.preventDefault();
    hasSpedUp = false; // reset
  }
}

// Attach event listeners
// We capture on window to ensure we intercept click and mouseup correctly
window.addEventListener('mousedown', startHold, true);
window.addEventListener('mouseup', endHold, true);
window.addEventListener('mousemove', handleMove, true);

window.addEventListener('touchstart', startHold, { passive: true, capture: true });
window.addEventListener('touchend', endHold, { passive: true, capture: true });
window.addEventListener('touchmove', handleMove, { passive: true, capture: true });

// Prevent Netflix click event from toggling playback when releasing hold
window.addEventListener('click', handleCaptureClick, true);

// Safely revert speed on page navigation or visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isHoldingSpeedup) {
    endHold(null);
  }
});
