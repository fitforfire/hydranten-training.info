"use client"
import { SplashMessage } from "../components/SplashMessage";
import { StartScreen } from "../components/StartScreen";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { convertHydrantPointsToPolygon, getHydrantenDataByCity } from "../lib/data";
import { LatLng, Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import * as GameConstants from "../GameConstants";
import { Navbar } from "../components/Navbar";
import Map from "../components/Map";
import team122Logo from '../assets/team122_logo_lang.png';


export interface GlobalData {
  hydrants: LatLng[];
  allHydrants: LatLng[];
  hydrantsFound: number;
  cityName: string;
  hydrantsVisible: boolean;
  clickedPositions: LatLng[];
  hydrantPolygon: Polygon;
  finishMessage?: string;
  showHint: boolean;
}

export default function Home() {
  // const Map = useMemo(
  //   () =>
  //     dynamic(() => import("./components/Map"), {
  //       ssr: false,
  //     }),
  //   []
  // );

  const [globalData, setGlobalData] = useState<GlobalData>({
    hydrants: [],
    allHydrants: [],
    hydrantsFound: 0,
    cityName: "",
    hydrantsVisible: false,
    clickedPositions: [],
    hydrantPolygon: new Polygon([]),
    showHint: false,
  });
  
  const [loadingData, setLoadingData] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  const [gemeinde, setGemeinde] = useState<string | null>(null);
  
  useEffect(() => {
    async function startGame() {
      console.log("Start Game", gemeinde);
      setLoadingData(true);

      try{
        if(gemeinde){
          const hydrants = await getHydrantenDataByCity(gemeinde);
          console.log("Hydranten", hydrants);

          if(hydrants?.length >= 3) {
            const hydrantPolygon = convertHydrantPointsToPolygon(hydrants);
            setGlobalData({...globalData, cityName: gemeinde, allHydrants: hydrants, hydrants: [], hydrantPolygon: hydrantPolygon});
            setShowStartScreen(false);
          } else {
            setGlobalData({...globalData, finishMessage: "Keine Wasserentnahmestellen für "+gemeinde+" gefunden!"})
            setTimeout(()=>{
              setGlobalData({...globalData, finishMessage: undefined});
            }, 1000)
          }

        }
      }catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoadingData(false);
    }

    startGame();
  }, [gemeinde]);


  useEffect(()=>{
    setGemeinde("");
  }, [showStartScreen])

  return <div className="h-full bg-blue-200">
    {
      showStartScreen ? (
        <>
          <Navbar setShowStartScreen={setShowStartScreen} />
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center font-(family-name:--font-geist-sans) p-4">
            <main className="flex flex-col gap-8 row-start-2 items-center">
              <StartScreen setGemeinde={setGemeinde} />
              { loadingData && <SplashMessage message="Laden ..." />}
              {globalData.finishMessage && (
                  <SplashMessage message={globalData.finishMessage} />
              )}
            </main>
          </div>
        </>
      ) : (
        <>
        <Navbar setShowStartScreen={setShowStartScreen} />
        <div className="mx-auto my-5 w-full h-[75%]">
          <p className="text-2xl self-center text-center">{GameConstants.TEXT_INFO_SELECT_3_of_5}</p>

          <div className="px-5 lg:flex justify-between items-center">
            <p className="text-lg"> {GameConstants.TEXT_OPEN_TRIES_INFO.replace("{openTries}", String(5 - globalData.clickedPositions.length)).replace("{hydrantsFound}", String(globalData.hydrantsFound))}</p>


            <div className="flex flex-col lg:flex-row justify-center p-3 items-center">
              <Label className="text-lg">Wasserentnahmestellen anzeigen:</Label>
              <Switch checked={globalData.hydrantsVisible} onCheckedChange={(e: boolean)=>{setGlobalData({...globalData, hydrantsVisible: e})}} className="mr-[40px]" />
              <Label className="text-lg">Tipp anzeigen:</Label>
              <Switch checked={globalData.showHint} onCheckedChange={(e: boolean)=>{setGlobalData({...globalData, showHint: e})}} />
            </div>
          </div>
          
          <div className="h-[95%]">
            <Map globalData={globalData} setGlobalData={setGlobalData} />
          </div>
        </div>


        {globalData.finishMessage && (
            <SplashMessage message={globalData.finishMessage} />
        )}
        </>
      )
    }
      <div className="fixed bottom-1 right-1 z-1000">
        <a href="https://www.team122.at/" className="hover:cursor-pointer">
          <img src={team122Logo} width={250} height={100} alt="team122.at Logo"></img>
        </a>
      </div>
    </div>
}
