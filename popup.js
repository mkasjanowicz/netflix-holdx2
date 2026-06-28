// Netflix Hold 2x Speed - Popup Configuration Script

document.addEventListener('DOMContentLoaded', () => {
  const speedInput = document.getElementById('speed');
  const speedVal = document.getElementById('speedVal');
  const delayInput = document.getElementById('delay');
  const delayVal = document.getElementById('delayVal');
  const zoneButtons = document.querySelectorAll('.zone-btn');

  // Load default/saved settings
  chrome.storage.sync.get({
    speed: 2.0,
    zone: 'right',
    delay: 350
  }, (items) => {
    // Initialize speed
    speedInput.value = items.speed;
    speedVal.textContent = parseFloat(items.speed).toFixed(1) + 'x';

    // Initialize delay
    delayInput.value = items.delay;
    delayVal.textContent = items.delay + ' ms';

    // Initialize active zone button
    updateActiveZoneButton(items.zone);
  });

  // Handle speed slider changes
  speedInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value).toFixed(1);
    speedVal.textContent = val + 'x';
    chrome.storage.sync.set({ speed: parseFloat(val) });
  });

  // Handle delay slider changes
  delayInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    delayVal.textContent = val + ' ms';
    chrome.storage.sync.set({ delay: val });
  });

  // Handle click events on zone buttons
  zoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedZone = btn.dataset.zone;
      updateActiveZoneButton(selectedZone);
      chrome.storage.sync.set({ zone: selectedZone });
    });
  });

  // Helper to toggle active state on zone buttons
  function updateActiveZoneButton(activeZone) {
    zoneButtons.forEach(btn => {
      if (btn.dataset.zone === activeZone) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
});
