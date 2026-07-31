import { onYandexApiResponse } from "~/mod/features/utils/utils";

async function isEnabled(): Promise<boolean> {
  try {
    return (await window.yandexMusicMod.getStorageValue("incognito/enabled")) === true;
  } catch {
    return false;
  }
}

onYandexApiResponse("api.music.yandex.net", async (response: any) => {
  if (!(await isEnabled())) return response.data;

  const url: string = response.url;

  if (
    url.includes("/listenings") ||
    url.includes("/feedback") ||
    (url.includes("/users/") && url.includes("/tracks/"))
  ) {
    return { error: "blocked" };
  }

  return response.data;
});
