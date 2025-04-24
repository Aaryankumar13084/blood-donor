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
    const {district,bloodgroup} = req.query
    const alldonor = await donor.find({})

    const filterdonor = alldonor.filter(function(finder){
       return finder.district == district && finder.bloodgroup == bloodgroup
    })

    if(filterdonor.length === 0){
        
        return res.send(`${header}<div style="height: 400px; display: flex; justify-content: center; align-items: center;"><p style="color: red; font-size: 30px;">Donor Not Found</p><div>${footer}`)
      }

    let card = "" 

    for(let x = 0; x < filterdonor.length; x++){

        const {name, village,district, bloodgroup, contact, Whatsapp}=filterdonor[x]
       card += ` <div class="main">
            <div class="user-detail">

     <h2> Name: ${name} </h2>
     <h2> District: ${district} </h2>
     <h2> Village: ${village} </h2>
       <h2>Blood group: ${bloodgroup}</h2>
        </div>
        <div class="call">
       <a href="tel:+91${contact}">   <img style="width: 40px;"src="https://cdn-icons-png.flaticon.com/128/5585/5585856.png"/></a>
       <a href="https://wa.me/+91${Whatsapp}">     <img style="width:40px;"src="https://cdn-icons-png.flaticon.com/128/3670/3670051.png"/></a>
        </div>
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

app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname ,'register.html'))
})

app.get('/registerdonor',async function(req,res){
    
    const {district, village, bloodgroupregister, name, contact, whatsappno } = req.query
    const isdonor = await donor.find({'contact': contact})
    
    if(isdonor.length > 0){
     
     return res.send (`<script> alert("you are alrady register")
  window.location.href = "/register"; // Redirect back to form page
        </script>`)    }
    
   const newdonor = await donor({
    "name":name,
    "district":district,
    bloodgroup:bloodgroupregister,
    'contact':contact,
    Whatsapp: whatsappno,
    "village": village
   })

   await newdonor.save()

    res.send(`${header}
        <!---register div-->
            <div class="main-form">



        <div id="form4">
            <div class="registerform" ">

      <div class="registerform2 ">
  <img
    src="https://i.ibb.co/ZMpt5VC/download-1.jpg"
    alt="codeyogi"
    style="width: 100px; height: 100px; align-self: center; border: 2px solid green; border-radius: 99px;"
  />
  <p>PROFILE</p>
  <h2>Name: ${name} </h2>
        <h2>District: ${district} </h2>
        <h2>Village: ${village}</h2>
<h2> Blood-group: ${bloodgroupregister}
</h2>
<h2>Phone No: ${contact} </h2>
<h2>Whatsapp No: ${whatsappno} </h2>
  <div id="link">
    <a class="p" href="/" style="background: red;">Back</a>
  </div>
      </div>
         
            </div>
            ${footer}`)
})

// Start the server
app.listen(8080, function() {
    console.log('Server is running on port 3000');
});