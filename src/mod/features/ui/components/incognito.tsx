import { useEffect, useState } from "react";

import { ExpandableCard } from "@ui/components/ui/expandable-card";
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";

import { EyeOff } from "lucide-react";

export function Incognito() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      setEnabled((await window.yandexMusicMod.getStorageValue("incognito/enabled")) === true);
    })();
  }, []);

  return (
    <ExpandableCard title="Режим инкогнито" icon={<EyeOff className="h-4 w-4" />}>
      <div className="flex flex-col gap-5 pt-2 px-3">
        <div className="flex items-center gap-3">
          <Switch
            id="incognito-toggle"
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              window.yandexMusicMod.setStorageValue("incognito/enabled", checked);
            }}
          />
          <Label htmlFor="incognito-toggle" className="cursor-pointer">
            Не сохранять историю прослушиваний
          </Label>
        </div>
      </div>
    </ExpandableCard>
  );
}
