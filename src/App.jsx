import { useState , useEffect} from 'react'
import {io} from 'socket.io-client'
import './App.css'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Loader from './Components/Loader/Loader'



const socket = io("http://https://ts-tracking-app-backend.onrender.com:3000");
function App() {
  const [isLogin,setIsLogin]=useState(false);
  const [loginMessage,setLoginMessage] = useState();
  const [userDetail,setUserDetail]=useState(null);
  const [showLoader,setShowLoader]=useState(false);
  const  handleLogin=async(e)=>{
    e.preventDefault();
    e.target.disabled=true;
    setShowLoader(true)
    const email = document.querySelector(".login-email").value;
    const password = document.querySelector(".login-password").value
    const res = await fetch("http://localhost:3000/login",{
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({email,password})
    }).catch((e)=>alert("Error..."))

    const data = await res.json();
    e.target.disabled=false;

    if(res.ok){
      setIsLogin(true);
      setUserDetail({userId:data.user.id,devices:data.user.devices})
    }else{
      setLoginMessage(data.message)
    }
    setShowLoader(false)
  } 
  
 
  /*
  useEffect(()=>{
    socket.on("connect",()=>{
      setMessage("Connected")
    });
    socket.on("tracking_data",(new_data)=>{
      console.log(new_data);
      let data;

      try {
        data = JSON.parse(new_data);        
      } catch (error) {
        console.log("Parsing error: ",error);
        data={lat:0,lang:0}
      }
      setData(data);
    })
    socket.on("disconnect",()=>{
      setMessage("Disconnected")
    });
    return;
  },[])*/

  //if(!showMain) return <SplashScreen isOnline={isOnline} retry={()=>window.location.reload()}/>
  
  return (
    <>
     {showLoader && <Loader show={showLoader}/>}
      {!isLogin ? <Login handleLoginForm={handleLogin} loginMessage={loginMessage}/> : <Home userDetail={userDetail}  logout={()=>{setIsLogin(false);setLoginMessage(null)}}/>}

    </>
  )
}

export default App;
