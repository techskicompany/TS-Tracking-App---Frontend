import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useEffect, useRef, useState } from "react";
import {MapContainer,Marker,Popup,TileLayer, useMap} from 'react-leaflet'
import {renderToString} from  'react-dom/server'

import { MapPin } from "lucide-react";

const selectedIcon= L.divIcon({
    html: renderToString(<MapPin color="red" size={32} strokeWidth={1.5}/>),
    className:'lucide-marker selected',
    iconSize:[32 ,32],
    iconAnchor:[16,32],
    shadowSize : [55,55]

})
const defaultIcon= L.divIcon({
    html: renderToString(<MapPin color="blue" size={32} strokeWidth={1.5}/>),
    className:'lucide-marker',
    iconSize:[32 ,32],
    iconAnchor:[16,32],
    shadowSize : [55,55]

})

const RecenterMap=({sDevice})=>{
    
    const map =useMap();
    useEffect(()=>{
        if(sDevice){
            map.flyTo([sDevice.device_data.device.current_latitude,sDevice.device_data.device.current_longitude],map.getZoom(),{
                animate:true,
                duration:1.5
            })
        }
    },[sDevice,map])
    return null;

}

function Map({devices,selectedDevice}){
    const [devicesState,setDevicesState]=useState(devices);
    const [selectedDeviceState,setSelectedDeviceState]=useState(selectedDevice);
    const [center,setCenter] = useState([36.4084,6.9421]);
    useEffect(()=>{
        setDevicesState(devices) 
        setSelectedDeviceState(selectedDevice)
        if(selectedDevice!=null){
            setCenter([selectedDevice.device_data.device.current_latitude, selectedDevice.device_data.device.current_longitude]) 
        }
    },[devices,selectedDevice])



    if(!selectedDeviceState) return <div>Waiting...</div>    
    return(
        <>
            <MapContainer center={center}  zoom={10} style={{height:"300px", width:"100%"}}>             
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy'/>       
                    <RecenterMap sDevice={selectedDeviceState}/>
                    {  
                                          
                            devicesState.map(device=>{
                                const lat = device.device_data.device.current_latitude;
                                const lng = device.device_data.device.current_longitude;
                                const isSelected = device.device_data.device.id===selectedDeviceState.device_data.device.id;
                                return(
                                    <Marker position={[lat,lng]} icon={isSelected ? selectedIcon : defaultIcon} >
                                        <Popup>{device.device_name}</Popup>
                                    </Marker>
                                )
                            }) 
                    }
            </MapContainer>
        </>
    )

} 


export default Map;