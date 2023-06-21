import { useState } from "react";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import {getDatabase } from "firebase/database";
import { set , ref } from "firebase/database";
import "firebase/compat/auth";
import  emailjs from '@emailjs/browser';




const firebaseConfig = {
  apiKey: "AIzaSyA8d4ytzbOLR30iajEC5Ehu75-7PshRkrc",
  authDomain: "otpdb17june23-46139.firebaseapp.com",
  databaseURL: "https://otpdb17june23-46139-default-rtdb.firebaseio.com",
  projectId: "otpdb17june23-46139",
  storageBucket: "otpdb17june23-46139.appspot.com",
  messagingSenderId: "860084151936",
  appId: "1:860084151936:web:c9eede0edce1f13e886865"
};
const app = firebase.initializeApp(firebaseConfig);
 const db = getDatabase(app);

export default function Enquiry()
{

const  [name ,setName] = useState("");
const  [phone ,setPhone] = useState("");
const  [query ,setQuery] = useState("");
const  [otp ,setOtp] = useState("");
const [final, setFinal] = useState("");



const hName = (event) => { setName(event.target.value); }
const hPhone = (event) => { setPhone(event.target.value); }
const hQuery = (event) => { setQuery(event.target.value); }
const hOtp = (event) => { setOtp(event.target.value); }


const configureCaptcha = () => {
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button',{'size':'invisible',
'callback':(response)=>{
sendOtp();
console.log("Recaptca varified")
},
defaultCountry:"IN"
});
}

const sendOtp = (event)=> {
event.preventDefault();
configureCaptcha();
let pn = "+91" + phone;
let av = window.recaptchaVerifier;
firebase.auth().signInWithPhoneNumber(pn , av)
.then(res => {


setFinal(res);
console.log(res);
console.log("OTP sent");
alert("OTP sent");
})
.catch(err => {
console.log(err);
})
}

const submitOtp = (event)=>{
event.preventDefault();
final.confirm(otp)
.then(res => {
const d = new data().toString();
const n = name +"-->" + d;
const data = {name,phone,query,d}

set(ref(db,"visitors/"+n),data)
.then(res => {
console.log(res);
window.location.reload();
})

.catch(err => console.log(err))
})

.catch(err=>{
console.log(err);
alert("invalid OTP"); 
window.location.reload()
})

let data = {"name":name, "phone":phone, "query":query};
emailjs.send("service_ic7iq3t" , "template_o195z2s" , data , "7ehrjkrfiHKhEOcRY")
.then(res=> alert("we will get back to u in 2 hrs"))
.catch(err => console.log("issue"+ err))






}
return(
<>
<center>
<h1> Fill the Form </h1>
<form onSubmit={sendOtp}>
<div id="sign-in-button"> </div>

<input type="text" placeholder="enter ur name"
onChange={hName} value={name}/>
<br/><br/>
<input type="number" placeholder="enter ur phone"
onChange={hPhone} value={phone}/>
<br/><br/>
<textarea placeholder="enter ur query" rows={3} cols={30} onChange={hQuery} value={query}>  </textarea>
<br/><br/>
<input type="submit" value="Generate OTP"/>
<br/><br/>
</form>
<form onSubmit={submitOtp}>
<input type="text" placeholder="enter OTP" onChange={hOtp} value={otp}/>
<br/><br/>
<input type="submit" value="Submit"/>
</form>
</center>
</>
);

}




















