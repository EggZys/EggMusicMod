let isEnabled = false;
let overlayEl: HTMLDivElement | null = null;
let playerInterval: any = null;

function getPlayerState() {
  try {
    const state: any = (window as any).__getPlayerState?.();
    if (!state) return null;
    const track = state.currentTrack || state.track || {};
    return {
      title: track.title || "",
      artist: (track.artists || []).map((a: any) => a.name).join(", "),
      cover: track.coverUri
        ? `https://${track.coverUri.replace("%%", "200x200")}`
        : "",
      isPlaying: state.isPlaying || false,
    };
  } catch {
    return null;
  }
}

function createOverlay() {
  if (overlayEl) return;

  overlayEl = document.createElement("div");
  overlayEl.id = "yandex-music-miniplayer";
  overlayEl.innerHTML = `
    <div class="ymp-drag" id="ymp-drag">
      <div class="ymp-cover" id="ymp-cover">🎵</div>
      <div class="ymp-info">
        <div class="ymp-title" id="ymp-title">—</div>
        <div class="ymp-artist" id="ymp-artist">—</div>
      </div>
      <div class="ymp-controls">
        <button class="ymp-btn" data-action="previous">⏮</button>
        <button class="ymp-btn ymp-play" data-action="playpause" id="ymp-play">▶</button>
        <button class="ymp-btn" data-action="next">⏭</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  const style = document.createElement("style");
  style.id = "ymp-style";
  style.textContent = `
    #yandex-music-miniplayer {
      position: fixed;
      bottom: 90px;
      right: 24px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      user-select: none;
    }
    #yandex-music-miniplayer .ymp-drag {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(20,20,30,0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      cursor: grab;
      transition: opacity 0.2s;
      width: 340px;
    }
    #yandex-music-miniplayer .ymp-drag:active { cursor: grabbing; }
    #yandex-music-miniplayer .ymp-cover {
      width: 48px; height: 48px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, #f59e0b, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; overflow: hidden;
    }
    #yandex-music-miniplayer .ymp-cover img { width: 100%; height: 100%; object-fit: cover; }
    #yandex-music-miniplayer .ymp-info { flex: 1; min-width: 0; }
    #yandex-music-miniplayer .ymp-title {
      font-weight: 600; font-size: 13px; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #yandex-music-miniplayer .ymp-artist {
      font-size: 11px; color: #aaa;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;
    }
    #yandex-music-miniplayer .ymp-controls { display: flex; gap: 4px; }
    #yandex-music-miniplayer .ymp-btn {
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: rgba(255,255,255,0.08); color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: background 0.15s; line-height: 1;
    }
    #yandex-music-miniplayer .ymp-btn:hover { background: rgba(255,255,255,0.2); }
    #yandex-music-miniplayer .ymp-play { background: #f59e0b; }
    #yandex-music-miniplayer .ymp-play:hover { background: #d97706; }
  `;
  document.head.appendChild(style);

  // Управление через IPC от main process
  (window as any).__yandexMusicModMiniPlayerAction = (action: string) => {
    const btn = overlayEl?.querySelector(`[data-action="${action}"]`) as HTMLButtonElement;
    if (btn) btn.click();
  };

  // Drag
  let isDragging = false;
  let startX = 0, startY = 0, origX = 0, origY = 0;
  const dragEl = overlayEl.querySelector("#ymp-drag") as HTMLElement;

  dragEl.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    isDragging = true;
    const rect = overlayEl!.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    dragEl.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !overlayEl) return;
    overlayEl.style.left = (e.clientX - startX) + "px";
    overlayEl.style.top = (e.clientY - startY) + "px";
    overlayEl.style.right = "auto";
    overlayEl.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    if (dragEl) dragEl.style.cursor = "grab";
  });

  // Кнопки
  overlayEl.querySelectorAll(".ymp-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const action = (btn as HTMLElement).dataset.action;
      const wins = await (window as any).yandexMusicMod.axios({
        method: "POST",
        url: `https://api.music.yandex.net/player/multi/action`,
        data: { action: { type: action === "playpause" ? "play" : action, timestamp: Date.now() } },
      });
    });
  });

  // Sync track info
  playerInterval = setInterval(() => {
    const state = getPlayerState();
    if (!state || !overlayEl) return;

    const coverEl = overlayEl.querySelector("#ymp-cover")!;
    const titleEl = overlayEl.querySelector("#ymp-title")!;
    const artistEl = overlayEl.querySelector("#ymp-artist")!;
    const playBtn = overlayEl.querySelector("#ymp-play")!;

    titleEl.textContent = state.title || "—";
    artistEl.textContent = state.artist || "—";
    playBtn.textContent = state.isPlaying ? "⏸" : "▶";

    if (state.cover) {
      coverEl.innerHTML = `<img src="${state.cover}" alt="">`;
    }
  }, 2000);
}

function removeOverlay() {
  if (overlayEl) {
    overlayEl.remove();
    overlayEl = null;
  }
  const style = document.getElementById("ymp-style");
  if (style) style.remove();
  if (playerInterval) {
    clearInterval(playerInterval);
    playerInterval = null;
  }
}

(async () => {
  isEnabled = (await window.yandexMusicMod.getStorageValue("miniPlayer/enabled")) === true;
  if (isEnabled) createOverlay();
})();

window.yandexMusicMod.onStorageChanged((key: string, value: any) => {
  if (key === "miniPlayer/enabled") {
    isEnabled = value === true;
    if (isEnabled) createOverlay();
    else removeOverlay();
  }
});
