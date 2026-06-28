# Netflix Hold 2x Speed 🎬⚡

A lightweight, modern Google Chrome extension (Manifest V3) that brings YouTube's popular **"hold down to play at 2x speed"** feature to Netflix. 

*Read this in other languages: [Polski](#polski-wersja-językowa).*

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

## 🚀 How to Install (Developer Mode)

Since this extension is loaded as a developer directory, follow these steps to install it in Google Chrome:

1. **Download / Clone** this repository to your local machine.
2. Open **Google Chrome** and go to `chrome://extensions/` in the address bar.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** (Załaduj rozpakowane) button in the top left corner.
5. Select the project directory (`netflix-holdx2`).
6. Open [Netflix](https://www.netflix.com) and start watching any movie or show. Hold down to test the speedup!

---

## 🛠️ Technical Details & Inner Workings

* **`content.js`**: The script injected into the Netflix player. It dynamically queries the active HTML5 `<video>` element, tracks click-and-hold durations, and controls the video's `playbackRate`.
* **Rate Enforcement**: Netflix's player engine sometimes resets the `playbackRate` back to default. This extension listens to the `ratechange` event on the video element and instantly enforces the target speed during a hold.
* **Click Interception**: When you release a long press, standard browser behavior would trigger a click event and pause the Netflix video. This extension intercepts the click event in the capturing phase and halts propagation, keeping the video playing seamlessly.
* **Movement Deadzone**: If the cursor or finger moves more than 15 pixels before the activation delay fires, the speedup is cancelled. This prevents false triggers when you drag, scroll, or swipe.

---

<a name="polski-wersja-językowa"></a>
## 🇵🇱 Polski (Wersja Językowa)

Lekka i nowoczesna wtyczka do przeglądarki Google Chrome (Manifest V3), która przenosi popularną funkcję z YouTube – **"przytrzymaj, aby odtwarzać z prędkością 2x"** – bezpośrednio do odtwarzacza Netflix.

### 🌟 Główne Funkcje

* **Przytrzymaj, aby przyspieszyć**: Kliknij i przytrzymaj lewy przycisk myszy (lub przytrzymaj palec na ekranach dotykowych) w strefie odtwarzacza, aby przyspieszyć odtwarzanie.
* **Puść, aby przywrócić**: Puść przycisk myszy, aby natychmiast wrócić do pierwotnej prędkości odtwarzania.
* **Modern HUD**: Elegancki wskaźnik (`2.0x >>` z efektem glassmorphism) pojawiający się u góry ekranu w trakcie przyspieszenia.
* **Inteligentne ignorowanie**: Ochrona przed przypadkowym wyzwalaniem podczas klikania w napisy, oś czasu, głośność czy zmianę odcinków.
* **Panel ustawień**: Estetyczny panel opcji w stylu Netflixa, pozwalający dostosować prędkość (1.5x - 4.0x), opóźnienie aktywacji oraz strefę kliknięcia (cały ekran, prawa połowa lub prawe 30%).

### 🚀 Jak zainstalować

1. **Pobierz / Sklonuj** to repozytorium na swój komputer.
2. Otwórz **Google Chrome** i przejdź pod adres `chrome://extensions/`.
3. Włącz **Tryb dewelopera** (prawy górny róg).
4. Kliknij **Załaduj rozpakowane** (lewy górny róg) i wskaż folder z projektem.
5. Uruchom Netflixa, włącz wideo i przytrzymaj prawą stronę ekranu!

---

## 📄 License

This project is licensed under the MIT License.
