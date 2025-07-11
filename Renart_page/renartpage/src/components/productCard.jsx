import React, { useState } from "react";
import "./productCard.css";
import StarRating from "./star";
const ProductCard = ({product}) => {
    const {
        name,
        priceUSD,
        popularityScore,
        displayScore,
        images={},
        colorOptions = []
    } = product;

    // renk isimleri ve renk kodları eşleştirme
    const colorMap = {
        "yellow": {name : "Yellow Gold", code:"#E6CA97"},
        "white": {name:"White Gold", code: "#D9D9D9"},
        "rose": {name:"Rose Gold", code:"#E1A4A9"}
    };

    const availableColors = Object.keys(images).filter(color => colorMap[color]);
    const [selectedColor, setSelectedColor] = useState(availableColors[0] || "yellow");

    const imageUrl = images[selectedColor] || "https://via.placeholder.com/150";

    //Puan hesaplama
    const rating = product.popularityStars;
    
    return (
        <div className="product-card">
            <div className="product-image">
                <img src={imageUrl} alt={`${name} - ${selectedColor}`} />
            </div>

            <div className="product-info">
                <span className="product-title">{name}</span>

                <span className="product-price">${Number(priceUSD).toFixed(2)}</span>
                <div className="color-options">
                    {availableColors.map((color) => (
                        <div 
                            key={color}
                            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                            style={{backgroundColor: colorMap[color]?.code || color}}
                            onClick={() => setSelectedColor(color)}
                            title={colorMap[color]?.name || color}
                        />
                    ))}
                </div>
                <div className="selected-color-name">{colorMap[selectedColor]?.name || selectedColor}</div>

                <StarRating rating={rating} />
            </div>
        </div>
    );
};

export default ProductCard;