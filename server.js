const express = require("express");
const PORT = 8080;
const routerProducts = express.Router();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/productos", routerProducts);

const server = app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`); // server listening message.
});
server.on("error", (error) => console.log(`error at server ${PORT}`)); // catch server error.

class Container {
  static arrayOfProducts = []; // array of products.
  static countId = 0; // id counter for products id's.

  constructor() {}

  save(product) {
    try {
      Container.countId++;
      Container.arrayOfProducts.push({ id: Container.countId, ...product });
    } catch {
      return Error("error in function: save.");
    }
  }

  getAll() {
    try {
      return Container.arrayOfProducts;
    } catch (error) {
      return Error("error in function: get all.");
    }
  }

  getById(id) {
    try {
      const product = Container.arrayOfProducts.filter((x) => x.id === id);
      return product;
    } catch {
      return Error("error in function: get by id.");
    }
  }

  deleteById(id) {
    try {
      const newProducts = Container.arrayOfProducts.filter((x) => x.id != id);
      Container.arrayOfProducts = newProducts;
    } catch {
      return Error("error in function: delete by id.");
    }
  }

  update(product, id) {
    try {
      Container.arrayOfProducts.push({ id: id, ...product });
    } catch {
      return Error("error in function: update.");
    }
  }
}

let products = new Container();

// show all products.
routerProducts.get("/", (req, res) => {
  products.getAll().length === 0
    ? res.json({ message: "empty products array!" })
    : res.send(products.getAll());
});

// show a product by id.
routerProducts.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productById = products.getById(id);
  if (productById.length === 0) {
    res.json({
      message: "error: product not found.",
    });
  } else
    res.json({
      product: productById,
    });
});

// save a product in array of products.
routerProducts.post("/", (req, res) => {
  const product = req.body;
  if (product.title && product.price && product.thumbnail) {
    products.save(product);
    res.json({
      message: "product added successfully!",
      product,
    });
  } else {
    res.json({
      message: "error: empty or incorrect entries.",
    });
  }
});

// update a product in array of products by id.
routerProducts.put("/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let product = req.body;
  if (products.getById(id).length === 0) {
    res.json({
      message:
        "error: the product could not be updated because it does not exist.",
    });
  } else {
    if (product.title && product.price && product.thumbnail) {
      products.deleteById(id);
      products.update(product, id);
      res.json({
        message: "product updated successfully!",
      });
    } else {
      res.json({
        message: "error: empty or incorrect entries.",
      });
    }
  }
});

// delete a product in array of products by id.
routerProducts.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.getById(id);
  if (product.length === 0) {
    res.json({
      message:
        "error: the product could not be removed because it does not exist.",
    });
  } else {
    products.deleteById(id);
    res.json({
      message: "product removed successfully!",
    });
  }
});

app.get("*", (req, res) => res.json({ message: "error: invalid path" }));
