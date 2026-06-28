# Netflix Hold 2x Speed 🎬⚡

A lightweight, modern Google Chrome extension (Manifest V3) that brings YouTube's popular **"hold down to play at 2x speed"** feature to Netflix.

## 📥 Download

Install the extension directly from the Chrome Web Store:
👉 **[Download on Chrome Web Store](https://chromewebstore.google.com/detail/jkefjkamphfceflfpahjhbeflgndbghk/)**

---

## 🌟 Features

* **Hold to Speed Up**: Press and hold the left mouse button (or tap and hold on touch devices) anywhere in the player zone to speed up playback.
* **Release to Restore**: Release the click to immediately return to the original playback speed.
* **Smart UI HUD**: Shows a sleek, glassmorphic visual indicator (`2.0x >>` with pulsing chevron arrows) at the top of the player while speedup is active.
* **Control Exclusion**: Safe-guarded against accidental triggers. Clicking on the playback timeline, subtitles, settings, volume, or next-episode buttons will not trigger the speedup.
* **Custom Configuration**: A custom popup settings window styled to match the Netflix aesthetic allows you to adjust:
  * **Playback speed multiplier** (1.5x - 4.0x)
  * **Activation zone** (Entire Screen, Right Half, or Right 30%)
  * **Hold activation delay** (150ms - 800ms)
* **Under-the-Hood Enforcement**: Intercepts Netflix's native rate change events to ensure the target speed remains locked in during the hold.

---

## 🚀 Installation & Setup

### 1. From Chrome Web Store (Recommended)
Simply visit the **[Chrome Web Store Page](https://chromewebstore.google.com/detail/jkefjkamphfceflfpahjhbeflgndbghk/)** and click **"Add to Chrome"**.

### 2. Manual Installation (Developer Mode)
If you wish to load the source files directly:
1. Clone or download this repository to your local machine.
2. Open **Google Chrome** and go to `chrome://extensions/` in the address bar.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left corner.
5. Select the project directory (`netflix-holdx2`).
6. Open [Netflix](https://www.netflix.com) and start watching any movie or show. Hold down to test the speedup!

---

## 🛠️ Technical Details & Inner Workings

* **`content.js`**: The script injected into the Netflix player. It dynamically queries the active HTML5 `<video>` element, tracks click-and-hold durations, and controls the video's `playbackRate`.
* **Rate Enforcement**: Netflix's player engine sometimes resets the `playbackRate` back to default. This extension listens to the `ratechange` event on the video element and instantly enforces the target speed during a hold.
* **Click Interception**: When you release a long press, standard browser behavior would trigger a click event and pause the Netflix video. This extension intercepts the click event in the capturing phase and halts propagation, keeping the video playing seamlessly.
* **Movement Deadzone**: If the cursor or finger moves more than 15 pixels before the activation delay fires, the speedup is cancelled. This prevents false triggers when you drag, scroll, or swipe.

---

## 📄 License

This project is licensed under the MIT License.
