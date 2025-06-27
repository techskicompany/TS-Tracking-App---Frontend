import { useState } from 'react';
import './NewDeviceForm.css';
function NewDeviceForm({userId,onDeviceAdded,onClose}){
    const [submitMsg,setSubmitMsg]=useState(null);


    const handleNewDevice =async (e)=>{
        e.preventDefault();
        e.target.disabled=true;
        if(userId==null){
            return;
        }
        const device_name = document.getElementById("device_name").value;
        const device_uiid = document.getElementById("device_id").value;
        const device_type = document.getElementById("device_type").value
        
        const res = await fetch("http://localhost:3000/new-device",{
            method: 'POST',
            headers:{
            'Content-Type':'application/json'
            },

            body: JSON.stringify({userId,device_name,device_uiid,device_type})
        }).catch((e)=>console.log("Error..."))
    
        const fetchDeviceDetails = async()=>{
            const device_data = device_uiid;
            const data_type = 'uiid'
            try {
                    const res = await fetch('http://localhost:3000/device',{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                            },
                        body: JSON.stringify({device_data,data_type})
                    });
                    if(!res.ok) throw new Error("Failed to fetch device",device_name);
                    const device_info = await res.json();
                    return {device_name:device_name,device_data:device_info}   
            }    
             catch (error) {
                console.log("Error:",error);              
            }
        }
        
        const data = await res.json();
        
        e.target.disabled=false;
        if(res.ok){
            setSubmitMsg("Device added successfully");

            // Get the new device data
            const handleSubmit = async()=>{
                const newDevice= await fetchDeviceDetails();
                onDeviceAdded(newDevice)
            }
            handleSubmit()

            setTimeout(() => {
                onClose()
            }, 1000); 
        }else{
            setSubmitMsg(data.message)
    
        }
        
    }



    return(
        <>
            <div className="add-device">
                <div className="card">
                    <div className="row">
                        <h2>Add Device</h2>
                        <h2 className="exit" onClick={onClose}>×</h2>
                    </div>
                    <form className="add-device-form">
                        <label> Device Name</label>
                        <input type="text" id='device_name' required/>
                        <label> Device ID</label>
                        <input type="text" id='device_id' required/>
                        <label> Device Type</label>
                        <select id='device_type' required>
                            <option value="Collar Tracker">Collar Tracker</option>
                            <option value="Vehicle Tracker">Vehicle Tracker</option>
                            <option value="Bicycle Tracker">Bicycle Tracker</option>
                            <option value="Personal Tracker">Personal Tracker</option>
                        </select>
                        {submitMsg && <h5 className='add-device-msg'>{submitMsg}</h5>}
                        <div className="btns">
                            <button onClick={(e)=>{
                                e.preventDefault();
                                onClose();
                            }}>Cancel</button>
                            <button type='submit' onClick={handleNewDevice}>Add Device</button>
                        </div>                    
                    </form>

                </div>
            </div>
            
        </>
    )
}

export default NewDeviceForm;