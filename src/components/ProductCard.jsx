import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/storage';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const inWish = wishlist.includes(product.id);
  const signInForCart = (destination = `${location.pathname}${location.search}`) => {
    navigate('/login', { state: { from: destination, reason: 'cart' } });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product);
    if (result.requiresLogin) signInForCart();
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product);
    if (result.success) navigate('/cart');
    else if (result.requiresLogin) signInForCart();
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="card product-card h-100 border-0 shadow-sm">
      <div className="position-relative product-img-wrapper">
        <Link to={`/product/${product.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
          <img
            src={product.image}
            className="product-img rounded"
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/500x500/f1f5f9/1a1a2e?text=${encodeURIComponent(product.brand)}`;
            }}
          />
        </Link>

        {product.discount > 0 && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2 shadow-sm">
            {product.discount}% off
          </span>
        )}

        {product.bestseller && (
          <span className="badge bg-warning text-dark position-absolute bottom-0 start-0 m-2 shadow-sm" style={{ fontSize: '0.68rem' }}>
            Bestseller
          </span>
        )}

        <button
          className={`btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm wishlist-btn ${
            inWish ? 'btn-danger text-white' : 'btn-white bg-white text-secondary'
          }`}
          onClick={handleWish}
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <i className={`bi ${inWish ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small fw-medium">{product.brand}</span>
          {product.assured && (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.65rem' }}>
              <i className="bi bi-patch-check-fill me-1"></i>Assured
            </span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <h6 className="product-title mb-2">{product.title}</h6>
        </Link>

        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-success d-inline-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
            {product.rating} <i className="bi bi-star-fill" style={{ fontSize: '0.6rem' }}></i>
          </span>
          <span className="text-muted small">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-2 mb-2 flex-wrap">
            <span className="fw-bold fs-6 text-dark">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through small">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-accent flex-grow-1 fw-semibold" onClick={handleAdd}>
              <i className="bi bi-cart-plus me-1"></i>Add
            </button>
            <button className="btn btn-sm btn-outline-primary fw-semibold" onClick={handleBuyNow} title="Buy Now">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
