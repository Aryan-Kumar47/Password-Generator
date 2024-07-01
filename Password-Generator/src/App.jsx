import { useState } from 'react';
import './App.css';
import { IoCopyOutline } from "react-icons/io5";

function App() {
  const symbols = '~`!@#$%^&*()_-=+{[}]|:;"<,>.?/';
  const [password , setPassword] = useState('')
  const [passwordLength , setpasswordLength] = useState(20)
  const [checkCount  , setcheckCount] = useState()
  const [innerText , setInnerText] = useState('')
  const [active , setActive] = useState(false)
  const [sliderValue , setSliderValue] = useState(passwordLength)
  const [color , setIndicator] = useState('#ccc')
  const allCheckBox = document.querySelectorAll('input[type =checkbox]');
  const uppercaseCheck = document.querySelector('#uppercase');
  const lowercaseCheck = document.querySelector('#lowercase');
  const numbersCheck = document.querySelector('#numbers');
  const symbolsCheck = document.querySelector('#symbol');
  
  async function copyContent() {
    try{
      await navigator.clipboard.writeText(password);
      setInnerText('Copied')
    }
    catch(e){
      setInnerText("Failed")
    }
    setActive(true)
    setTimeout(() => {
      setActive(false)
      setInnerText('')
    }, 2000);
  }
  function handleSlider(e) {
    setSliderValue(e.target.value)
    setpasswordLength(e.target.value)
    let min = e.target.min;
    let max = e.target.max;
    // the size of background 50% 100% means 50 width 100 height even works on px
    // background-size 
    // inputSlider.style.backgroundSize = ( (passwordLength)*100/(max) ) + "% 100%";
    e.target.style.backgroundSize = ( (e.target.value - min)*100 /(max - min)) + "% 100%"
  }
  let count = 0
  function handleCheckBoxChange(){
    count = 0
    allCheckBox.forEach((checkbox) => {
      if(checkbox.checked) count++;
    });
    setcheckCount(count)
    console.log(checkCount)
    if(passwordLength < checkCount){
      setpasswordLength(checkCount)
    }
  }
  
  function getRndInterger(min , max) {
    // range from min to max
    return Math.floor(Math.random()*(max - min) + min);
  }
  
  function generateRandomNumber() {
    return getRndInterger(0,9);
  }
  
  function generateLowerCase() {
    return String.fromCharCode(getRndInterger(97,123));
  }
  
  function generateUpperCase() {
    return String.fromCharCode(getRndInterger(65,91));
  }
  
  function generateSymbol() {
    const randomNum = getRndInterger(0,symbols.length);
    return symbols.charAt(randomNum);
  }

  function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
  
    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    }
    else if(
      (hasLower || hasUpper) && 
      (hasNum || hasSym) && 
      passwordLength >= 6
    ){
      setIndicator('#ff0');
    }
    else {
      setIndicator('#f00');
    }
  }

  function shufflepassword(array) {
    // fisher yates method
    for(let i = 0 ;i < array.length; i++){
      const j = Math.floor(Math.random()*(i+1));
      const temp = array[i];
      array[i] = array[j];
      array[j]  = temp;
    }
    let str = "";
    array.forEach(el => {
      str+=el;
    });
    return str;
  }

  const generate = () => {
    // none of the checkbox are selected
    console.log(checkCount)
    if(checkCount === 0) return ;
    console.log('geneating')
    if(passwordLength < checkCount){
      setpasswordLength(checkCount);
      handleSlider();
    }
    let passwordDemo = "";
    // 
    let funcArr  = [];
    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);
    // compulsory 
    for(let i = 0 ;i < funcArr.length ; i++){
      passwordDemo += funcArr[i]();
      console.log(passwordDemo)
    }
    // remaning
    for(let i = 0 ;i < passwordLength-funcArr.length; i++){
      let randIndex = getRndInterger(0 , funcArr.length);
      passwordDemo += funcArr[randIndex]();
    }
    // shuffle
    passwordDemo = shufflepassword(Array.from(passwordDemo));
  
    // show in ui
    setPassword(passwordDemo);
    console.log(passwordDemo)
    // calculate strength
    calcStrength();
  }

  return (
  
      <div className="container1">
        <h1 className="text-2xl">PASSWORD GENERATOR</h1>
        <div className="display-container ">
          <input readOnly placeholder="Password" className="display" value={password} />
          <button className="copyBtn" onClick={copyContent}>
            <span className={`tooltip ${active ? 'active' : ''}`}>{innerText}</span>
            <IoCopyOutline className='text-white'/>
          </button>
        </div>

        <div className="input-container">
          {/* <!-- password length section --> */}
          <div className="length-container">
            <p>Password Length</p>
            <p className="">{passwordLength}</p>
          </div>
          {/* <!-- slider --> */}
          <input type="range" min="1" max="20" className="slider" step="1" value={sliderValue} onChange={handleSlider}/>
          {/* <!-- checkbox --> */}
          <div className="check" onChange={handleCheckBoxChange}>
            <input type="checkbox" id="uppercase"/>
            <label htmlFor="uppercase">Includes Uppercase letters</label>
          </div>
          <div className="check" onChange={handleCheckBoxChange}>
            <input type="checkbox" id="lowercase"/>
            <label htmlFor="lowercase">Includes Lowercase letters</label>
          </div>
          <div className="check" onChange={handleCheckBoxChange}>
            <input type="checkbox" id="numbers"/>
            <label htmlFor="numbers">Includes Number letters</label>
          </div>
          <div className="check" onChange={handleCheckBoxChange}>
            <input type="checkbox" id="symbol"/>
            <label htmlFor="symbol">Includes Symbol letters</label>
          </div>

          {/* <!-- strength  --> */}
          <div  className="strength-container ">
            <p>Strenght</p>
            <div className="indicator" style={{boxShadow : `0px 0px 12px 1px ${color}` , backgroundColor : `${color}`}} ></div>
          </div>

          {/* <!-- generator password --> */}
          <button className="generateButton " onClick={generate}>GENERATOR PASSWORD</button>
        </div>

      </div>
  );
}
export default App;