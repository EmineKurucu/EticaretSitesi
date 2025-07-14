const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { error } = require("console");

// altın fiyatlarını çekme
const GOLD_API_KEY = "goldapi-kn2o8v19mcub24mw-io"; 
const GOLD_API_URL = "https://www.goldapi.io/api/XAU/USD";

// Altın fiyatı hesaplama
const getGoldPricePerGram = async () => {
    try {
        const response = await axios.get(GOLD_API_URL, {
            headers: { "x-access-token": GOLD_API_KEY }
        });

        const pricePerOunce = response.data.price;
        return pricePerOunce / 31.1035;
    } catch (error) {
        console.error("Altın fiyatı alınamadı, sabit değer kullanılacak:", error.response?.data || error.message);
        const fallbackOuncePrice = 2400; // USD cinsinden 1 ons altın fiyatı
        return fallbackOuncePrice / 31.1035;
    }
};
// JSON Dosyası Okuma
const readProducts  = () => {
    const filePath = path.join(__dirname, "..", "products.json");
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
};

const enrichProducts = (products, goldPrice) => {
    return products.map(p => {
        const price = (p.popularityScore + 1) * p.weight * goldPrice;
        const popularityStars = (p.popularityScore * 4) + 1;  // 1-5 arası ondalıklı
        return {
            ...p,
            priceUSD: parseFloat(price.toFixed(2)),
            popularityStars // burayı ekle ki tüm endpoint'ler bu alanı dönsün
        };
    });
};
;


// Tüm ürünleri getir
const getAllProducts = async (req, res, next) => {
    try {
        const products = readProducts();
        const goldPrice = await getGoldPricePerGram();
        const enriched = enrichProducts(products, goldPrice);
        res.json(enriched);
    } catch (err) {
        next(err);
    }
};

// Fiyat aralığına göre sıralama
const getProductsByPriceRange = async(req, res, next) => {
    try {
        const min = parseFloat(req.query.min);
        const max = parseFloat(req.query.max);

        if (isNaN(min) || isNaN(max)) {
            return res.status(400).json({error: "Min ve Max Fiyat değerleri geçerli sayılar olmalı"});
        }

        const products = readProducts();
        const goldPrice = await getGoldPricePerGram();
        const enriched = enrichProducts(products, goldPrice);

        const filtered = enriched.filter(p => p.priceUSD >= min && p.priceUSD <= max);
        res.json(filtered);
    } catch(err) {
        next(err);
    }
};

// Popülerlik puanına göre sıralama
const getProductsByPopularityRange = async (req , res, next) => {
    try {
        const min = parseFloat(req.query.min);
        const max = parseFloat(req.query.max);

        if (isNaN(min) || isNaN(max)) {
            return res.status(400).json({error : "Min ve Max değerleri geçerli değerler olmalı"});
        }

        const products = readProducts();
        const goldPrice = await getGoldPricePerGram();
        const enriched = enrichProducts(products, goldPrice).map(p => {
            // popularityScore 0-1 arasında ise, 1-5 arasına dönüştür
            // yoksa direkt 1-5 arası değer varsay
            // burada örnek olarak doğrudan dönüştürüyorum:
            return {
                ...p,
                popularityStars: (p.popularityScore * 4) + 1  // 1 ile 5 arasında ondalıklı değer
            };
        });

        // Popülerlik filtresi popularityStars üzerinden yapılmalı
        const filtered = enriched.filter(p => p.popularityStars >= min && p.popularityStars <= max);
        res.json(filtered);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProducts,
    getProductsByPriceRange,
    getProductsByPopularityRange
};
