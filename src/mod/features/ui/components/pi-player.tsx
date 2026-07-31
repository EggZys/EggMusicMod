import { useEffect, useState } from "react";

import { ExpandableCard } from "@ui/components/ui/expandable-card";
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";

import { PictureInPicture2 } from "lucide-react";

export function PiPlayer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      setEnabled((await window.yandexMusicMod.getStorageValue("miniPlayer/enabled")) === true);
    })();
  }, []);

  return (
    <ExpandableCard title="Мини-плеер" icon={<PictureInPicture2 className="h-4 w-4" />}>
      <div className="flex flex-col gap-5 pt-2 px-3">
        <div className="flex items-center gap-3">
          <Switch
            id="miniplayer-toggle"
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              window.yandexMusicMod.setStorageValue("miniPlayer/enabled", checked);
            }}
          />
          <Label htmlFor="miniplayer-toggle" className="cursor-pointer">
            Показывать мини-плеер поверх окон
          </Label>
        </div>
      </div>
    </ExpandableCard>
  );
}
