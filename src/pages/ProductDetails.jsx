import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { products } from '../data/products';
import { formatCurrency } from '../utils/storage';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === +id);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  useEffect(() => {
    if (product) {
      setColor(product.colors?.[0] || '');
      setStorage(product.storageOptions?.[0]?.name || '');
      setSize(product.sizes?.[0] || '');
      setActiveImage(product.gallery?.[0] || product.image);
      setQty(1);
      setDeliveryMsg('');
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4>Product not found</h4>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const selectedStorage = product.storageOptions?.find((s) => s.name === storage);
  const price = selectedStorage?.price || product.price;
  const originalPrice = selectedStorage?.originalPrice || product.originalPrice;
  const inWish = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const checkPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg('Please enter a valid 6-digit pincode');
      return;
    }
    const est = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    setDeliveryMsg(`Free delivery by ${est} • Cash on Delivery available`);
  };

  const handleAdd = () => {
    const result = addToCart(product, { price, originalPrice, image: activeImage || product.image, color, storage, size, quantity: qty });
    if (result.requiresLogin) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}`, reason: 'cart' } });
    }
  };

  const handleBuy = () => {
    const result = addToCart(product, { price, originalPrice, image: activeImage || product.image, color, storage, size, quantity: qty });
    if (result.success) navigate('/checkout');
    else if (result.requiresLogin) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}`, reason: 'cart' } });
    }
  };

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 260 }}>{product.title}</li>
        </ol>
      </nav>

      <div className="row g-4 bg-white p-3 p-md-4 rounded-3 shadow-sm border">
        {/* Left Image Column */}
        <div className="col-md-5">
          <div className="product-detail-img-wrap position-relative mb-3 border">
            <img
              src={activeImage || product.image}
              alt={product.title}
              className="product-detail-img"
              onError={(e) => {
                e.target.src = `https://placehold.co/600x600/f1f5f9/1a1a2e?text=${encodeURIComponent(product.brand)}`;
              }}
            />
            <button
              className={`btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm ${
                inWish ? 'btn-danger text-white' : 'btn-light'
              }`}
              onClick={() => toggleWishlist(product.id)}
            >
              <i className={`bi ${inWish ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="d-flex gap-2 justify-content-center mb-3">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`p-1 rounded border bg-white ${activeImage === imgUrl ? 'border-primary border-2' : ''}`}
                >
                  <img src={imgUrl} alt="" width="56" height="56" className="object-fit-cover rounded" />
                </button>
              ))}
            </div>
          )}

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-warning text-dark fw-bold btn-lg flex-grow-1" onClick={handleAdd}>
              <i className="bi bi-cart-plus me-2"></i>ADD TO CART
            </button>
            <button className="btn btn-accent fw-bold btn-lg flex-grow-1" onClick={handleBuy}>
              <i className="bi bi-lightning-fill me-1"></i>BUY NOW
            </button>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="col-md-7">
          <p className="text-muted small mb-1 fw-semibold">{product.brand} · {product.category}</p>
          <h1 className="h4 fw-bold mb-2">{product.title}</h1>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-success px-2 py-1">
              {product.rating} <i className="bi bi-star-fill ms-1" style={{ fontSize: '0.7rem' }}></i>
            </span>
            <span className="text-muted small fw-medium">{product.reviewCount.toLocaleString()} Ratings & Reviews</span>
            {product.assured && (
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                <i className="bi bi-patch-check-fill me-1"></i>ShopSphere Assured
              </span>
            )}
          </div>

          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span className="fs-2 fw-bold text-dark">{formatCurrency(price)}</span>
            {originalPrice > price && (
              <>
                <span className="text-muted text-decoration-line-through fs-5">{formatCurrency(originalPrice)}</span>
                <span className="text-success fw-bold">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* Available Offers */}
          <div className="bg-light p-3 rounded-3 mb-3 border">
            <h6 className="fw-bold small mb-2"><i className="bi bi-tag-fill text-success me-1"></i>Available Offers</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-1">
              <li><strong className="text-success">Coupon Offer:</strong> Apply <code>SHOP10</code> for instant 10% off on cart</li>
              <li><strong className="text-success">Flat Discount:</strong> Use <code>SAVE200</code> on orders above ₹2,000</li>
              <li><strong className="text-success">Free Shipping:</strong> Free delivery on orders ₹999+ or use <code>FREESHIP</code></li>
            </ul>
          </div>

          {/* Variants */}
          {product.colors?.length > 0 && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Color: <span className="text-dark">{color}</span></label>
              <div className="d-flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`btn btn-sm ${color === c ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.storageOptions?.length > 0 && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Storage</label>
              <div className="d-flex flex-wrap gap-2">
                {product.storageOptions.map((s) => (
                  <button
                    key={s.name}
                    className={`btn btn-sm ${storage === s.name ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setStorage(s.name)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Size</label>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${size === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3 d-flex align-items-center gap-3">
            <label className="small fw-bold text-muted mb-0">Quantity</label>
            <div className="input-group input-group-sm" style={{ width: 115 }}>
              <button className="btn btn-outline-secondary" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <input className="form-control text-center fw-bold" value={qty} readOnly />
              <button className="btn btn-outline-secondary" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
            </div>
            <span className="badge bg-success-subtle text-success">In Stock ({product.stock} left)</span>
          </div>

          {/* Delivery Pincode Check */}
          <form onSubmit={checkPincode} className="mb-4">
            <label className="form-label small fw-bold text-muted">Delivery Check</label>
            <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
              <span className="input-group-text bg-white"><i className="bi bi-geo-alt text-primary"></i></span>
              <input
                type="text"
                maxLength={6}
                className="form-control"
                placeholder="Enter 6-digit PIN"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">Check</button>
            </div>
            {deliveryMsg && (
              <div className={`small mt-1 fw-medium ${deliveryMsg.includes('Free') ? 'text-success' : 'text-danger'}`}>
                {deliveryMsg}
              </div>
            )}
          </form>

          {/* Highlights & Description */}
          {product.highlights?.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold small text-muted text-uppercase">Highlights</h6>
              <ul className="small mb-0 ps-3">
                {product.highlights.map((h, i) => (
                  <li key={i} className="mb-1">{h}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h6 className="fw-bold small text-muted text-uppercase">Description</h6>
            <p className="text-secondary small mb-0">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="related-section">
          <h4 className="fw-bold mb-3">Similar Products</h4>
          <div className="row g-3">
            {related.map((p) => (
              <div className="col-6 col-md-3" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
