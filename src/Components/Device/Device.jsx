import { useEffect, useState } from "react";
import "./Device.css";

import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, Circle, Dot, Navigation, Trash} from 'lucide-react'

function Device({data,onDeviceDeleted,selected,onClick}) {
   

    const handleClick= ()=>{
        onClick(data)
    }
    const handleDeleteDevice = async()=>{
        const device_id=data.device_data.device.id;
        const res = await fetch("http://localhost:3000/delete-device",{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({device_id})
        }).catch((e)=>console.log("Error..."))
        if(res.ok){
            onDeviceDeleted(device_id);
        }
        
    }
    
    
    
 
    return(
        <>  
             <div className={selected ? "device-card selected" : "device-card"}  onClick={handleClick}>
                <div className="left-side">
                    <div className="icons">
                        <Navigation color="#0EA5E9" size={45} strokeWidth={1.6} className="nav-icon"/>
                        <Circle fill={data.device_data.device.status=="online" ? "lime" :"red"} strokeWidth={0} size={18} className="online-icon"/>               
                    </div>
                    <div className="info">
                        <h4>{data.device_name}</h4>
                        <div className="row">
                            <p>{data.device_data.device.status}</p> 
                            <Dot size={28}/>
                            <p>{data.device_data.device.status==="online" ? "Just now" : formatLastSeen(data.device_data.device.last_seen)}</p>
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    {batteryIcon(Number(data.device_data.device.battery_level),Boolean(Number(data.device_data.device.isCharging)))}
                    <p className="battery-level">{data.device_data.device.battery_level}%</p>
                    <Trash className="delete-device" onClick={handleDeleteDevice}/>
                </div>
            </div>                               
        </>
    )
}

function batteryIcon(batteryLevel,ischarging){
    let icon ;
    if(batteryLevel<=20 && !ischarging){
        icon=<BatteryLow color="red"/> 
    }else if(batteryLevel>20 && batteryLevel<=80 && !ischarging){
        icon=<BatteryMedium color="green"/>
    }else if(batteryLevel>80 && !ischarging){
        icon=<BatteryFull color="green"/>
    }else if(ischarging){
        icon=<BatteryCharging color="green"/> 
    }else{
        icon=<Battery color="green"/>
    }
    return icon;

}
function formatLastSeen(timestamp){
    const now = new Date();
    const past = new Date(timestamp)
    const diff = now-past;
    const seconds = Math.floor(diff/1000);
    const minutes = Math.floor(diff/(1000*60));
    const hours = Math.floor(diff/(1000*60*60));
    const days = Math.floor(diff/(1000*60*60*24));
    const months = Math.floor(days/30);
    const years = Math.floor(days/365)
    
    if(seconds<60) return "Just now";
    if(minutes<60 && minutes>=1) return minutes+" minute";
    if(hours<24 && hours>=1) return hours+" hour";
    if(days<30 && days>=1) return days+" day";
    if(days>=30 && days<365) return months+" month";
    if(days>=365) return years+" year";
}

export default Device;