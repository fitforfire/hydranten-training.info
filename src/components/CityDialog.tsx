import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import type { CityData } from "@/lib/data";
import type { GlobalData } from "@/pages/Home";
import { useState } from "react";

export default function CityDialog({ cities, globalData, setGlobalData }: { cities: CityData[], globalData: GlobalData, setGlobalData: (data: GlobalData) => void }) {

    const [isOpen, setIsOpen] = useState(!globalData.selectedCity);

    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    return <Dialog open={isOpen} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Wähle deine Gemeinde:</DialogTitle>
                <RadioGroup onValueChange={setSelectedValue}>
                    {
                        cities.map((city: CityData, index: number) => (
                            <div key={city.name+index} className="flex items-center space-x-2 hover:cursor-pointer hover:bg-accent hover:rounded-md p-2">
                            <RadioGroupItem value={city.name+index} id={city.name + index} />
                            <Label className="text-base hover:cursor-pointer" htmlFor={city.name + index}>{city.displayName}</Label>
                            </div>
                        ))
                    }
                </RadioGroup>
            </DialogHeader>
            <DialogFooter>
                <Button className="hover:cursor-pointer" onClick={() => {
                    const selectedCity = cities.find(city => city.name + cities.indexOf(city) === selectedValue);
                    if (selectedCity) {
                        setGlobalData({...globalData, selectedCity: selectedCity});
                        setIsOpen(false);
                    }
                }}>Bestätigen</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}