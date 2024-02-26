const express = require("express");
const productItems = require("./product.json");
const server = express();
const port = 8000;
const api_key = "adklsjsaislkffdlsjdadfiafsjsfs";
const fs = require("fs");
const writeFile = (logString)=> fs.appendFileSync("./access.log", logString + "\n");
server.use((req, res, next)=>{
writeFile(`Request URL : ${req.url}, Time : ${new Date()}, IP : ${req.ip}`);
next();
})
server.use((req, res, next)=>{

    if(req.query.api_key === api_key){
        next();
    } else{
        res.status(403).json({
            success: false,
            message: "Invailid Api Key"
        });
    }
});


server.get("/", (req, res) => {
  res.send("Home Page");
});

server.get("/products", (req, res) => {
  let finalProducts = productItems;
  if (req.query.searchKey) {
    finalProducts = productItems.filter((item) => {
      item.title.toLowerCase().includes(req.query.searchKey);
    });
  }
  if (finalProducts.length === 0) {
    return res.status(204).json({
      success: true,
      results: [],
    });
  }

  res.json({
    success: true,
    total: finalProducts.length,
    results: finalProducts,
  });
});

server.get("/product/:id", (req, res) => {
  const finalProduct = productItems.find((item) => {
    return item.id == req.params.id;
  });

  if (!finalProduct) {
    return res.status(404).json({
      success: false,
      message: `No items found with id ${req.params.id}`,
    });
  }
  res.json({
    success: true,
    total: finalProduct.length,
    results: finalProduct,
  });
});

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
