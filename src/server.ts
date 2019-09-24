import { Router, Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, addTextToImage,resizeImage } from './services/filterImage';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint

  // Create Array to store the paths
  let filteredpath: Array<string> = new Array;
  // Displays the services to the user
  app.get("/", async (req, res) => {
    res.write("<div style='background: linear-gradient(45deg,DarkSlateGrey, Thistle); padding : 30px'>"
    +"<div style='background-color:lightblue ; opacity: 0.5 ; text-align: center ; color:DarkSlateGray ; font-family:cursive' ><h1>Welcome to the Image Filering Application .. </h1></div>"
    +"<div style='text-align: center ; font-size: 24px ;color:DarkSlateGray'>There are a lot of services you can do with Image Filering Application</div>"
    +"<div style='text-align: center ; font-size: 24px ;color:DarkSlateGray ' >Entring the path according to the selected service that you want as the following:</div>"
    +"<div style='text-align: center ; font-size: 24px ;border:2px solid white; color:DarkSlateGray ; margin: 10px;' >- Resizing the image </br>" 
   + "http://localhost:{{PORT}}//filteredimage/resize/?image_url={url}&width={}&height={} </br>"
   + "Width and height must be greater than zero and less than or equal to 1024</div>"
   +"<div style='text-align: center ; font-size: 24px ; border:2px solid white ;color:DarkSlateGray; margin: 10px;' >- Adding text to the image </br>" 
   + "http://localhost:{{PORT}}//filteredimage/addText/?image_url={url}&caption={}&text_color={} </br>"
   +"The available colors are : </br>"
   +"1- Black </br>"
   +"2- White </br>"
   +"Enter of the number of the color that you want </br>"
   + "Caption words must be at most 5 words, and the default color is white </div>"
   +"<div style='text-align: center ; font-size: 24px ; border:2px solid white ;color:DarkSlateGray ; margin: 10px;' >- Filtering the image </br>" 
   + "http://localhost:{{PORT}}//filteredimage/?image_url={url}&caption={}&color={} </br>"
   +"The available colors are : </br>"
   +"1- Grayscale </br>"
   +"2- Red </br>"
   +"3- Blue </br>"
   +"4- Green </br>"
   +"Enter of the number of the color that you want </br>"
   +"</div>"
   +"<div style='text-align: center ; font-size: 24px ; color:white ; margin:20px' >Note: to provide a good service to you, enter the path with his parameters in a correct way.</div></div>");
    res.send();
  });
  //Filter Image
  app.get("/filteredimage/", async (req, res) => {
    let { image_url } = req.query;
    console.log(image_url);
    let { color } = req.query;
    console.log(color);
    //Check the parameters
    if (!image_url) {
      res.status(400).send("Please enter a URL..!");
    }
    if (!color) {
      res.status(400).send("Please select the color..!");
    }
    if (color <= 0 || color >= 5) {
      res.status(400).send("Please Choose valid color number..!");
    }
    if (!checkUrl(image_url)) {
      res.status(422).send("Please enter a valid URL..!");
    }
    //Call function to filter image
    const filterImage = filterImageFromURL(image_url, color);
    filterImage.then(function (result) {
      console.log("Filtering the Image");
      //Store the returned path
      filteredpath.push(result);
      res.status(200).send("The image path is: " + result);
      //Delete the file after sending the path
      deleteLocalFiles(filteredpath);
    }, function (err) {
      res.status(402).send(err);
    });

  });
  //Add text to the Image 
  app.get("/filteredimage/addText/", async (req, res) => {
    let { image_url } = req.query;
    let { caption } = req.query;
    let { text_color } = req.query;
    //Check the parameters
    if (!image_url) {
      res.status(400).send("Please enter a URL..!");
    }
    if (!caption) {
      res.status(400).send("Please enter the Text..!");
    }
    if (!text_color) {
      text_color = 1;
    }
    if (!checkUrl(image_url)) {
      res.status(422).send("Please enter a valid URL..!");
    }
    if (countWords(caption) >= 6) {
      res.status(422).send("You must enter at most 5 words..");
    }
    console.log(countWords(caption));
    try {
      const ImageText = addTextToImage(image_url, caption, text_color); //Call the function to add the text
      ImageText.then(function (result) {
        console.log(" Adding text to the Image");
        //Store the returned path
        filteredpath.push(result);
        res.status(200).send("The image path is: " + result);
        //Delete the file after send the path
         deleteLocalFiles(filteredpath);
      }, function (err) {
        res.status(402).send(err);
      });
    }
    catch (e) {
      console.log(e);
    }
  });
  //Resize the image
  app.get("/filteredimage/resize/", async (req, res) => {
   let {image_url } = req.query;
   let {width} = req.query;
   let {height} = req.query;
  //Check the parameters
  if (!image_url) {
    res.status(400).send("Please enter a URL..!");
  }
  if (!width) {
    res.status(400).send("Please enter the width ..!");
  }
  if (!height) {
    res.status(400).send("Please enter the height..!");
  }
  if (!checkUrl(image_url)) {
    res.status(422).send("Please enter a valid URL..!");
  }
   if (width >= 1025 || height >= 1025){
     res.status(422).send("The muximum size is 1024 ..!");
   }
   if (width <= 0 || height <= 0){
    res.status(422).send("The minimum size is 1 ..!");
  }
  try {
    //Stroes the width and height in a numbers variables
    var width_siz : number = Number(width);
    var height_siz : number = Number(height);
    //Call the function to resize the image
    const filterImage = resizeImage (image_url,width_siz,height_siz);
    filterImage.then(function (result) {
    console.log(" Resizing the Image");
      ///Store the returned path
      filteredpath.push(result);
      res.status(200).send("The image path is:" + result);
      //Delete the file after send the path
       deleteLocalFiles(filteredpath);
    }, function (err) {
      res.status(402).send(err);
    });
  }
  catch (e) {
    console.log(e);
  }

  });

  //Validate URL
  function checkUrl(url: String) {
    const URL = require("url").URL;
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
  //Count words
  function countWords(str: string) {
    var matches = str.match(/[\w\d\’\'-]+/gi);
    return matches ? matches.length : 0;
  }
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();