import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { products, categories } from '../data/products';
import { searchProducts } from '../utils/productSearch';
import { formatCurrency } from '../utils/storage';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { cartCount, wishlist } = useShop();
  const [q, setQ] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = q.trim().length >= 2 ? searchProducts(q, products).slice(0, 6) : [];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q.trim())}`);
    else navigate('/products');
  };

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark bg-navy py-2">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            {!logoError ? (
              <img
                src="/assets/images/shopsphere-logo.png"
                alt="ShopSphere"
                height="40"
                className="rounded-2 bg-white p-1"
                style={{ objectFit: 'contain' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="d-inline-flex align-items-center justify-content-center rounded-2 bg-accent text-white fw-bold" style={{ width: 38, height: 38 }}>
                <i className="bi bi-bag-heart-fill"></i>
              </span>
            )}
            <div className="d-flex flex-column lh-1">
              <span className="fs-5 fw-bold tracking-tight">
                Shop<span className="text-warning">Sphere</span>
              </span>
              <span className="text-white-50 fst-italic" style={{ fontSize: '0.65rem' }}>
                Explore <span className="text-warning fw-semibold">Plus✦</span>
              </span>
            </div>
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navMain">
            <div className="position-relative mx-lg-4 my-2 my-lg-0 flex-grow-1" ref={searchRef} style={{ maxWidth: 520 }}>
              <form className="d-flex search-form" onSubmit={handleSearch}>
                <input
                  className="form-control form-control-sm py-2 px-3 bg-white"
                  type="search"
                  placeholder="Search products, brands, colors..."
                  value={q}
                  aria-label="Search products"
                  aria-expanded={showSuggestions && q.trim().length >= 2}
                  aria-controls="search-suggestions"
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setShowSuggestions(true);
                  }}
                />
                <button className="btn btn-sm btn-warning px-3 fw-semibold" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>

              {showSuggestions && q.trim().length >= 2 && (
                <div id="search-suggestions" className="position-absolute start-0 end-0 bg-white rounded-3 shadow-lg mt-1 overflow-hidden border" style={{ zIndex: 1050 }} role="listbox" aria-label="Matching products">
                  {suggestions.length === 0 ? (
                    <div className="p-3 text-muted small">No exact match yet. Try a product, brand, category, or color.</div>
                  ) : suggestions.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="d-flex align-items-center gap-3 p-2 text-decoration-none text-dark border-bottom suggestion-item"
                    >
                      <img src={item.image} alt="" width="38" height="38" className="rounded object-fit-cover" />
                      <div className="flex-grow-1 text-truncate">
                        <div className="small fw-semibold text-truncate">{item.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          in {item.category} · <span className="text-primary fw-semibold">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  <i className="bi bi-grid me-1 d-lg-none"></i>Store
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Support</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link position-relative d-flex align-items-center gap-1" to="/wishlist">
                  <i className="bi bi-heart fs-6"></i>
                  <span className="d-lg-none">Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: 10 }}>
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link position-relative d-flex align-items-center gap-1" to="/cart">
                  <i className="bi bi-cart3 fs-6"></i>
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="badge rounded-pill bg-warning text-dark fw-bold" style={{ fontSize: 11 }}>
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>

              {isLoggedIn ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle btn btn-outline-light btn-sm px-3 text-white border-secondary" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name?.split(' ')[0] || 'Account'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2 text-primary"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="bi bi-box-seam me-2 text-primary"></i>My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wishlist">
                        <i className="bi bi-heart me-2 text-danger"></i>Wishlist ({wishlist.length})
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={() => { logout(); navigate('/'); }}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item d-flex gap-2 mt-2 mt-lg-0">
                  <Link className="btn btn-sm btn-light text-dark fw-semibold px-3" to="/login">Login</Link>
                  <Link className="btn btn-sm btn-accent px-3" to="/signup">Sign Up</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Flipkart-style Quick Category Bar */}
      <div className="bg-white border-bottom d-none d-md-block">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-2 overflow-auto gap-3 small">
            <Link to="/products" className="text-decoration-none text-dark fw-semibold text-nowrap hover-accent">
              All Products
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="text-decoration-none text-secondary fw-medium text-nowrap hover-accent"
              >
                {cat}
              </Link>
            ))}
            <Link to="/products?sort=discount" className="text-decoration-none text-danger fw-bold text-nowrap">
              <i className="bi bi-lightning-fill me-1"></i>Top Deals
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
