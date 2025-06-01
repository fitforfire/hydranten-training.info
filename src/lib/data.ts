import * as GameConstants from "../GameConstants";
import bbox from "@turf/bbox";
import { booleanPointInPolygon, concave, featureCollection, point } from "@turf/turf";
import { GeoJSON, LatLng, Polygon, Util } from "leaflet";

function overpassSearch() {
    return `[out:json][timeout:25];

        is_in({lat}, {lng})->.a;

        area.a["name"="{city}"]["boundary"="administrative"]["admin_level"~"7|8|9|10|11"]->.searchArea;

        (
        nwr["emergency"="fire_hydrant"](area.searchArea);
        nwr["emergency"="suction_point"](area.searchArea);
        );
        out geom;
        `;
}

const baseNominatimUrl = 'https://nominatim.openstreetmap.org/search.php?city={city}&format=jsonv2';

const baseOverpassUrl = 'https://overpass-api.de/api/interpreter?data=' + overpassSearch();
    // 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25]; (nwr["emergency"="fire_hydrant"]({bbox}); nwr["emergency"="suction_point"]({bbox});); out geom;';^
//    'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["name"="{city}"]["boundary"="administrative"]["admin_level"~"7|8|9|10|11"]->.searchArea;(nwr["emergency"="fire_hydrant"](area.searchArea);nwr["emergency"="suction_point"](area.searchArea););out geom;';
    

// TODO: BBOX vs City name -> Wenn Grenze dann ist der nächste Hydrant vielleicht in einer anderen Gemeinde

export type CityData = {
    name: string;
    displayName: string;
    lat: number;
    lng: number;
};

export async function getCityData(gemeinde: string): Promise<CityData[] | null> {
    const url = Util.template(baseNominatimUrl, {
        city: gemeinde
    });

    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const resData = await response.json();

        if (resData) {
            data = resData.map((d: {name: string, display_name: string, lat: string, lon: string})=> {

                return {
                    name: d.name,
                    displayName: d.display_name,
                    lat: parseFloat(d.lat),
                    lng: parseFloat(d.lon)
                };

            })
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    // TODO: Set correct data type
    return data;
}


export async function getHydrantenDataByCity(cityData: CityData): Promise<LatLng[]> {
    const url = Util.template(baseOverpassUrl, {
        city: cityData.name,
        lat: cityData.lat,
        lng: cityData.lng
    });

    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const resData = await response.json();

        if (resData.elements) {
            data = resData.elements.map((element: { lat: number; lon: number }) => new LatLng(element.lat, element.lon));
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    // TODO: Set correct data type
    return data;
}

export function convertHydrantPointsToPolygon(hydrantPoints: LatLng[]): Polygon {

    const turfPoints = hydrantPoints.map((hyPoint) => point([hyPoint.lng, hyPoint.lat]));

    const fc = featureCollection(turfPoints);

    const hullPolygon = concave(fc);

    return new GeoJSON(hullPolygon).getLayers()[0] as Polygon;
}

export function getRandomPointInPolygon(polygon: GeoJSON.Feature<GeoJSON.Polygon>): GeoJSON.Feature<GeoJSON.Point> {
  const bboxArr = bbox(polygon); // [minX, minY, maxX, maxY]

  let geoPoint;
  let tries = 0;
  do {
    // Random longitude and latitude within bbox
    const randomLng = Math.random() * (bboxArr[2] - bboxArr[0]) + bboxArr[0];
    const randomLat = Math.random() * (bboxArr[3] - bboxArr[1]) + bboxArr[1];
    geoPoint = point([randomLng, randomLat]);

    tries++;
    if (tries > 10000) {
      throw new Error('Unable to find a valid point inside polygon after 10000 tries');
    }

  } while (!booleanPointInPolygon(geoPoint, polygon)); // Check if inside polygon

  return geoPoint
}


type IntersectHydrants = {
    hydrantLatLng: LatLng;
    clickedPosition: LatLng;
}


export function getIntersectingHydrants(hydrantPoints: LatLng[], clickedPositions: LatLng[]): IntersectHydrants[] {
    return hydrantPoints.map((latLngHydrant) => {
            const hydrantBounds = latLngHydrant.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS);
            
            const intersectedPoint = clickedPositions.find((latlng: LatLng ) => {
                const clickedBounds = latlng.toBounds(GameConstants.DEFAULT_INTERSECT_RADIUS);
                // return true;
                return clickedBounds.intersects(hydrantBounds);
            });

            if (intersectedPoint) {
                return {
                    hydrantLatLng: latLngHydrant,
                    clickedPosition: intersectedPoint
                } as IntersectHydrants;
            }

            return null;
        }).filter(x => x) as IntersectHydrants[];
}

export function getNearestHydrants(hydrantPoints: LatLng[], startPosition: LatLng, count: number): LatLng[] {
    if (hydrantPoints.length === 0) return [];

    hydrantPoints.sort((a, b) => a.distanceTo(startPosition) - b.distanceTo(startPosition));
    console.log("Sorted hydrant points", hydrantPoints, hydrantPoints.slice(0,5));
    return hydrantPoints.slice(0, count); // Limit to the nearest hydrants
}