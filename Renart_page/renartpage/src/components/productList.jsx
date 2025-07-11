import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ProductCard from './productCard';
import './productList.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (url = `${BASE_URL}/products`) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Veriler alınamadı:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = (min, max) => {
    setFilterType('price');
    const targetURL = max === null
      ? `${BASE_URL}/products/price-range?min=${min}&max=100000`
      : `${BASE_URL}/products/price-range?min=${min}&max=${max}`;
    fetchProducts(targetURL);
  };

  const handlePopularityFilter = (min, max) => {
    setFilterType('popularity');
    const targetURL = max === null
      ? `${BASE_URL}/products/popularity?min=${min}&max=5`
      : `${BASE_URL}/products/popularity?min=${min}&max=${max}`;
    fetchProducts(targetURL);
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="product-list-wrapper">
      <div className="heading">Product List</div>

      <div className="filter-buttons">
        <div className="filter-group">
          <span>Price:</span>
          <button onClick={() => handlePriceFilter(0, 500)}>$0 - $500</button>
          <button onClick={() => handlePriceFilter(500, 800)}>$500 - $800</button>
          <button onClick={() => handlePriceFilter(800, null)}>$800+</button>
        </div>
        <div className="filter-group">
          <span>Popularity:</span>
          <button onClick={() => handlePopularityFilter(0, 2)}>0 - 2 Stars</button>
          <button onClick={() => handlePopularityFilter(2, 4)}>2 - 4 Stars</button>
          <button onClick={() => handlePopularityFilter(4, null)}>4+ Stars</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-carousel">
          <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>

          <div className="product-scroll-container" ref={scrollContainerRef}>
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product.name} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

          <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
