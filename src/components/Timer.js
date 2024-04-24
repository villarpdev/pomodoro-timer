import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import AlertButton from './AlertButton';
import { useContext, useEffect, useState, useRef} from 'react';
import SettingsContext from './SettingsContext';

import restTime from '../sounds/restTime.mp3';
import workTime from '../sounds/workTime.mp3';

const red = '#f54e4e';
const green = '#4aec8c';

function Timer() {

    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); //work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick(){
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }


    useEffect(() => {

        function switchMode(){
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;
            
            setMode(nextMode);
            modeRef.current = nextMode;
    
            if (nextMode === 'break') {
                play(restTime);
                settingsInfo.toast.success('Te has ganado un descanso!',{ duration: 4000});
                
            }else{
                play(workTime);
                settingsInfo.toast.success('Vuelta al trabajo', { duration: 4000 , iconTheme:{ primary: red, }});
            }

            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
        }
        
        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);

        const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }

            if(secondsLeftRef.current === 0) {
                return switchMode();
            }

            tick();

        },1000);

        return () => clearInterval(interval);
    },[settingsInfo]);

    const totalSeconds = mode === 'work' 
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60
    ;

    const percentage = Math.round(secondsLeft / totalSeconds * 100) ;

    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) seconds = '0'+seconds;

    function play (sound) {
        new Audio(sound).play();
    }
    return(
        <div>
            <CircularProgressbar 
                value={percentage} 
                text={minutes + ':' + seconds} 
                styles={buildStyles({
                textColor:'#fff',
                pathColor: mode === 'work' ? red : green,
                trailColor:'rgba(255,255,255,0.2)'
            })} />
            <div style={{marginTop:'20px'}}>
                {isPaused 
                ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />
                }
            </div>
            <div style={{marginTop:'20px', justifyContent:'space-between', display:'flex'}}>
                <SettingsButton 
                    onClick={() => settingsInfo.setShowSettings(!settingsInfo.showSettings)}
                />
                <AlertButton
                    style={{
                        minWidth:'155px',
                        display:'flex',
                        alignItems:'center',
                        justifyContent: 'center'
                        }} 
                    onClick={() => settingsInfo.toast.success('Vuelta al trabajo', { duration: 4000 , iconTheme:{ primary: red, }})}
                />
            </div>
        </div>
    );
}

export default Timer;