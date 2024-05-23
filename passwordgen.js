const inputslider=document.querySelector("[slider-len]");
const length=document.querySelector('[data-length-num]');
const passdis= document.querySelector('[data-display]') ;
const copymsg=document.querySelector('[data-copied-msg]');
const copybtn=document.querySelector('[copy-btn]');
const uppercase=document.querySelector('#uppercase');
const lowercase=document.querySelector('#lowercase');
const numbers=document.querySelector('#number');
const symbols=document.querySelector('#symbol');
const indicator=document.querySelector('[data-indicator]');
const genbtn=document.querySelector('.genpass');
const allcheck=document.querySelectorAll("input[type=checkbox]");
const symbolstring="!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~";

let password="";
let passwordlen=10;
let checkcount=0;
handleSlider();

//set strength color to gray
setIndicator("#ccc");

//set krta password ki length ko
function handleSlider(){
    inputslider.value=passwordlen;
    length.innerText=passwordlen;

    //or kya klrenge
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=((passwordlen-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow='0px 0px 12px 1px ${color}';
}

function getRandomInt(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNum(){
    return getRandomInt(0,9);
}

function getRandomLowercase(){
    return String.fromCharCode(getRandomInt(97,123)); //ascii of a-z
}

function getRandomUppercase(){
    return String.fromCharCode(getRandomInt(65,91)); //ascii of a-z
}

function getRandomSymbol(){
    const getRnSymInt=getRandomInt(0,symbolstring.length);
    return symbolstring.charAt(getRnSymInt);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercase.checked)hasUpper=true;
    if(lowercase.checked)hasLower=true;
    if(numbers.checked)hasNumber=true;
    if(symbols.checked)hasSymbol=true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordlen>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordlen>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passdis.value);
        copymsg.innerText="Copied";
    }
    catch(e){
        copymsg.innerText="Fail";
    }
    //copy wala msg gyb krna hai ab
    copymsg.classList.add("active");

    //2 s ke bd invisible krna h
    setTimeout( () => {
        copymsg.classList.remove("active");
    },2000);
    
}

function handlecheckboxcount(){
    checkcount=0;
    allcheck.forEach((checkbox)=>{
        if(checkbox.checked)checkcount++;
    });

    //agr pass len no. of checkbx se choti h
    //special condition
    if(passwordlen < checkcount){
        passwordlen=checkcount;
        handleSlider();
    }
}

allcheck.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxcount);
})

inputslider.addEventListener('input',(e)=>{
    passwordlen=e.target.value;
    handleSlider();
})

copybtn.addEventListener('click',()=>{
    if(passdis.value){
        copyContent();
    }
})

function shufflepass(array){
    //fisher yates method
    for(let i=array.length-1;i>=0;i--){
        let j=Math.floor(Math.random()*(i+1));
        //swap kro
        const temp=array[j];
        array[j]=array[i];
        array[i]=temp;
    }
    let str="";
    array.forEach((el)=>{
        str +=el;
    });
    return str;
}

function generatepass(){
    //none of the checkbox is marked
    if(checkcount<=0)return;

    //special condition
    if(passwordlen < checkcount){
        passwordlen=checkcount;
        handleSlider();
    }

    //start the function
    //remove old password
    password="";

    // if(uppercase.checked){
    //     password+= getRandomUppercase();
    // }
    // if(lowercase.checked){
    //     password+= getRandomLowercase;
    // }
    // if(numbers.checked){
    //     password+= getRandomInt();
    // }
    // if(symbols.checked){
    //     password+= getRandomSymbol();
    // }

    let funcArr=[];

    //compulsary addition
    if(uppercase.checked)funcArr.push(getRandomUppercase);
    if(lowercase.checked)funcArr.push(getRandomLowercase);
    if(numbers.checked)funcArr.push(getRandomNum);
    if(symbols.checked)funcArr.push(getRandomSymbol);

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining additon
    for(let i=0;i<passwordlen-funcArr.length;i++){
        let randmindex= getRandomInt(0,funcArr.length);
        password += funcArr[randmindex]();
    }

    //shuffle wala bd me kremge
    password= shufflepass(Array.from(password));

    passdis.value=password;
    calcStrength();
    
}

genbtn.addEventListener('click',generatepass);
