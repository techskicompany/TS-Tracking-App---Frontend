import './Home.css'
import { RefreshCw,PlusIcon } from 'lucide-react'
import Header from '../../Components/Header/Header'
import Device from '../../Components/Device/Device';
import Device_info from '../../Components/Device-info/Device_info'
import NewDeviceForm from '../../Components/Add-Device/NewDeviceForm'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Map from '../Map';
function Home({userDetail,logout}){
    const [showAddDeviceCard,setShowAddDeviceCard]=useState(false);
    const [devices,setDevices]=useState([]);
    const [selectedDevice,setSelectedDevice]=useState();
    const [realTimeData,setRealTimeData]=useState([])
    const socket = io('http://localhost:3000');
    useEffect(()=>{
        const fetchDeviceDetails = async()=>{
            try {
                const requests = userDetail.devices.map(async(device)=>{
                    const device_data = device.device_id;
                    const data_type ="id";
                    const res = await fetch('http://localhost:3000/device',{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                            },
                        body: JSON.stringify({device_data,data_type})
                    });
                    if(!res.ok) throw new Error("Failed to detch device",device_data);
                    const device_info = await res.json();
                    
                    return {device_name:device.device_name,device_data:device_info}   
                })                    
                const fullDeviceData=await Promise.all(requests);                
                setDevices(fullDeviceData);

                
            } catch (error) {
                console.log("Error:",error);
                    
            }
        }
        
        if(userDetail.devices && userDetail.devices.length>0){
            fetchDeviceDetails();
        }      

    },[])

    useEffect(()=>{
        if(devices.length>0){
            const listeners = []; 
            devices.forEach((device)=>{  
                const topic = 'tracking_data_'+device.device_data.device.id;
                const handler =(data)=>{
                    console.log("Device "+device.device_data.device.id+" updated");
                    
                    const location_data = JSON.parse(data)
                    setDevices((prevDevices)=>prevDevices.map((d)=>
                        d.device_data.device.id==device.device_data.device.id ? {...d,device_data:{...d.device_data,device:{...d.device_data.device,current_latitude:location_data.lat,current_longitude:location_data.lng,},},}
                        :d
                    ))    
                    
                }
                socket.on(topic,handler)
                listeners.push({topic,handler})

            })
            setSelectedDevice(devices[0])

            return()=>{
                listeners.forEach(({topic,handler})=>{
                    socket.off(topic,handler)
                })
            }

        }

    },[devices])
    
    const handleDeviceClick=(device)=>{
        setSelectedDevice(device);
        
    }

    const newDeviceAdded = (device)=>{
        
        if(!device || !device.device_data){
            console.log("Invalid Device",device);
            return;
        }
        setDevices((prev)=>[...prev,device])
        
    }
    const deviceDeleted = (id)=>{
        if(id!=null){
            setDevices(prev=>prev.filter(device=>device.device_data.device.id!==id));
        }
    }



    return (
        <>
            <Header onLogout={logout}></Header>
            <div className='content'>
            <div className='col'>
                <section className='devices-section'>
                <div>
                    <br/>
                    <h1>TechSki</h1> 
                    <br/>
                    <p>Monitor and track your devices in real-time</p>                
                </div>  
                <div className='head'>
                    <h4>Your Devices</h4>
                    <div className='action-btns'>
                    <RefreshCw className='refresh-btn' onClick={(e)=>{  
                        e.target.classList.add("spin");                    
                        setTimeout(() => {
                        e.target.classList.remove("spin");                                        
                        }, 1000);
    
                    }}/>
                    <PlusIcon className='add-device-btn' onClick={()=>setShowAddDeviceCard(true)}/>
                    </div>
                </div>
                
                {showAddDeviceCard && <NewDeviceForm userId={userDetail.userId} onDeviceAdded={newDeviceAdded} onClose={()=>setShowAddDeviceCard(false)}/>}
                
                <div className='devices-list'>
                    {
                        devices.map(device=>(
                            <Device key={device.device_data.device.id} selected={selectedDevice?.device_data?.device?.id===device.device_data.device.id} data={device} onClick={()=>handleDeviceClick(device)} onDeviceDeleted={deviceDeleted}/>
                        ))
                    }
                    
                </div>
                </section>      
            </div>
            <div className='col'>
                <section className='map-section'>
                    <Map selectedDevice={selectedDevice} devices={devices}/>
                </section>
                <section>
                    {selectedDevice && <Device_info device={selectedDevice}/>}
                </section>        
            </div>
            </div>
        </>
    )
}

export default Home;