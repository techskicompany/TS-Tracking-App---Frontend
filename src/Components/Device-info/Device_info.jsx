import { Battery, Circle, Clock, MapPin } from 'lucide-react';
import './Device_info.css';
import {   useEffect, useState } from 'react';
function Device_info({device}){
    const [shownOption,setShownOption]=useState("info");
    const [history,setHistory]=useState([]);
    const device_id = device.device_data.device.id;
    const isDark= window.matchMedia('(prefers-color-scheme:dark)').matches;
    var selectedBtnBg = isDark ? "black"  : "white";

    useEffect(()=>{
        const fetchHistory = async()=>{
        const res = await fetch("http://localhost:3000/device-history",{
            method: 'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify({device_id})
          }).catch((e)=>alert("Error..."))
          const data = await res.json();
          if(res.ok){
            setHistory(data.location_history)            
          }
        }
        if(device){
            fetchHistory()
        }
    },[device])


    function displayDeviceInfo(device){
        return(
            <>
                <div className="info">
                    <div className='row'>
                        <MapPin color='#0EA5E9'/>
                        <div className='row-info'>
                            <h5>Current Location</h5>
                            <p>{device.device_data.device.current_latitude},{device.device_data.device.current_longitude}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <Battery/>
                        <div className='row-info'>
                            <h5>Battery</h5>
                            <p>{device.device_data.device.battery_level}%</p>                                
                        </div>
                    </div>
                    <div className='row'>
                        <Clock color='#0EA5E9'/>
                        <div className='row-info'>
                            <h5>Last Updated</h5>
                            <p>{new Date(device.device_data.device.last_seen).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</p>
                        </div>
                    </div>
                </div>
            </>
            
        )
    
    
    }
    
    function displayDeviceHistory(device_history){
        return(
            <>
                <div className='history'>
                    <h5>Location History</h5>
                    <div className='history-data'>
                    {
                        device_history.map((history,index)=>{
                            return(
                                <HistoryRow history={history}/>
                            )
                        })
                    }
                    </div>
                </div>
            </>
        ) 
    }
    function HistoryRow({history}){
        return(
            <>
                <div className='row'>
                    <div className='circle'>
                    <Circle fill='#0EA5E9' strokeWidth={0} size={14}/>
                    </div>
                    <div className='row-info'>
                        <p className="location_time">{new Date(history.timestamp).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</p>
                        <p className='location_data'>{history.latitude},{history.longitude}</p>
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            <div className='device-info'>
                <div className='head'>
                    <h3>{device.device_name}</h3>
                    <div className='row'>
                        <Circle fill={device.device_data.device.status=="online" ? "lime" :"red"} strokeWidth={0} size={18}/>
                        <p>{device.device_data.device.status}</p>
                    </div>
                </div>
                    <div className='buttons'>
                        <button onClick={()=>setShownOption("info")} style={{backgroundColor: shownOption==="info" ? selectedBtnBg : "transparent"}} >Info</button>
                        <button onClick={()=>setShownOption("history")} style={{backgroundColor: shownOption==="history" ? selectedBtnBg : "transparent"}}>History</button>
                    </div>
                    <div className='data'>
                        
                        {shownOption=="info" ? displayDeviceInfo(device) : displayDeviceHistory(history)}
          
                    </div>
            </div>
        </>)
}

export default Device_info;
