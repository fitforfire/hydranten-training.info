"use client";

import { GeoJSON, LatLng, Map as LeafletMap, type LeafletMouseEvent, Polygon as LeafletPolygon, Rectangle } from 'leaflet';
import { MapContainer, Marker, Polygon, TileLayer } from 'react-leaflet';

import { convertHydrantPointsToPolygon, getIntersectingHydrants, getNearestHydrants, getRandomPointInPolygon } from '../lib/data';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useRef, useState } from 'react';
import { Hydranten } from './Hydranten';

import * as GameConstants from "../GameConstants";
import { buffer } from '@turf/turf';
import { type GlobalData } from '../pages/Home';

interface MapProps {
    globalData: GlobalData;
    setGlobalData: (data: GlobalData) => void;
}

const Map = (mapProps: MapProps) => {

    const [map, setMap] = useState<LeafletMap | null>(null);
    const [center, setCenter] = useState<LatLng | null>(null);
    const [clickedPositions, setClickedPositions] = useState<LatLng[]>([]);
    const [hintPolygon, setHintPolygon] = useState<LatLng[]>([]);

    const getRandomPosition = () => {
        const randomPoint = getRandomPointInPolygon((mapProps.globalData.hydrantPolygon.toGeoJSON()) as GeoJSON.Feature<GeoJSON.Polygon>);
        const randomLatLng = new LatLng(randomPoint.geometry.coordinates[1], randomPoint.geometry.coordinates[0]);

        setCenter(randomLatLng);
        map?.setView(randomLatLng, 18);

        updateHydrants.current(randomLatLng);
    };


    const updateHydrants = useRef((randomLatLng: LatLng) => {
        const nearest = getNearestHydrants(mapProps.globalData.allHydrants, randomLatLng, GameConstants.MAX_HYDRANT_COUNT);

        const hydrantHintPolygon = convertHydrantPointsToPolygon(nearest);

        const buffered = new GeoJSON(buffer(hydrantHintPolygon.toGeoJSON(), 0.030)).getLayers()[0] as LeafletPolygon;

        setHintPolygon(new Rectangle(buffered.getBounds()).getLatLngs() as LatLng[]);

        mapProps.setGlobalData({
            ...mapProps.globalData,
            hydrants: nearest,
        });
    });

    useEffect(() => {
        getRandomPosition();
    }, [mapProps.globalData.hydrantPolygon]);

    const onClickListener = useRef((e: LeafletMouseEvent) => {
        setClickedPositions(clickedPositions => [...clickedPositions, e.latlng]);
    });

    useEffect(() => {
        if(!map) return;
        map.on('click', onClickListener.current);

        
        updateHydrants.current(center as LatLng);
    }, [map, center]);

    const startTimeoutForReset =  () => {
        setTimeout(() => {

            mapProps.setGlobalData({
                ...mapProps.globalData,
                hydrantsFound: 0,
                hydrantsVisible: false,
                clickedPositions: [],
                finishMessage: undefined
            });

            setClickedPositions([]);
            
            getRandomPosition();
        }, GameConstants.RESET_TIMEOUT);
    };


    useEffect(() => {
        const globalDataTemp = {...mapProps.globalData};

        const foundHydrants = getIntersectingHydrants(mapProps.globalData.hydrants, clickedPositions);
        globalDataTemp.hydrantsFound = foundHydrants.length;
        globalDataTemp.clickedPositions = clickedPositions;        

        if(foundHydrants.length == GameConstants.MIN_HYDRANT_COUNT){
            globalDataTemp.finishMessage = GameConstants.TEXT_SUCCESS_MESSAGE;
        } else if(clickedPositions.length == GameConstants.MAX_TRIES_COUNT) {
            globalDataTemp.finishMessage = GameConstants.TEXT_FAILURE_MESSAGE.replace("{found}", String(mapProps.globalData.hydrantsFound));
        }

        mapProps.setGlobalData(globalDataTemp);

        if(globalDataTemp.finishMessage) {
            startTimeoutForReset();
        }

    }, [clickedPositions]);

    return (
        <>
        {center && (
            <MapContainer
                ref={setMap}
                center={center}
                zoom={18}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Hydranten: <a href="https://www.osmhydrant.org/">OsmHydrant.org</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center} draggable={false} />
                <Hydranten globalData={mapProps.globalData} />

                { mapProps.globalData.showHint && (
                    <Polygon positions={hintPolygon} color="blue" fillOpacity={0.2} />
                )}
            </MapContainer>
        )}
    </>
    )
}

export default Map