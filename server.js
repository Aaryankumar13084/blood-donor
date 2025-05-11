const express = require('express');

        
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
        <h2>Tehsil: ${tehsil} </h2>
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