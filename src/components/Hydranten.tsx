import { Icon, type IconOptions, LatLng, LatLngBounds } from "leaflet";
import { Circle, Marker } from "react-leaflet";

import * as GameConstants from "../GameConstants";
import {type GlobalData } from "../pages/Home";


type HydrantenProps = {
    globalData: GlobalData;
};

export function Hydranten(hydrantenProps: HydrantenProps) {
    

    const iconOptions = {
        iconUrl: "/fire_hydrant.svg",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    // popupAnchor: [1, -26]
    } as IconOptions;

    const icon = new Icon(iconOptions);

    return (
        <>
            {hydrantenProps.globalData.allHydrants.map( (hydrantLatLng, index) => {
                const hydrantBounds = hydrantLatLng.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS) as LatLngBounds;
                if(hydrantenProps.globalData.hydrantsVisible || hydrantenProps.globalData.finishMessage) {
                    return (
                        <Marker key={index} position={hydrantLatLng} 
                        icon={icon} 
                        />
                    );
                } else {
                    const positionIntersecting = hydrantenProps.globalData.clickedPositions.some((latlng: LatLng ) => {
                        const clickedBounds = latlng.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS) as LatLngBounds;
                    // return true;
                        console.log("clickedBounds", index, clickedBounds, clickedBounds.toBBoxString());
                        console.log("hydrantBounds", index, hydrantBounds, hydrantBounds.toBBoxString());
                        return clickedBounds.intersects(hydrantBounds);
                    });
                    if (positionIntersecting){
                        return (
                            <Marker key={index} position={hydrantLatLng}
                             icon={icon} 
                             />
                        );
                    } else {
                        return null;
                    }
                }
            })}

            {hydrantenProps.globalData.clickedPositions.map((latlng: LatLng, index: number) => {
                const clickedBounds = latlng.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS) as LatLngBounds;
                const positionIntersecting = hydrantenProps.globalData.hydrants.some( (hydrantLatLng) => {
                    const hydrantBounds = hydrantLatLng.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS) as LatLngBounds;
                    // return true;
                    return clickedBounds.intersects(hydrantBounds);
                });
                return (
                    <Circle key={index} center={latlng} color={ positionIntersecting ? 'green' : 'red' } radius={GameConstants.DEFAULT_INTERSECT_RADIUS} />
                );
            })}
        </>
    );

};