import globals from "../../globals";

class MarketHelper{

    static initMarketFunctions(data){

        data.gotoMarketClickNum = Number(data.gotoMarketClickNum);
        data.gotoMarketUpClickNum = Number(data.gotoMarketUpClickNum);
        data.gotoMarketAfterTime = Number(data.gotoMarketAfterTime);
        data.gotoMarketAfterRetryNum = Number(data.gotoMarketAfterRetryNum);
        
        globals.curGoToMarketClickNum = 0;
        globals.curGoToMarketClickUpNum = 0;
        globals.curGoToMarketRetryNum = 0;

        let main = globals.main;

        globals.retryMarketFunctions = (didWon) => {
            globals.curGoToMarketRetryNum++;

            if(didWon){
                if(data.gotoMarketOnSecondLevel){
                    setTimeout(()=>{
                        app.gotoMarketAtNextClick = true;
                    }, 800);
                }
            }
            else{
                if(data.gotoMarketAfterRetryNum){
                    if(globals.curGoToMarketRetryNum >= data.gotoMarketAfterRetryNum){
                        setTimeout(()=>{
                            app.gotoMarketAtNextClick = true;
                        }, 800);
                    }
                }
            }
        }

        let callFinish = () => {
            if(app.type == 'vungle'){
                setTimeout(()=>{
                    main.gameFinished(true, null, null, true);
                }, 5000);
            }
            else{
                main.gameFinished(true, null, null,true);
            }
        }

        let canGoToMarket = true;
        let toTheMarket = () => {
            if(!canGoToMarket)return;

            if(data.gotoMarketOnce){
                canGoToMarket = false;
            }

            main.gotoLink();
            callFinish();
        }

        function checkMarket(e){
            main.interacted();
            if(app.gotoMarketAtNextClick){
                toTheMarket();                
                return;
            }
            globals.curGoToMarketClickNum++;
    
            if(data.gotoMarketClickNum && globals.curGoToMarketClickNum >= data.gotoMarketClickNum){
                toTheMarket();                
                return;
            }
    
            if(data.gotoMarketAfterTime && main.time.passed() > data.gotoMarketAfterTime){
                toTheMarket();                
            }    
        }

        let update = () => {            

            if(!main.gamePaused && data.gotoMarketAfterTime && main.time.passed() > data.gotoMarketAfterTime){
                toTheMarket();
                return;                
            }

            requestAnimationFrame(update);
        }

        update();
    
        document.body.addEventListener("touchstart", checkMarket);
        if ('ontouchstart' in document.documentElement) {
    
        }
        else{
            document.body.addEventListener("mousedown", checkMarket);
        }
    
    
        function checkMarketUp(e){
    
            globals.curGoToMarketClickUpNum++;    
    
            if(data.gotoMarketUpClickNum && globals.curGoToMarketClickUpNum >= data.gotoMarketUpClickNum){
                toTheMarket();                
                return;
            }
    
        }
    
        document.body.addEventListener("touchend", checkMarketUp);
        if ('ontouchstart' in document.documentElement) {
    
        }
        else{
            document.body.addEventListener("mouseup", checkMarketUp);
        }
    }
}

export default MarketHelper;