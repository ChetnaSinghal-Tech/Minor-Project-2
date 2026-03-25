document.getElementById("regForm").addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const blood = document.getElementById("blood").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const city = document.getElementById("city").value;

const res = await fetch("http://localhost:3000/save",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
name:name,
blood:blood,
email:email,
phone:phone,
city:city
})

});

const data = await res.text();

alert(data);

});