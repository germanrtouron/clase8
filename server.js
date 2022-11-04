const express = require("express");
const PORT = 8080;
const routerProducts = express.Router();
const app = express();
const products = []; // array of products
let itemId = 1; // id counter for products id's

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/productos", routerProducts);

const server = app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`); // server listening message
});
server.on("error", (error) => console.log(`error at server ${PORT}`)); // catch server error

routerProducts.get("/", (req, res) => {
  if (products.length === 0) {
    res.json({
      message: "there are no products",
    });
  } else {
    res.json({
      products,
    });
  }
});

routerProducts.get("/:id", (req, res) => {
  const indexId = parseInt(req.params.id);
  let productById = products.filter((x) => x.id === indexId);
  if (productById.length === 0) {
    res.json({
      message: "error: product not found",
    });
  } else
    res.json({
      productById,
    });
});

routerProducts.post("/", (req, res) => {
  let item = req.body;
  item.id = itemId;
  itemId++;
  products.push(item);
  res.json({
    message: `product added successfully`,
    item,
  });
});

routerProducts.put("/:id", (req, res) => {
  let indexId = parseInt(req.params.id);
  let item = req.body;
  item.id = indexId;
  let itemFoundId = products.findIndex((x) => x.id === indexId);
  if (itemFoundId === -1) {
    res.json({
      message: `error: the product could not be updated because it does not exist`,
    });
  } else {
    products[itemFoundId] = item;
    res.json({
      message: `product updated successfully`,
    });
  }
});

routerProducts.delete("/:id", (req, res) => {
  const indexId = parseInt(req.params.id);
  let itemFoundId = products.findIndex((x) => x.id === indexId);
  if (itemFoundId === -1) {
    res.json({
      message: `error: the product could not be removed because it does not exist`,
    });
  } else {
    products.splice(itemFoundId, 1);
    res.json({
      message: `product removed successfully`,
    });
  }
});
