const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https= require("https");
const client = require("mailchimp-marketing");

const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

var firstName, lastName, email;

app.post("/",function(req,res){

    firstName=req.body.fname;
    lastName=req.body.lname;
    email=req.body.email;
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
    };

    const jsonData= JSON.stringify(data);

    const url="https://us17.api.mailchimp.com/3.0/lists/97b2a85189";
    const options={
        method: "POST",
        auth: "dipu69:cf415d474276467eb1eed1d099176313-us17"
    }

    const request=https.request(url, options, function(response){
        
        if(response.statusCode==200)
            res.sendFile(__dirname+"/success.html");
        else
            res.sendFile(__dirname+"/failure.html");

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

    // client.setConfig({
    //     apiKey: "cf415d474276467eb1eed1d099176313-us17",
    //     server: "us17",
    //   });
    
    // const run = async () => {
    //     const response = await client.lists.batchListMembers("97b2a85189", {
    //         members: [{
    //             email_address:email,
    //             status:"subscribed",
    //             merge_fields:{
    //                 FNAME: firstName,
    //                 LNAME: lastName,
    //             },
    
    //         }],
    //     });
    //     console.log(response, response.statusCode);
    // };
      
    // run();

});


app.post("/failure",function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});


//API KEY
//cf415d474276467eb1eed1d099176313-us17

//LIST ID
//97b2a85189