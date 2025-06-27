import './Loader.css'
function Loader ({show}){
    return(
        <>
            <div className={show?"loader-container show":"loader-container"}>
                <div className='spinner'></div>
            </div>
        </>
    )
}
export default Loader;