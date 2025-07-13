const express = require("express");
const cors = require("cors"); 
const app = express();
const productRoutes = require("./routes/routes");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://renart-six.vercel.app",
    "https://renart-bu6js4tyq-eminekurucus-projects.vercel.app" // hata alırsan tekrar bunu dene
  ]
}));

app.use(express.json());
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
