<div align="center">
  <img src="src/mod/features/ui/assets/logo.svg" width="80" alt="EggMusicMod">
  <h1>🥚 EggMusicMod</h1>
  <p>Мод для Яндекс Музыки: без Плюса, с флиртом и высоким качеством</p>

  <p>
    <a href="https://github.com/EggZys/EggMusicMod/releases/latest">
      <img src="https://img.shields.io/github/v/release/EggZys/EggMusicMod?style=flat&label=%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C" alt="Release">
    </a>
    <img src="https://img.shields.io/github/downloads/EggZys/EggMusicMod/total?style=flat&label=Downloads" alt="Downloads">
  </p>
</div>

## ✨ Возможности

| | |
|---|---|
| 🎵 | Полностью бесплатно — никакого Плюса |
| 🎧 | Высокое качество аудио (до 320 kbps / FLAC) |
| ⬇️ | Скачивание треков в MP3 и FLAC |
| 🎨 | Кастомные темы и шрифты |
| 💜 | Discord Rich Presence |
| 🚫 | Никакой рекламы и аналитики |
| ⚙️ | Полный контроль над экспериментами |
| 🔧 | Режим разработчика, DevTools |

## ⚡ Быстрый старт

### Вариант 1: готовый asar (рекомендуется)

1. Скачай последний релиз: [GitHub Releases](https://github.com/EggZys/EggMusicMod/releases/latest)
2. Извлеки `app.asar` в `%LOCALAPPDATA%\Programs\YandexMusic\resources\` (замени существующий)
3. Если Яндекс жалуется на целостность — открой терминал и выполни:
   ```powershell
   # Замени путь на свой
   $exe = "$env:LOCALAPPDATA\Programs\YandexMusic\Яндекс Музыка.exe"
   $asar = "$env:LOCALAPPDATA\Programs\YandexMusic\resources\app.asar"
   $hash = (Get-FileHash $asar -Algorithm SHA256).Hash.ToLower()
   $content = [System.IO.File]::ReadAllBytes($exe)
   $oldHash = "30e976404c1a57057a163d65869afe1b05dce10cca1f8e297bc8be15f20bcfbc"
   $pos = [System.Text.Encoding]::UTF8.GetString($content).IndexOf($oldHash)
   if ($pos -ge 0) {
       $newBytes = [System.Text.Encoding]::UTF8.GetBytes($hash)
       $oldBytes = [System.Text.Encoding]::UTF8.GetBytes($oldHash)
       foreach ($i in 0..($oldBytes.Length-1)) { $content[$pos+$i] = $newBytes[$i] }
       [System.IO.File]::WriteAllBytes($exe, $content)
       Write-Host "Хеш обновлён!" -ForegroundColor Green
   } else { Write-Host "Хеш не найден" -ForegroundColor Yellow }
   ```

### Вариант 2: сборка из исходников

```bash
bun install
bun start
```

Готовый `app.asar` появится в `.versions/<версия>/mod/`.

## 💻 Для разработчиков

Хочешь добавить свой мод? Смотри [MODDING_GUIDE.md](MODDING_GUIDE.md).

---

<div align="center">Сделано с 🥚 by <a href="https://github.com/EggZys">EggZys</a></div>
