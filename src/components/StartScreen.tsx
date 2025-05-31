
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import fireHydrantImg from '../assets/fire_hydrant.svg';

import * as GameConstants from "../GameConstants";


interface StartScreenProps {
    setGemeinde: (v: string) => void;
}

export function StartScreen({setGemeinde}: StartScreenProps) {
    const [gemeindeSearch, setGemeindeSearch] = useState<string>("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            setGemeinde(gemeindeSearch);
        }
    }

 const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  return (
    <>
      <img src={fireHydrantImg} alt="Logo" className="mb-4 self-center" width={70} height={70} />
      <h1 className="text-4xl font-bold">{GameConstants.TEXT_TITLE}</h1>

      <Label  className="text-base">{GameConstants.TEXT_SELECT_GEMEINDE}:</Label>
      <Input
        id="gemeinde"
        ref={inputRef}
        value={gemeindeSearch}
        onChange={(e) => setGemeindeSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={() => setGemeinde(gemeindeSearch)} className="self-center text-base bg-blue-600 hover:bg-blue-700">Starten</Button>

      <p>Dir fehlen Hydranten? Gerne über <a href="https://www.osmhydrant.org/" className="text-blue-600 hover:underline">OsmHydrant.org</a> eintragen.</p>
    </>
  );
}