<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/mod/features/ui/assets/logo.svg">
    <img src="src/mod/features/ui/assets/logo.svg" width="96" alt="EggMusicMod">
  </picture>

  # 🥚 EggMusicMod

  <b>Яндекс Музыка без Плюса. Скачивай треки, меняй темы, слушай в высоком качестве.</b>

  <br>

  [![Release](https://img.shields.io/github/v/release/EggZys/EggMusicMod?style=for-the-badge&logo=github&label=Скачать&color=%23f59e0b)](https://github.com/EggZys/EggMusicMod/releases/latest)
  [![Downloads](https://img.shields.io/github/downloads/EggZys/EggMusicMod/total?style=for-the-badge&logo=&label=Загрузок&color=%238b5cf6)](https://github.com/EggZys/EggMusicMod/releases)
  [![Platform](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/EggZys/EggMusicMod/releases/latest)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  [![Build](https://img.shields.io/github/actions/workflow/status/EggZys/EggMusicMod/build.yml?style=for-the-badge&logo=githubactions&label=CI)](https://github.com/EggZys/EggMusicMod/actions)

  <br>
  <sub>Основано на <a href="https://github.com/Stephanzion/YandexMusicBetaMod">YandexMusicBetaMod</a> ❤️</sub>
</div>

---

## ✨ Возможности

<div align="center">

|  |  |  |
|---|---|---|
| 🎵 **Без подписки** | 🎧 **Высокое качество** | ⬇️ **Скачивание треков** |
| Полностью бесплатно — Плюс не нужен | До 320 kbps и FLAC | MP3 и FLAC с метаданными |
| 🎨 **Кастомные темы** | 💜 **Discord RPC** | 🚫 **Без рекламы** |
| Любые цвета и шрифты | Статус в Discord | Вырезана аналитика |
| 🔧 **DevTools** | ⚙️ **Эксперименты** | 🆕 **Авто-обновление** |
| Режим разработчика | Включай/выключай фичи | Вместе с Яндексом |

</div>

## 📥 Установка

### Вариант 1 — установщик (рекомендуется)

```bash
# 1. Скачай установщик последней версии:
https://github.com/EggZys/EggMusicMod/releases/latest

# 2. Запусти — установится как обычная программа
```

### Вариант 2 — ручная установка (app.asar)

Если у тебя уже стоит Яндекс Музыка:

```powershell
# 1. Скачай app.asar из последнего релиза
# 2. Скопируй поверх:
copy app.asar "$env:LOCALAPPDATA\Programs\YandexMusic\resources\"
# 3. Перезапусти Яндекс Музыку
```

## 🔧 Сборка из исходников

```bash
git clone https://github.com/EggZys/EggMusicMod.git
cd EggMusicMod
bun install --ignore-scripts
bun start
```

Установщик появится в `.versions/<версия>/mod/dist/`.

## 🏗️ GitHub Actions

Релизы собираются автоматически раз в неделю. Можно запустить вручную:

1. Открой [Actions](https://github.com/EggZys/EggMusicMod/actions)
2. Нажми **Run workflow**
3. Через ~15 минут готовый установщик появится в [Releases](https://github.com/EggZys/EggMusicMod/releases)

## 🧩 Фичи мода

<details>
<summary><b>🎵 Отключение Плюса</b> — слушай любые треки без подписки</summary>

Мод перехватывает запросы к API Яндекса и подменяет ответы так, что приложение думает, будто у тебя активная подписка. Работает для всего: Моя волна, плейлисты, новые релизы, высокое качество.
</details>

<details>
<summary><b>⬇️ Скачивание треков</b> — FLAC и MP3 с обложкой и тегами</summary>

Встроенный загрузчик треков. Просто нажми на кнопку скачивания рядом с треком. Поддерживает FLAC и MP3, автоматически добавляет метаданные (название, исполнитель, альбом, жанр, обложка). Использует FFmpeg для обработки.
</details>

<details>
<summary><b>🎨 Кастомные темы и шрифты</b> — меняй внешний вид как хочешь</summary>

В редакторе тем можно изменить любой цвет приложения. Также есть встроенные пресеты. Поддержка кастомных шрифтов — загрузи любой .woff2/.woff шрифт.
</details>

<details>
<summary><b>💜 Discord Rich Presence</b> — показывай что слушаешь в Discord</summary>

Автоматически отображает в Discord статус с названием трека, исполнителем, обложкой и кнопкой "Тоже слушаю".
</details>

<details>
<summary><b>🔄 Авто-выбор качества</b> — всегда максимальное качество</summary>

Автоматически выбирает наилучшее доступное качество для каждого трека. Не нужно вручную переключать.
</details>

---

<div align="center">
  <sub>
    Сделано с 🥚 by <a href="https://github.com/EggZys">EggZys</a>
    <br>
    По вопросам и предложениям — <a href="https://github.com/EggZys/EggMusicMod/issues">Issues</a>
  </sub>
</div>
