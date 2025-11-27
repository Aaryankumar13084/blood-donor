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
const history = require('./module/history.js')
const account = require('./module/account.js')

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
    <style>
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            padding: 10px;
            z-index: 1001;
        }
        .hamburger span {
            width: 25px;
            height: 3px;
            background: white;
            margin: 3px 0;
            border-radius: 2px;
            transition: all 0.3s ease;
        }
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 6px);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -6px);
        }
        @media (max-width: 768px) {
            .hamburger {
                display: flex;
            }
            .nav-links {
                display: none;
                flex-direction: column;
                width: 100%;
                background: rgb(235, 9, 51);
                position: absolute;
                top: 100%;
                left: 0;
                padding: 10px 0;
                z-index: 1000;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            }
            .nav-links.active {
                display: flex;
            }
            .nav-links a {
                padding: 12px 20px;
                width: 100%;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
        h2 { color: black; }
    </style>
</head>

<body>
    <div class="main-header">
        <span class="logo" style="font-size: 18px; font-weight: bold; color: white;">Blood Donor</span>
        <div class="hamburger" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <nav class="nav-links">
            <a href="/">Home</a>
            <a href="/finddonor">Blood Donor</a>
            <a href="/register">Register as Donor</a>
            <a href="/allfuture">More</a>
        </nav>
    </div>
`

const footer =`
  <script>
    function toggleMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }
    document.addEventListener('click', function(event) {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks && !hamburger.contains(event.target) && !navLinks.contains(event.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
  </script>
  <script src="script.js"></script>
</body>
</html>
`
// Serve index.html on root
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
    history.insertMany(isdonor)
    console.log("History:", history);
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
     </a><script src="https://cdn.tailwindcss.com"></script>
    
<div class="main-form flex justify-center">
    <div class="min-w-[300px] mx-auto bg-white rounded-xl shadow-lg p-6 mt-5 mr-5 ml-5 mb-1
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
      
    </div>
</div>
</div>
            ${footer}`)
})

app.get('/profile', function(req,res){
    res.sendFile(path.join(__dirname, 'profile.html'))
})

app.get('/login', async function(req,res){
    const {contact, password} = req.query

    console.log(contact, password)

    const userAccount = await account.find({'contact': contact, 'password': password})
    console.log(userAccount)

    const allhistory = await history.find({'contact': contact, 'password': password})
    console.log(allhistory)

    if(userAccount.length === 0){
        return res.send (`<script> alert("Invalid Credentials")
        window.location.href = "/profile";</script>`)
    } else {
        let card = ""
        for(let x = 0; x < allhistory.length; x++){
            const {name, village,tehsil, bloodgroup, contact, date}=allhistory[x]
            card += `<tr>
                <td class="px-4 py-2">${name || 'N/A'}</td>
                <td class="px-4 py-2">${village || 'N/A'}</td>
                <td class="px-4 py-2">${tehsil || 'N/A'}</td>
                <td class="px-4 py-2">${bloodgroup || 'N/A'}</td>
                <td class="px-4 py-2"><a href="tel:${contact || ''}">${contact || 'N/A'}</a></td>
                <td class="px-4 py-2">${date.toLocaleDateString('en-GB')}</td>
            </tr>`;
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blood Donor History</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex flex-col bg-gray-100 font-sans text-sm">

    ${header}

    <main class="flex-1 container mx-auto px-4 py-6">
        <h1 class="text-red-700 text-center text-xl font-semibold mb-4">Blood Donor History</h1>

        <div class="mb-4">
            <input id="searchInput" type="text" placeholder="Search Donors" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
        </div>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white shadow-md rounded-md">
    <thead class="bg-red-600 text-white sticky top-0">
      <tr>
        <th class="px-4 py-2 text-left">Name</th>
        <th class="px-4 py-2 text-left">Village</th>
        <th class="px-4 py-2 text-left">Tehsil</th>
        <th class="px-4 py-2 text-left">Blood</th>
        <th class="px-4 py-2 text-left">Contact</th>
        <th class="px-4 py-2 text-left">Date</th>
      </tr>
    </thead>
    <tbody id="donorTableBody">
      ${card}
    </tbody>
  </table>
</div>
    </main>

    <footer class="bg-gray-200 text-center text-gray-700 text-sm p-4">
        Blood Donor Finder ek platform hai jo blood donors aur patients ko jodne me madad karta hai. Iska uddeshya blood ki availability badhakar jeevan bachana hai. Humari website par aap apna account bana kar donor list me jud sakte hain aur zaruratmandon ki madad kar sakte hain.
    </footer>

    <script>
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#donorTableBody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(filter)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    </script>

</body>
</html>` 
        res.send(html)
    }
})

app.get('/signup', async function(req, res) {
    const { contact, password } = req.query;

    // Check if user already exists (based only on contact)
    const isuser = await account.findOne({ contact: contact });

    if (!isuser) {
        // Save new user
        const signup = new account({
            contact: contact,
            password: password
        });

        await signup.save();

        res.send(`<script>
            alert("You are registered");
            window.location.href = "/profile";
        </script>`);
    } else {
        res.send(`<script>
            alert("You are already registered");
            window.location.href = "/profile";
        </script>`);
    }
});

app.get('/allfuture', function(req,res){
    res.sendFile(path.join(__dirname, 'allfuture.html'))
})

// Start the server
app.listen(5000, '0.0.0.0', function() {
    console.log('Server is running on port 5000');
});