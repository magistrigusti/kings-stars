
var ALF = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И',
    'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т',
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Э', 'Ю', 'Я'
];

var FIRST_TIME;

var HAND = ['Л', 'П', 'О'];
var LEG = ['П', 'О', 'Л'];
let ERROR;
var ALF;
let set = 1200;
let currentIndex = 0;
let alfIndex = 0;
let SETH = 0;
let NEWHAND;
var TimesColor;
var TimesExtColor;
var handIn = document.getElementById("putHand");
var legIn = document.getElementById("putLeg");
var colorSimle = document.getElementById("color");
var colorExtra = document.getElementById("ColorExt");
var Extra = document.getElementById("On");
var SuperExtra = document.getElementById("super");
var Theme = document.getElementById("theme");
var SUPER = document.getElementById("super").value;

let modal1 = document.querySelector('#modalEn');
let modal3 = document.querySelector('#modalHe');
let btn = document.querySelector('#openModal');
let close = document.querySelector('.close');


let set2 = (set * 3) + 100;
let set3 = set * 27;

let TIME = document.getElementById("start").value;
let INTERVAL1;
let interTime;
let HOLD = document.getElementById("speed").value;
let SHRIFT;
let SISE;
let SISE1;
let SISE2;
let SISE3;

var RED = document.getElementById("alfavit").style.color = "red";
var ORANGE = document.getElementById("alfavit").style.color = "orange";
var YELLOW = document.getElementById("alfavit").style.color = "yellow";
var GREEN = document.getElementById("alfavit").style.color = "green";
var BLUE = document.getElementById("alfavit").style.color = "blue";
var INDIGO = document.getElementById("alfavit").style.color = "indigo";
var VIOLET = document.getElementById("alfavit").style.color = "violet";
var GRAY = document.getElementById("alfavit").style.color = "gray";
var BLACK = document.getElementById("alfavit").style.color = "black";

var colorNow = document.getElementById("color").value;

var menuItem = document.querySelector("#window");
var dropDownMenu = document.querySelector("#top");
var dropDownMenu2 = document.getElementById("scrDown");


 var Play = document.getElementById("playTime");
 var Stop = document.getElementById("stopTime");
 var resTim = document.getElementById("start");

resTim.addEventListener("click", function () {
    Play.addEventListener("mousemove",function(){
        Play.style.backgroundColor = " rgb(100, 121, 255)"  
         Play.style.transition = "0.5s"
    })
    Play.addEventListener("mouseleave",function(){
        Play.style.backgroundColor = "rgb(230, 230, 230)"
         Play.style.transition = "0.5s"
    })  
    Stop.addEventListener("mousemove",function(){
        Stop.style.backgroundColor = "rgb(255, 121, 121)"
        Stop.style.transition = "0.5s"
    }) 
    Stop.addEventListener("mouseleave",function(){
        Stop.style.backgroundColor = "rgb(230, 230, 230)"
        Stop.style.transition = "0.5s"
    })  
    
    Stop.style.backgroundColor = "rgb(230, 230, 230)"
    Stop.style.width = "30px";
    Stop.style.height = "30px";
    Play.style.backgroundColor = "rgb(230, 230, 230)"
    Play.style.width = "30px";
    Play.style.height = "30px";
 })

Play.addEventListener("click", function() {  
    Stop.removeEventListener("click",function(){});
    Stop.addEventListener("mousemove",function(){
        Stop.style.backgroundColor = "rgb(255, 121, 121)"
    })
    Stop.addEventListener("mouseleave",function(){
        Stop.style.backgroundColor = " rgb(158, 158, 158)"
    })
    Play.addEventListener("mouseleave",function(){
        Play.style.backgroundColor = "rgb(0, 4, 213)"
    })    
    Play.style.backgroundColor = " rgb(0, 4, 213)"
    Play.style.transition = "0.5s"
    Play.style.width = "40px";
    Play.style.height = "40px";
    Stop.style.backgroundColor = "rgb(158, 158, 158)"
    Stop.style.transition = "0.5s"
    Stop.style.width = "30px";
    Stop.style.height = "30px";    
    clearInterval(INTERVAL1); 
    INTERVAL1 = setInterval(function () { newCountDown() }, 1000) 
 })

 Play.addEventListener("mousemove",function(){
    Play.style.backgroundColor = "rgb(100, 121, 255)"  
     Play.style.transition = "0.5s"
})

Play.addEventListener("mouseleave",function(){
    Play.style.backgroundColor = "rgb(230, 230, 230)"
     Play.style.transition = "0.5s"
})

Stop.addEventListener("mousemove",function(){
    Stop.style.backgroundColor = "rgb(255, 121, 121)"
    Stop.style.transition = "0.5s"
})

Stop.addEventListener("mouseleave",function(){
    Stop.style.backgroundColor = "rgb(230, 230, 230)"
    Stop.style.transition = "0.5s"
})
 
Stop.addEventListener("click", function(){
    Play.removeEventListener("click",function(){});
    Play.addEventListener("mousemove",function(){
        Play.style.backgroundColor = " rgb(100, 121, 255)"  
    })
    Play.addEventListener("mouseleave",function(){
        Play.style.backgroundColor = " rgb(158, 158, 158)"
    })
  
    Stop.addEventListener("mouseleave",function(){
        Stop.style.backgroundColor = "rgb(227, 0, 0)"
    })
    Stop.style.backgroundColor = "rgb(227, 0, 0)"
    Stop.style.width = "40px";
    Stop.style.height = "40px";
    Stop.style.transition = "0.5s"
    Play.style.backgroundColor = "rgb(158, 158, 158)"
    Play.style.transition = "0.5s"
    Play.style.width = "30px";
    Play.style.height = "30px";
    clearInterval(INTERVAL1);
    // this.removeEventListener;
})

let setTimes = document.getElementById("start");

setTimes.addEventListener("change", function() {
    clearInterval(INTERVAL1);
    setTimer();
    newCountDown();
})

 const newCountDown = () => {   
     while (TIME != -1) {
    let countDownEl = document.getElementById("countdown")
    let minutes = Math.floor(TIME / 60);
    let seconds = TIME % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let DUBLE = countDownEl.innerHTML = `${minutes} : ${seconds}`;
    document.getElementById("dublicate").value = DUBLE;
    TIME--;
    if (TIME < 0) {
        clear(); 
        clearTimeout(timeout); 
        document.getElementById("window").style.display = "none"
        document.getElementById("block").style.display = "none"      
        document.getElementById("background").style.display = "grid"      
        document.getElementById("top").style.position = "static"
        document.getElementById("top").style.display = "none"
    }
    break
}  

}

function setTimer() {
    TIME = document.getElementById("start").value
    console.log(TIME)
}

// Интервалы 

var Times_Alf = setInterval(function () { newLetters() }, set2)

var Times_1 = setInterval(function () { newHands() }, set2)

var Times_3  = setInterval(function () { randomLegs(), randomHands(), setFont(), randomLetters()},HOLD);

legIn.addEventListener("click", function (){
    clear();
    if (legIn.checked) {       
        document.getElementById("leg").style.display = "block";
        if(handIn.checked){
            document.getElementById("hand").style.display = "block";
            if (colorSimle.checked) {
                if (Extra.checked) {      
                    clear()
                    Times_3 = setInterval(function () {
                        setFontEx(), randomLegs(), randomHands(), randomLetters(), extra(), setColor()
                    },interTime);
                } else if (SuperExtra.checked) {
                        clear();
                        document.getElementById("MixPsevdo3").style.display = "block"
                        TimesColor = setInterval(function () {
                            setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                            setColor(), randomLetters()
                        }, interTime); 
                    } else {
                        TimesColor = setInterval(function () {
                            randomHands(), randomLegs(), setFont(), setColor(),
                                randomLetters()
                        }, interTime);
                    }    
            } else if (colorExtra.checked) {
                        if (Extra.checked) {      
                            clear()
                            Times_3 = setInterval(function () {
                                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra(), 
                                setColorAlf(), setColorHand(), setColorLeg()
                            },interTime);
                            }else if (SuperExtra.checked) {
                                document.getElementById("MixPsevdo3").style.display = "block"
                                clear();
                                TimesColor = setInterval(function () {
                                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                                    setColorAlf(), setColorLeg(), setColorHand(), randomLetters()
                                }, interTime);      
                             } else{
                                 TimesExtColor = setInterval(function () {
                                randomHands(), randomLegs(), setFont(),
                                randomLetters(), setColorAlf(), setColorLeg(), setColorHand()
                                }, interTime);
                            }      
                    } else {
                        if (Extra.checked) {      
                            clear()
                            Times_3 = setInterval(function () {
                                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra()
                            },HOLD);
                        } else if (SuperExtra.checked) {
                                clear();
                                document.getElementById("MixPsevdo3").style.display = "block"
                                Times_3 = setInterval(function () {
                                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(),
                                     randomLetters()
                                }, HOLD);     
                            } else{
                            Times_3  = setInterval(function () { randomLegs(), randomHands(), setFont(), randomLetters()},HOLD);
                        }                        
                    }     
        } else{
            document.getElementById("MixPsevdo2").style.display = "none"
            if (Extra.checked) {      
                clear()
                Times_3 = setInterval(function () {
                    setFontEx(), randomLegs(), randomLetters(), extra()
                },HOLD);
            } else if (SuperExtra.checked) {
                    clear();
                    Times_3 = setInterval(function () {
                        setFontEx(), randomLegs(), superExtraLet(), superExtraLeg(),
                         randomLetters()
                    }, HOLD);     
                } else{
                    Times_3  = setInterval(function () { randomLegs(), setFont(), randomLetters()},HOLD);
            } 
            Times_3  = setInterval(function () { randomLegs(), setFont(), randomLetters()},HOLD);
        }
    } else {
        document.getElementById("MixPsevdo3").style.display = "none"

        document.getElementById("leg").style.display = "none";
        handIn.checked = true;
        document.getElementById("hand").style.display = "block";
        if (colorSimle.checked) {
            if (Extra.checked) {      
                clear()
                Times_3 = setInterval(function () {
                    setFontEx(), randomHands(), randomLetters(), extra(), setColor()
                },interTime);
            } else if (SuperExtra.checked) {
                    clear();
                    document.getElementById("MixPsevdo2").style.display = "block"
                    TimesColor = setInterval(function () {
                        setFontEx(), randomHands(), superExtraLet(), superExtraHan(),
                        setColor(), randomLetters()
                    }, interTime); 
                } else {
                    TimesColor = setInterval(function () {
                        randomHands(), setFont(), setColor(),
                            randomLetters()
                    }, interTime);
                }    
        } else if (colorExtra.checked) {
                    if (Extra.checked) {      
                        clear()
                        Times_3 = setInterval(function () {
                            setFontEx(), randomHands(), randomLetters(), extra(), 
                            setColorAlf(), setColorHand()
                        },interTime);
                        }else if (SuperExtra.checked) {
                            clear();
                            document.getElementById("MixPsevdo2").style.display = "block"
                            TimesColor = setInterval(function () {
                                setFontEx(), randomHands(), superExtraLet(), superExtraHan(),
                                setColorAlf(),  setColorHand(), randomLetters()
                            }, interTime);      
                         } else{
                             TimesExtColor = setInterval(function () {
                            randomHands(), setFont(),
                            randomLetters(), setColorAlf(), setColorHand()
                            }, interTime);
                        }      
                } else {
                    if (Extra.checked) {      
                        clear()
                        Times_3 = setInterval(function () {
                            setFontEx(), randomHands(), randomLetters(), extra()
                        },HOLD);
                    } else if (SuperExtra.checked) {
                            clear();
                            document.getElementById("MixPsevdo2").style.display = "block"
                            Times_3 = setInterval(function () {
                                setFontEx(), randomHands(), superExtraLet(), superExtraLeg(), superExtraHan(),
                                 randomLetters()
                            }, HOLD);     
                        } else{
                        Times_3  = setInterval(function () { randomHands(), setFont(), randomLetters()},HOLD);
                    }  
            } 
    }
    
})
handIn.addEventListener("click", function (){
    clear();
    if (handIn.checked) {
        document.getElementById("hand").style.display = "block";
        if(legIn.checked){
            document.getElementById("leg").style.display = "block";
            if (colorSimle.checked) {
                if (Extra.checked) {      
                    clear()
                    Times_3 = setInterval(function () {
                        setFontEx(), randomLegs(), randomHands(), randomLetters(), extra(), setColor()
                    },interTime);
                } else if (SuperExtra.checked) {
                        clear();
                        document.getElementById("MixPsevdo3").style.display = "block"
                        TimesColor = setInterval(function () {
                            setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                            setColor(), randomLetters()
                        }, interTime); 
                    } else {
                        TimesColor = setInterval(function () {
                            randomHands(), randomLegs(), setFont(), setColor(),
                                randomLetters()
                        }, interTime);
                    }    
            } else if (colorExtra.checked) {
                        if (Extra.checked) {      
                            clear()
                            Times_3 = setInterval(function () {
                                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra(), 
                                setColorAlf(), setColorHand(), setColorLeg()
                            },interTime);
                            }else if (SuperExtra.checked) {
                                clear();
                                TimesColor = setInterval(function () {
                                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                                    setColorAlf(), setColorLeg(), setColorHand(), randomLetters()
                                }, interTime);      
                             } else{
                                 TimesExtColor = setInterval(function () {
                                randomHands(), randomLegs(), setFont(),
                                randomLetters(), setColorAlf(), setColorLeg(), setColorHand()
                                }, interTime);
                            }      
                    } else {
                        if (Extra.checked) {      
                            clear()
                            Times_3 = setInterval(function () {
                                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra()
                            },HOLD);
                        } else if (SuperExtra.checked) {
                                clear();
                                document.getElementById("MixPsevdo2").style.display = "block"
                                Times_3 = setInterval(function () {
                                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(),
                                     randomLetters()
                                }, HOLD);     
                            } else{
                            Times_3  = setInterval(function () { randomLegs(), randomHands(), setFont(), randomLetters()},HOLD);
                        }
            } 
        } else{
            document.getElementById("MixPsevdo3").style.display = "none"
            document.getElementById("MixPsevdo2").style.display = "block"
            if (Extra.checked) {      
                clear()
                Times_3 = setInterval(function () {
                    setFontEx(), randomHands(), randomLetters(), extra()
                },HOLD);
            } else if (SuperExtra.checked) {
                    clear();
                    Times_3 = setInterval(function () {
                        setFontEx(), randomHands(), superExtraLet(), superExtraHan(),
                         randomLetters()
                    }, HOLD);     
                } else{
                    Times_3  = setInterval(function () { randomLegs(), setFont(), randomLetters()},HOLD);
            } 
        }
    } else {
        document.getElementById("MixPsevdo2").style.display = "none"                
        document.getElementById("hand").style.display = "none";
        legIn.checked = true;
        document.getElementById("leg").style.display = "block";
        if (colorSimle.checked) {
            if (Extra.checked) {      
                clear()
                Times_3 = setInterval(function () {
                    setFontEx(), randomLegs(), randomLetters(), extra(), setColor()
                },interTime);
            } else if (SuperExtra.checked) {
                    clear();
                    document.getElementById("MixPsevdo3").style.display = "block"
                    TimesColor = setInterval(function () {
                        setFontEx(), randomLegs(), superExtraLet(), superExtraHan(),
                        setColor(), randomLetters()
                    }, interTime); 
                } else {
                    TimesColor = setInterval(function () {
                        randomLegs(), setFont(), setColor(),
                            randomLetters()
                    }, interTime);
                }    
        } else if (colorExtra.checked) {
                    if (Extra.checked) {      
                        clear()
                        Times_3 = setInterval(function () {
                            setFontEx(), randomLegs(), randomLetters(), extra(), 
                            setColorAlf(), setColorLeg()
                        },interTime);
                        }else if (SuperExtra.checked) {
                            clear();
                            document.getElementById("MixPsevdo3").style.display = "block"
                            TimesColor = setInterval(function () {
                                setFontEx(), randomLegs(), superExtraLet(), superExtraLeg(),
                                setColorAlf(),  setColorLeg(), randomLetters()
                            }, interTime);      
                         } else{
                             TimesExtColor = setInterval(function () {
                            randomLegs(), setFont(),
                            randomLetters(), setColorAlf(), setColorLeg()
                            }, interTime);
                        }      
                } else {
                    if (Extra.checked) {      
                        clear()
                        Times_3 = setInterval(function () {
                            setFontEx(), randomLegs(), randomLetters(), extra()
                        },HOLD);
                    } else if (SuperExtra.checked) {
                            clear();
                            document.getElementById("MixPsevdo3").style.display = "block"
                            Times_3 = setInterval(function () {
                                setFontEx(), randomLegs(), superExtraLet(), superExtraLeg(),
                                 randomLetters()
                            }, HOLD);     
                        } else{
                        Times_3  = setInterval(function () { randomLegs(), setFont(), randomLetters()},HOLD);
                    }
        } 
    }
    
})


ExMix = document.getElementById("super");
Ex = document.getElementById("On");
Speed = document.getElementById("speed");

colorSimle.addEventListener("click", function () {
    resetExtColor();
    clear();
    if(HOLD == set){
        interTime = set;
    } else{
        interTime = HOLD;
    }
    if (colorSimle.checked) {
        if (Extra.checked) {      
            clear()
            Times_3 = setInterval(function () {
                setFontEx(), randomLegs(), randomHands(), randomLetters(), extra(), setColor()
            },interTime);
        } else if (SuperExtra.checked) {
                clear();
                TimesColor = setInterval(function () {
                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                    setColor(), randomLetters()
                }, interTime);     
            } else{
                
            TimesColor = setInterval(function () {
                randomHands(), randomLegs(), setFont(), setColor(),
                    randomLetters()
            }, interTime);
        } 
    } else {
        if (Extra.checked) {      
            clear()
            Times_3 = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra()
            },interTime);       
        } else if (SuperExtra.checked) {
            clear();
            TimesColor = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), superExtraLet(),  
                superExtraHan(), randomLetters()
            }, interTime);
        }  else{
            clear()
        Times_3 = setInterval(function () { randomHands(), randomLegs(), setFont(), randomLetters()},interTime);
        }
    }
})

colorExtra.addEventListener("click", function () {
    resetColor();
    clear();
    if(HOLD == set){
        interTime = set;
    } else{
        interTime = HOLD;
    }
    if (colorExtra.checked) {
        if (Extra.checked) {      
            clear()
            Times_3 = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra(), 
                setColorAlf(), setColorHand(), setColorLeg()
            },interTime);
            }else if (SuperExtra.checked) {
                clear();
                TimesColor = setInterval(function () {
                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraHan(), superExtraLeg(),
                    setColorAlf(), setColorLeg(), setColorHand(), randomLetters()
                }, interTime);      
             } else{
                 TimesExtColor = setInterval(function () {
                randomHands(), randomLegs(), setFont(),
                randomLetters(), setColorAlf(), setColorLeg(), setColorHand()
                }, interTime);
            }      
    } else {
        if (Extra.checked) {      
            clear()
            Times_3 = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), randomLetters(), extra() 
            },interTime);
        } else if (SuperExtra.checked) {
            clear();
            TimesColor = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), superExtraLet(),  superExtraLeg(),
                superExtraHan(), randomLetters()
            }, interTime);      
         } else{
            Times_3 = setInterval(function () { randomHands(), randomLegs(), setFont(), randomLetters()},interTime);
        }    
        
    }
})

// Перемешивание

window.addEventListener("load", () => { newLetters(),setSise(), setLine() });

function newLetters() {
    for (let i = ALF.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [ALF[i], ALF[j]] = [ALF[j], ALF[i]];
        console.log(`NEWALF = ${ALF}`)

    }
}

function newHands() {
    for (let i = HAND.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [HAND[i], HAND[j]] = [HAND[j], HAND[i]];
        console.log(`NEWHAND = ${HAND}`)
    }
}

function newLegs() {
    for (let i = LEG.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [LEG[i], LEG[j]] = [LEG[j], LEG[i]];
        console.log(`NEWLEG = ${LEG}`)
    }
}

function randomLetters() {
    document.getElementById("alfavit").innerText = ALF[alfIndex];
    alfIndex = (alfIndex + 1) % ALF.length;
    console.log(alfIndex)
}

const randomHands = () => {
    document.getElementById("hand").innerText = HAND[currentIndex];
    currentIndex = (currentIndex + 1) % HAND.length;
    console.log(currentIndex)
    console.log(`HAND = ${HAND} + ${HAND}`)
}

const randomLegs = () => {
    document.getElementById("leg").innerText = LEG[currentIndex];
    currentIndex = (currentIndex + 1) % LEG.length;
    console.log(currentIndex)
    console.log(`LEG = ${LEG} + ${LEG}`)
}

colorExtra.addEventListener("click", function () {

    if (this.checked) {

    } else {

    }
})

// Расположение Букв


let setFontEx =() =>{
    let TOP = 60;
    let LEFT = 45;
    console.log("Ex font")
    document.getElementById("block").style.margin = "auto";
    // document.getElementById("block").style.top = TOP + 'hv';
}



let setFont =()=>{
    console.log("Just font")
    SHRIFT = document.getElementById("fill").value;
    let TOP = 30;
    document.getElementById("block").style.position = "static";
    document.getElementById("block").style.top = TOP + 'vh';
    document.getElementById("block").style.margin = " auto";
   

}

let z;
let x;
let width;

let setfontFullScr =() =>{
    
    if(legIn.checked){
        set2Place()
        if(SuperExtra.checked){
            Height.style.lineHeight = "normal";
            set2PlaceSuEx()
           }  else if(Extra.checked){
            Height.style.lineHeight = "normal";
            set2PlaceSuEx()
           }
        if(handIn.checked){
           set3Place()
           if(SuperExtra.checked){
            Height.style.lineHeight = "normal";
            set3PlaceSuEx()
           } else if(Extra.checked){
            Height.style.lineHeight = "normal";
            set3PlaceSuEx()
           }

        }
    }
    if(handIn.checked){
        set2Place()
        if(SuperExtra.checked){
            Height.style.lineHeight = "normal";
            set2PlaceSuEx()
           }  else if(Extra.checked){
            Height.style.lineHeight = "normal";
            set2PlaceSuEx()
           }
        if(legIn.checked){
           set3Place() 
           if(SuperExtra.checked){
            Height.style.lineHeight = "normal";
            set3PlaceSuEx()
           } else if(Extra.checked){
            Height.style.lineHeight = "normal";
            set3PlaceSuEx()
           }
        }
    }
    
    console.log("New + New")
    SHRIFT = document.getElementById("fill").value;
    document.getElementById("block").style.position = "absolute";
    let TOP;
    let LEFT;
}



//  Размер Шрифта

$('#min').click(function(){
      $(this).siblings('input')[0].stepDown();
      setSise();setLine()
  })
  $('#plu').click(function(){  
      $(this).siblings('input')[0].stepUp(); 
      setSise();setLine()
    })
$('#minus').click(function(){
      $(this).siblings('input')[0].stepDown();
      setSise();setLine()
  })
  $('#plus').click(function(){  
      $(this).siblings('input')[0].stepUp(); 
      setSise();setLine()
    })

function setSise() {
    SHRIFT = document.getElementById("fill").value;
    console.log(SHRIFT)
    document.getElementById('alfavit').style.fontSize = SHRIFT + 'px';
    document.getElementById('hand').style.fontSize = SHRIFT + 'px';
    document.getElementById('leg').style.fontSize = SHRIFT + 'px';
    
}
var Height1 = document.getElementById('alfavit');
var Height2 = document.getElementById('hand');
var Height3 = document.getElementById('leg');
var SHRIFT1 = document.getElementById('MixPsevdo3');
var SHRIFT2 = document.getElementById('MixPsevdo1');
var SHRIFT3 = document.getElementById('MixPsevdo2');
var SHRFill = document.getElementById("fill");
var Height = document.getElementById('block');

function set3Place() {
    let TOP;
    let LEFT;
    if(SHRIFT <= 35){
        z = 89
    }else if(SHRIFT <= 40){
        z = 87
    } else if(SHRIFT <= 45){
        z = 85
    }else if(SHRIFT <= 50){
        z = 83
    } else if(SHRIFT <= 55){
        z = 82
    } else if(SHRIFT <= 60){
        z = 80
    }else if (SHRIFT <= 65){
        z = 78
    }else if(SHRIFT <= 70){
        z = 76
    } else if(SHRIFT <= 75){
        z = 75
    } else if(SHRIFT <= 80){
        z = 73
    } else if(SHRIFT <= 85){
        z = 71
    } else if(SHRIFT <= 90){
        z = 69
    }else if(SHRIFT <= 95){
        z = 67
    } else if(SHRIFT <= 100){
        z = 66
    }else if(SHRIFT <= 105){
        z = 64
    } else if(SHRIFT <= 110){
        z = 62
    } else if(SHRIFT <= 115){
        z = 60
    }else if (SHRIFT <= 120){
        z = 59
    }else if(SHRIFT <= 125){
        z = 57
    } else if(SHRIFT <= 130){
        z = 55
    } else if(SHRIFT <= 135){
        z = 53
    } else if(SHRIFT <= 140){
        z = 52
    } else if(SHRIFT <= 145){
        z = 50
    } else if(SHRIFT <= 150){
        z = 48
    }
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';

}
function set2Place() {
    let TOP;
    let LEFT;
    if(SHRIFT <= 35){
        z = 90
    }else if(SHRIFT <= 40){
        z = 89
    } else if(SHRIFT <= 45){
        z = 85
    }else if(SHRIFT <= 50){
        z = 88
    } else if(SHRIFT <= 55){
        z = 87
    } else if(SHRIFT <= 60){
        z = 86
    }else if (SHRIFT <= 65){
        z = 84
    }else if(SHRIFT <= 70){
        z = 83
    } else if(SHRIFT <= 75){
        z = 82
    } else if(SHRIFT <= 80){
        z = 81
    } else if(SHRIFT <= 85){
        z = 79
    } else if(SHRIFT <= 90){
        z = 78
    }else if(SHRIFT <= 95){
        z = 77
    } else if(SHRIFT <= 100){
        z = 76
    }else if(SHRIFT <= 105){
        z = 75
    } else if(SHRIFT <= 110){
        z = 74
    } else if(SHRIFT <= 115){
        z = 73
    }else if (SHRIFT <= 120){
        z = 72
    }else if(SHRIFT <= 125){
        z = 71
    } else if(SHRIFT <= 130){
        z = 70
    } else if(SHRIFT <= 135){
        z = 68
    } else if(SHRIFT <= 140){
        z = 67
    } else if(SHRIFT <= 145){
        z = 66
    } else if(SHRIFT <= 150){
        z = 65
    }
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';

}
function set3PlaceSuEx() {
    z = 40
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';

}
function set2PlaceSuEx() {
    z = 59
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';
}
function set3PlaceEx() {
    let TOP;
    let LEFT;
    if(SHRIFT <= 35){
        z = 85
    }else if(SHRIFT <= 40){
        z = 83
    } else if(SHRIFT <= 45){
        z = 81
    }else if(SHRIFT <= 50){
        z = 79
    } else if(SHRIFT <= 55){
        z = 77
    } else if(SHRIFT <= 60){
        z = 75
    }else if (SHRIFT <= 65){
        z = 73
    }else if(SHRIFT <= 70){
        z = 71
    } else if(SHRIFT <= 75){
        z = 69
    } else if(SHRIFT <= 80){
        z = 67
    } else if(SHRIFT <= 85){
        z = 65
    } else if(SHRIFT <= 90){
        z = 63
    }else if(SHRIFT <= 95){
        z = 61
    } else if(SHRIFT <= 100){
        z = 60
    }else if(SHRIFT <= 105){
        z = 57
    } else if(SHRIFT <= 110){
        z = 55
    } else if(SHRIFT <= 115){
        z = 54
    }else if (SHRIFT <= 120){
        z = 52
    }else if(SHRIFT <= 125){
        z = 50
    } else if(SHRIFT <= 130){
        z = 48
    } else if(SHRIFT <= 135){
        z = 46
    } else if(SHRIFT <= 140){
        z = 44
    } else if(SHRIFT <= 145){
        z = 41
    } else if(SHRIFT <= 150){
        z = 40
    }
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';

}
function set2PlaceEx() {
    let TOP;
    let LEFT;
    if(SHRIFT <= 35){
        z = 90
    }else if(SHRIFT <= 40){
        z = 89
    } else if(SHRIFT <= 45){
        z = 85
    }else if(SHRIFT <= 50){
        z = 88
    } else if(SHRIFT <= 55){
        z = 87
    } else if(SHRIFT <= 60){
        z = 86
    }else if (SHRIFT <= 65){
        z = 84
    }else if(SHRIFT <= 70){
        z = 83
    } else if(SHRIFT <= 75){
        z = 82
    } else if(SHRIFT <= 80){
        z = 81
    } else if(SHRIFT <= 85){
        z = 79
    } else if(SHRIFT <= 90){
        z = 78
    }else if(SHRIFT <= 95){
        z = 77
    } else if(SHRIFT <= 100){
        z = 76
    }else if(SHRIFT <= 105){
        z = 75
    } else if(SHRIFT <= 110){
        z = 74
    } else if(SHRIFT <= 115){
        z = 73
    }else if (SHRIFT <= 120){
        z = 72
    }else if(SHRIFT <= 125){
        z = 71
    } else if(SHRIFT <= 130){
        z = 70
    } else if(SHRIFT <= 135){
        z = 68
    } else if(SHRIFT <= 140){
        z = 67
    } else if(SHRIFT <= 145){
        z = 66
    } else if(SHRIFT <= 150){
        z = 65
    }
    LEFT = Math.floor(Math.random() * 90);
    TOP = Math.floor(Math.random() * z);
    document.getElementById("block").style.left = LEFT + 'vw';
    document.getElementById("block").style.top = TOP + 'vh';

}

function setLine() {
    SHRIFT = parseInt(SHRIFT)
    Height.style.lineHeight = (SHRIFT - 5) + "px";
    console.log(SHRIFT);
    
}
      

function reset() {
    location.reload()
}

function clear() {
    clearInterval(TimesColor);
    clearInterval(TimesExtColor);
    clearInterval(Times_3);
}

let setTimeReal = ()=>{  
        clearInterval(Times_1)
        NewHOLD = HOLD * 3;
        Times_1 = setInterval(function () { newHands(),newLegs() }, NewHOLD);
            clearInterval(Times_Alf)
            NewAlfHOLD = HOLD * 27;
            Times_Alf = setInterval(function () { newLetters() }, NewAlfHOLD)
        return Times_Alf     
}

let setTime1 =()=>{
    HOLD = document.getElementById("speed").value
    if(HOLD == set){
        interTime = set;
    } else{
        interTime = HOLD;
    } 
    if (Extra.checked) {
        Height.style.lineHeight = "normal";
        if (colorSimle.checked) {
            clear();
            TimesColor = setInterval(function () {
                    setFontEx(), randomHands(), randomLegs(), extra(), setColor(),
                    randomLetters()
            }, interTime);  
            setTimeReal();
        } else if (colorExtra.checked) {
            clear();
            TimesExtColor = setInterval(function () {
                    setFontEx(), randomHands(),  randomLegs(), extra(),
                    randomLetters(), setColorAlf(), setColorHand()
            }, interTime);
            setTimeReal();
        } else {
            clear()
        Times_3 = setInterval(function () {
            setFontEx(), randomHands(),  randomLegs(), randomLetters(), extra()
        },interTime);
        setTimeReal();
        }   
    } else if (SuperExtra.checked) {
        Height.style.lineHeight = "normal";
            if (colorSimle.checked) {
                clear();
                TimesColor = setInterval(function () {
                    setFontEx(), randomHands(),  randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(), 
                    setColor(), randomLetters()
                }, interTime);
                setTimeReal();  
            } else if (colorExtra.checked) {
                clear();
                TimesExtColor = setInterval(function () {
                        setFontEx(), randomHands(),  randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(),
                        randomLetters(), setColorAlf(), setColorHand()
                }, interTime);
                setTimeReal();
            } else {
                clear()
                Times_3 = setInterval(function () {
                    setFontEx(), randomHands(),  randomLegs(), randomLetters(), superExtraLet(), superExtraLeg(), superExtraHan()
            },interTime);
            setTimeReal();          
            }  
        } else{
        if (colorSimle.checked) {
            clear();
            console.log("Simple in setTime1()")
            TimesColor = setInterval(function () {
                randomHands(),  randomLegs(), setFont(), setColor(), 
                    randomLetters()
            }, interTime); 
            setTimeReal();
            console.log("Simple in setTime1()2")  
        } else if (colorExtra.checked) {
            clear();
            TimesExtColor = setInterval(function () {
                randomHands(),  randomLegs(), setFont(),
                    randomLetters(), setColorAlf(), setColorHand()
            }, interTime);
            setTimeReal();     
        } else {
            clear()
            console.log("else in setTime1()")
            Times_3 = setInterval(function () { randomHands(), randomLegs(), setFont(), randomLetters()},interTime);
            setTimeReal();
            //  clear() 
        } 
            
    } 
}
     
startExtra = ()=>{
    setLine()
    clear()
    document.getElementById("plu").style.display = "none"
    document.getElementById("min").style.display = "none"
    document.getElementById("MixPsevdo1").style.display = "none"
    document.getElementById("MixPsevdo2").style.display = "none"
    document.getElementById("MixPsevdo3").style.display = "none"
    document.getElementById("fill").style.display = "block"
    document.getElementById("super").checked = false;
    HOLD = document.getElementById("speed").value
    setTimeReal();
    if(HOLD == set){
        interTime = set;
    } else{
        interTime = HOLD;
    }
    if (Extra.checked) {
        Height.style.lineHeight = "normal";
        if (colorSimle.checked) {
            clear();
            TimesColor = setInterval(function () {
                    setFontEx(),  randomHands(), randomLegs(),  extra(), setColor(),
                    randomLetters()
            }, interTime);  
        } else if (colorExtra.checked) {
            clear();
            TimesExtColor = setInterval(function () {
                    setFontEx(),  randomHands(), randomLegs(),  extra(),
                    randomLetters(), setColorAlf(), setColorHand(), setColorLeg()
            }, interTime);

        } else {
            clear()
            Times_3 = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(),  randomLetters(), extra()
        },interTime);
        }   
    }else{ 
        document.getElementById("plu").style.display = "block"
        document.getElementById("min").style.display = "block"  
        document.getElementById("fill").value = 100;
        setSise();
        if (colorSimle.checked) {
            clear();
            TimesColor = setInterval(function () {
                    setFont(), randomHands(), randomLegs(), setColor(),
                    randomLetters()
            }, interTime);  
        } else if (colorExtra.checked) {
            clear();
            TimesExtColor = setInterval(function () {
                    setFont(), randomHands(), randomLegs(), 
                    randomLetters(), setColorAlf(), setColorHand(), setColorLeg()
            }, interTime);
        } else{
            document.getElementById("plu").style.display = "block"
            document.getElementById("min").style.display = "block"
            clear()
            Times_3 = setInterval(function () { setFont(), randomHands(), randomLegs(),  randomLetters()},interTime);
        }
    }
}

let startSuperExtra = ()=>{
    setLine()
    clear();
    document.getElementById("fill").style.display = "none"
    document.getElementById("plu").style.display = "none"
    document.getElementById("min").style.display = "none"
    document.getElementById("MixPsevdo1").style.display = "block"
    document.getElementById("MixPsevdo2").style.display = "block"
    document.getElementById("MixPsevdo3").style.display = "block"

    Height.style.lineHeight = "normal";
    document.getElementById("On").checked = false;
    HOLD = document.getElementById("speed").value
    setTimeReal();
    if(HOLD == set){
        interTime = set;
    } else{
        interTime = HOLD;
    }
    if (SuperExtra.checked) {
        Height.style.lineHeight = "normal";
        if (colorSimle.checked) {
            clear();
            if(legIn.checked) {
                document.getElementById("MixPsevdo3").style.display = "block"
            } else {
                document.getElementById("MixPsevdo3").style.display = "none"
            }
            if(handIn.checked) {
                document.getElementById("MixPsevdo2").style.display = "block"
            } else {
                document.getElementById("MixPsevdo2").style.display = "none"
            }
            TimesColor = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(), 
                setColor(), randomLetters()
            }, interTime);  
        } else if (colorExtra.checked) {
            clear();
            if(legIn.checked) {
                document.getElementById("MixPsevdo3").style.display = "block"
            } else {
                document.getElementById("MixPsevdo3").style.display = "none"
            }
            if(handIn.checked) {
                document.getElementById("MixPsevdo2").style.display = "block"
            } else {
                document.getElementById("MixPsevdo2").style.display = "none"
            }
            TimesExtColor = setInterval(function () {
                    setFontEx(), randomHands(), randomLegs(), superExtraLet(), superExtraLeg(), superExtraHan(),
                    randomLetters(), setColorAlf(), setColorHand(), setColorLeg()
            }, interTime);
        } else {
            clear()
            if(legIn.checked) {
                document.getElementById("MixPsevdo3").style.display = "block"
            } else {
                document.getElementById("MixPsevdo3").style.display = "none"
            }
            if(handIn.checked) {
                document.getElementById("MixPsevdo2").style.display = "block"
            } else {
                document.getElementById("MixPsevdo2").style.display = "none"
            }
            Times_3 = setInterval(function () {
                setFontEx(), randomHands(), randomLegs(), randomLetters(), superExtraLeg(), superExtraLet(), superExtraHan()
        },interTime);
        }   
    }else{  
        document.getElementById("fill").style.display = "block"
            document.getElementById("plu").style.display = "block"
            document.getElementById("min").style.display = "block"
            document.getElementById("MixPsevdo1").style.display = "none"
            document.getElementById("MixPsevdo2").style.display = "none" 
            document.getElementById("MixPsevdo3").style.display = "none" 
            
        document.getElementById("fill").value = 100;
        setSise();
        setLine()
        if (colorSimle.checked) {
            clear();
            TimesColor = setInterval(function () {
                    setFont(), randomLegs(), randomHands(), setColor(),
                    randomLetters()
            }, interTime);  
        } else if (colorExtra.checked) {
            clear();
            TimesExtColor = setInterval(function () {
                    setFont(), randomHands(), randomLegs(),
                    randomLetters(), setColorAlf(), setColorHand(), setColorLeg()
            }, interTime);
        } else{
            setLine()
            document.getElementById("fill").style.display = "block"
            document.getElementById("plu").style.display = "block"
            document.getElementById("min").style.display = "block"
            document.getElementById("MixPsevdo1").style.display = "none"
            document.getElementById("MixPsevdo2").style.display = "none"
            document.getElementById("MixPsevdo3").style.display = "none" 
            clear()
            Times_3 = setInterval(function () { setFont(), randomLegs(), randomHands(), randomLetters()},interTime);
           
        }
    }

}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('FullSc').click();
    }
  });
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
      document.getElementById('plus').click();
    }
  });
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      document.getElementById('minus').click();
    }
  });
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      document.getElementById('plu').click();
    }
  });
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      document.getElementById('min').click();
    }
  });
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.getElementById('sise').click();
    }
  });



function superExtraLet() {
    SISE3 = Math.floor((Math.random() * 100) + 30);
    document.getElementById("alfavit").style.fontSize = SISE3 + 'px';
    document.getElementById("MixPsevdo1").innerText = SISE3
    Height.style.lineHeight = "normal";
  
}

function superExtraHan() {
    SISE2 = Math.floor((Math.random() * 100) + 30);
    asd = document.getElementById("hand").style.fontSize = SISE2 + 'px';
    console.log(asd)
    document.getElementById("MixPsevdo2").innerText = SISE2
    Height.style.lineHeight = "normal";
}
function superExtraLeg() {
    Height.style.lineHeight = "normal";
    SISE1 = Math.floor((Math.random() * 100) + 30);
    asdd = document.getElementById("leg").style.fontSize = SISE1 + 'px';
    console.log(asdd)
    document.getElementById("MixPsevdo3").innerText = SISE1
}

function extra() {
    Height.style.lineHeight = "normal";
    document.getElementById("fill").setAttribute('type', 'number');
    SISE = Math.floor((Math.random() * 100) + 30);
    document.getElementById("fill").value = SISE;
    document.getElementById("alfavit").style.fontSize = SISE + 'px';
    document.getElementById("hand").style.fontSize = SISE + 'px';
    document.getElementById("leg").style.fontSize = SISE + 'px';
    // document.getElementsByClassName("sise").innerText = "Extra"

    console.log(SISE);
    // setFont()

}

blockTime = document.getElementById("dublicate")

var elem = document.documentElement;
     let fullSreenStart = () => {                       
        HOLD = document.getElementById("speed").value;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
            setFont = setfontFullScr;
            setFontEx = setfontFullScr;
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen(); 
            setFont = setfontFullScr;
            setFontEx = setfontFullScr;
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen(); 
            setFont = setfontFullScr;   
            setFontEx = setfontFullScr;  
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
            setFont = setfontFullScr;   
            setFontEx = setfontFullScr;  
        } 



      menuItem.addEventListener("mousemove", function (){
            clearTimeout(timeout);
            dropDownMenu.style.display = "grid";
            timeout = setTimeout(() => {
                console.log("inFull1")
                dropDownMenu.style.display = 'none';
                }, 5000);
                
        })
        dropDownMenu.addEventListener("mouseleave", function(){
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log("inFull2")
                dropDownMenu.style.display = 'none';
                }, 5000);
                if(dropDownMenu.style.display = "grid")
                    menuItem.style.cursor = "default"; 
        })  

}

let to = 5000, ts = 0; 

let timeout;

addEventListener('mousemove', () => {
    ts = Date.now();
    menuItem.style.cursor = "default";
    dropDownMenu.style.display = "grid";
  });
  
  setInterval(() => {
    if (Date.now() - ts > to)
      menuItem.style.cursor = "none";
  }, 99)

function resetColor() {
    document.getElementById("color").checked = false; 
    clear(); 
    console.log("resColor") 
    let black = document.querySelector("body").style.backgroundColor
    if (black == "black" ){
            document.getElementById("alfavit").style.color = "white";
            document.getElementById("hand").style.color = "white";
            document.getElementById("leg").style.color = "white";
    } else {
        document.getElementById("alfavit").style.color = "black";
        document.getElementById("hand").style.color = "black";
        document.getElementById("leg").style.color = "black";
    }   
}

function setColor() {
    const COLORS = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'VIOLET', 'GRAY'];
    var color = Math.floor(Math.random() * 8);
    newColor1 = document.getElementById("alfavit").style.color = COLORS[color];
    newColor2 = document.getElementById("hand").style.color = COLORS[color];
    newColor3 = document.getElementById("leg").style.color = COLORS[color];
    console.log("SetColor - Проверка")
}

function setColorAlf() {
    const COLORS = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'VIOLET', 'GRAY'];
    var color = Math.floor(Math.random() * 8);
    newColor1 = document.getElementById("alfavit").style.color = COLORS[color];
}

function setColorHand() {
    const COLORS = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'VIOLET', 'GRAY'];
    var color = Math.floor(Math.random() * 8);
    newColor2 = document.getElementById("hand").style.color = COLORS[color];
}
function setColorLeg() {
    const COLORS = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'VIOLET', 'GRAY'];
    var color = Math.floor(Math.random() * 8);
    newColor2 = document.getElementById("leg").style.color = COLORS[color];
}

function resetExtColor() {
    document.getElementById("ColorExt").checked = false;
    let black = document.querySelector("body").style.backgroundColor
    if (black == "black" ){
            document.getElementById("alfavit").style.color = "white";
            document.getElementById("hand").style.color = "white";
            document.getElementById("leg").style.color = "white";
    } else {
        document.getElementById("alfavit").style.color = "black";
        document.getElementById("hand").style.color = "black";
        document.getElementById("leg").style.color = "black";
    }  
}

function closeTheme() {
    Theme.checked = false;
    document.querySelector("body").style.backgroundColor = "white";
    document.getElementById("alfavit").style.color = "black"
    document.getElementById("hand").style.color = "black"
    document.getElementById("leg").style.color = "black"
}

function setTheme() {
    document.querySelector("body").style.backgroundColor = "black";
    document.getElementById("alfavit").style.color = "white"
    document.getElementById("hand").style.color = "white"
    document.getElementById("leg").style.color = "white"
}

Theme.addEventListener("click", function () {
    if (this.checked) {
        setTheme()
    } else {
        closeTheme();
    }
})

// Инструкция

// window.onclick = function () {
//     modal.style.display = 'none';
   
// };

