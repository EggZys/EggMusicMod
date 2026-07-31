import { musixmatchApi } from "@ui/external-apis/musixmatch";

let isEnabled = false;
let lyricsOverlay: HTMLDivElement | null = null;
let currentTrackId: string | null = null;
let lyricsInterval: any = null;

function getCurrentTrack() {
  try {
    const state: any = (window as any).__getPlayerState?.();
    if (!state?.currentTrack) return null;
    const track = state.currentTrack;
    return {
      id: track.id,
      title: track.title,
      artist: (track.artists || []).map((a: any) => a.name).join(", "),
      duration: track.durationMs ? Math.floor(track.durationMs / 1000) : undefined,
    };
  } catch {
    return null;
  }
}

async function fetchLyrics(title: string, artist: string, duration?: number) {
  try {
    const result = await musixmatchApi.getAllMeta(title, artist, duration);
    if (result.isErr()) return null;
    const body = result.value;
    const lyricsBody = body?.lyrics?.lyrics_body;
    if (lyricsBody && lyricsBody !== "") {
      return lyricsBody.replace(/\*\*\*\*\*\*\*/g, "").trim();
    }
    return null;
  } catch {
    return null;
  }
}

function createOverlay() {
  if (lyricsOverlay) return;

  lyricsOverlay = document.createElement("div");
  lyricsOverlay.id = "yandex-music-lyrics";
  lyricsOverlay.innerHTML = `
    <div class="yml-header">
      <span class="yml-title">Текст песни</span>
      <button class="yml-close" id="yml-close">✕</button>
    </div>
    <div class="yml-content" id="yml-content">
      <div class="yml-loading">Загрузка...</div>
    </div>
  `;
  document.body.appendChild(lyricsOverlay);

  const style = document.createElement("style");
  style.id = "yml-style";
  style.textContent = `
    #yandex-music-lyrics {
      position: fixed;
      bottom: 90px;
      right: 24px;
      z-index: 99998;
      width: 360px;
      max-height: 420px;
      background: rgba(20,20,30,0.94);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      color: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    #yandex-music-lyrics .yml-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    #yandex-music-lyrics .yml-title {
      font-weight: 600;
      font-size: 13px;
      color: #f59e0b;
    }
    #yandex-music-lyrics .yml-close {
      background: none;
      border: none;
      color: #888;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 6px;
    }
    #yandex-music-lyrics .yml-close:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    #yandex-music-lyrics .yml-content {
      padding: 16px;
      overflow-y: auto;
      max-height: 340px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: #ddd;
    }
    #yandex-music-lyrics .yml-content::-webkit-scrollbar {
      width: 4px;
    }
    #yandex-music-lyrics .yml-content::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.15);
      border-radius: 4px;
    }
    #yandex-music-lyrics .yml-loading {
      color: #888;
      text-align: center;
      padding: 20px;
    }
    #yandex-music-lyrics .yml-error {
      color: #f87171;
      text-align: center;
      padding: 20px;
      font-size: 13px;
    }
  `;
  document.head.appendChild(style);

  document.getElementById("yml-close")!.addEventListener("click", () => {
    removeOverlay();
    window.yandexMusicMod.setStorageValue("lyrics/enabled", false);
  });
}

function removeOverlay() {
  if (lyricsOverlay) {
    lyricsOverlay.remove();
    lyricsOverlay = null;
  }
  if (lyricsInterval) {
    clearInterval(lyricsInterval);
    lyricsInterval = null;
  }
  const style = document.getElementById("yml-style");
  if (style) style.remove();
}

async function updateLyrics() {
  const track = getCurrentTrack();
  if (!track || !lyricsOverlay) return;

  if (track.id === currentTrackId) return;
  currentTrackId = track.id;

  const contentEl = lyricsOverlay.querySelector("#yml-content")!;
  contentEl.innerHTML = '<div class="yml-loading">Загрузка...</div>';

  const lyrics = await fetchLyrics(track.title, track.artist, track.duration);
  if (lyrics) {
    contentEl.textContent = lyrics;
  } else {
    contentEl.innerHTML = '<div class="yml-error">Текст не найден</div>';
  }
}

(async () => {
  isEnabled = (await window.yandexMusicMod.getStorageValue("lyrics/enabled")) === true;
  if (isEnabled) {
    createOverlay();
    lyricsInterval = setInterval(updateLyrics, 2000);
  }
})();

window.yandexMusicMod.onStorageChanged((key: string, value: any) => {
  if (key === "lyrics/enabled") {
    isEnabled = value === true;
    if (isEnabled) {
      createOverlay();
      currentTrackId = null;
      lyricsInterval = setInterval(updateLyrics, 2000);
      updateLyrics();
    } else {
      removeOverlay();
    }
  }
});
