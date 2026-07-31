import { useEffect, useState } from "react";

import { ExpandableCard } from "@ui/components/ui/expandable-card";
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";

import { Music3 } from "lucide-react";

export function Lyrics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      setEnabled((await window.yandexMusicMod.getStorageValue("lyrics/enabled")) === true);
    })();
  }, []);

  return (
    <ExpandableCard title="Тексты песен" icon={<Music3 className="h-4 w-4" />}>
      <div className="flex flex-col gap-5 pt-2 px-3">
        <div className="flex items-center gap-3">
          <Switch
            id="lyrics-toggle"
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              window.yandexMusicMod.setStorageValue("lyrics/enabled", checked);
            }}
          />
          <Label htmlFor="lyrics-toggle" className="cursor-pointer">
            Показывать тексты песен (Musixmatch)
          </Label>
        </div>
      </div>
    </ExpandableCard>
  );
}
