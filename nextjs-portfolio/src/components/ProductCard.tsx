import React from 'react';

interface Product {
  name: string;
  tag: string;
  tagline: string;
  bullets: string[];
  link: string;
  linkText: string;
  status: string;
  image?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusLabel = product.status === 'live' ? 'Live' : 'Coming Soon';

  return (
    <div className="product-card">
      <p className="product-tag">
        {product.tag}
        <span className={`product-status ${product.status}`}>{statusLabel}</span>
      </p>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-tagline">{product.tagline}</p>
      <ul className="product-bullets">
        {product.bullets.map((bullet, index) => (
          <li key={index}>{bullet}</li>
        ))}
      </ul>
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-link">
        {product.linkText} <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
};

export default ProductCard;
