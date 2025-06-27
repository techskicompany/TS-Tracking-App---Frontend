import { useEffect, useState } from 'react';
import './Header.css';
import {Bell,Settings, User} from 'lucide-react';
import logo from '../../assets/Logo.webp'
function Header({onLogout}){
    const [currentPannel,setCurrentPannel] = useState(null)
    const [showPannel,setShowPannel] = useState(false)
    
    useEffect(()=>{
        const handleClick=(e)=>{
            const clickedItem =e.target.parentNode; 
            if(!clickedItem.classList.contains("nav-item")){
                setShowPannel(false);
      
            }else{
                setShowPannel(true);
                setCurrentPannel(clickedItem.classList[1])
            }
        }
        document.addEventListener("click",(e)=>{
            handleClick(e);
        });
        
    },[showPannel])
    return (
        <>
            <header>
                <nav>
                    <div className='logo'>
                        <img src={logo} alt='tech ski logo'/>
                        <h3>Tech Ski</h3>
                        
                    </div>
                    
                    <ul className='nav-menu'>
                        <li className='nav-item Notification' ><Bell size={22}/></li>
                        <li className='nav-item Settings' ><Settings size={22}/></li>
                        <li className='nav-item User' ><User size={22} strokeWidth={2.5}/></li>
                        <button className='logout-btn' onClick={onLogout}>Log Out</button>
                    </ul>
                </nav>
            
                 <DropDown type={currentPannel} show={showPannel}/> 
            
            </header>    
        </>
    )
}
function DropDown({type,show}){
    return(
        <>
            <div className={show?"pannel show":"pannel"}>
                <h3>{type} Pannel</h3>
            </div>
        </>
    )
}
function hidePanne(){
    
}
export default Header;