const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://blood:blood1234@blood-donor.s0bwrss.mongodb.net/blood-donor?retryWrites=true&w=majority&appName=blood-donor')
.then(function() {
    console.log('connected');
})
.catch(function(err) {
    console.error('connection error:', err);
});

const donor = require('./module/module.js');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

const header = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blood Donor Finder Application</title>
    <link rel="stylesheet" href="style.css"/>
</head>

<body>
<style>
h2{
color; white;
}
</style>
        <div class="main-header">
        <a href="/">Home</a>
        <a href="/findDonor">Blood Donor</a>
        <a href="/register">Register as Donor</a>
        <a href="/about"> About</a>
    </div>
`

const footer =`
  <script src="script.js"></script>

</body>
</html>
`
// Serve index.html on root
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/about', function(req,res){
    res.sendFile(path.join(__dirname, 'about.html'));
})

app.get('/finddonor', function(req,res){
    res.sendFile(path.join(__dirname, 'finddonor.html'))
})

app.get('/find',async function(req,res){
    const {tehsil,bloodgroup} = req.query
    const filterdonor =  await donor.find({'tehsil': tehsil, 'bloodgroup': bloodgroup});
    

    if(filterdonor.length === 0){

        return res.send(`${header}<div style="height: 400px; display: flex; justify-content: center; align-items: center;"><p style="color: red; font-size: 30px;">Donor Not Found</p><div>${footer}`)
      }

    let card = "" 

    for(let x = 0; x < filterdonor.length; x++){

        const {name, village,tehsil, bloodgroup, contact, Whatsapp}=filterdonor[x]
   
       card += ` <div class="main" style="position: relative;" >
            <div class="user-detail">

     <h2> Name: ${name} </h2>
     <h2> Tehsil: ${tehsil} </h2>
     <h2> Village: ${village} </h2>
       <h2>Blood group: ${bloodgroup}</h2>
        </div>
        <div style="position: relative;" class="call">
       <a href="tel:+91${contact}">   <img style="width: 50px;"src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png"/></a>
       <a href="https://wa.me/+91${Whatsapp}">     <img style="width:50px;"src="https://cdn-icons-png.flaticon.com/128/3670/3670051.png"/></a>
       
        </div>
        <a href="/delete"><img style="width: 30px;     position:absolute;
            right: 0;
            bottom: 0; border-radius: 99px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1ouiYq1xZbW7Pv61gy4Q1PdcZ-X_W3Y132O9Db_FIaGciVn0YZqPsKrZ&s=10"/></a>
        </div>

   ` 
    }

    res.send(`
${header}

        <div id="form2">
    <div class="card" id="find"">

      <p>Click on the icons to call or whatsapp these users:</p>
      <div class="user"></div>
      <div class="find-div">${card}</div>


      <div class="back" style="display: flex; justify-content: flex-end; ">
        <a href="/" style="text-align: center; padding:2px 10px; margin-top: 5px;  background: red;
    border: 2px solid darkred; border-radius: 3px;" >back</a>

      </div>

${footer}  
  `)
  }
)

app.get('/delete', function(req,res){
  res.sendFile(path.join(__dirname, 'delete.html'))  
})

app.get('/deletereq', async function(req,res){
    const {contact, password} = req.query;
    console.log("Received:", contact, password); // ← This prints: undefined undefined
    const isdonor = await donor.find({'contact': contact , 'password': password});
    console.log("Found:", isdonor);

    if(isdonor.length === 0){
        return res.send (`<script> alert("Invalid Credentials")
        window.location.href = "/delete";</script>
          `)
    }else{
        await donor.deleteOne({'contact': contact , 'password': password});
        res.send(`<script> alert("Your request has been deleted")
        
         window.location.href = "/finddonor"; </script>`)
    }
});

app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname ,'register.html'))
})

app.get('/registerdonor',async function(req,res){

    const {tehsil, village, password ,bloodgroupregister, name, contact, whatsappno } = req.query
    const isdonor = await donor.find({'contact': contact})

    if(isdonor.length > 0){

     return res.send (`<script> alert("you are alrady register")
  window.location.href = "/register"; // Redirect back to form page
        </script>`)    }

   const newdonor = await donor({
    "name":name,
    "tehsil":tehsil,
    bloodgroup:bloodgroupregister,
    'contact':contact,
    Whatsapp: whatsappno,
    "village": village,
    'password': password,
   })

   await newdonor.save()

    res.send(`${header}
   <script src="https://cdn.tailwindcss.com"></script>
    
<div class="main-form flex justify-center">
    <div class="min-w-xs max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-5 mr-5 ml-5 mb-1
5">
    <div class="flex flex-col items-center space-y-4">
        <!-- Profile Image -->
        <img 
            src="https://i.ibb.co/ZMpt5VC/download-1.jpg" 
            alt="codeyogi"
            class="w-24 h-24 border-2 border-green-500 rounded-full"
        />
        
        <!-- Profile Title -->
        <h2 class="text-2xl font-bold text-gray-800">DONOR PROFILE</h2>
        
        <!-- Profile Details -->
        <div class="w-full space-y-3 text-gray-600">
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Name:</span>
                <span>${name}</span>
            </div>
            
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Tehsil:</span>
                <span>${tehsil}</span>
            </div>
            
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Village:</span>
                <span>${village}</span>
            </div>
            
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Blood Group:</span>
                <span class="text-red-600 font-semibold">${bloodgroupregister}</span>
            </div>
            
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Phone No:</span>
                <span class="text-blue-600">${contact}</span>
            </div>
            
            <div class="flex justify-between border-b pb-2">
                <span class="font-medium">Whatsapp No:</span>
                <span class="text-green-600">${whatsappno}</span>
            </div>
        </div>

        <!-- Back Button -->
        <a href="/" 
           class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-center rounded-lg transition-colors duration-200">
            Back to Home
        </a>
    </div>
</div>
</div>
            ${footer}`)
})

// Start the server
app.listen(8080, function() {
    console.log('Server is running on port 3000');
});