import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-white p-5 rounded-4 shadow-sm mx-auto" style={{ maxWidth: 460 }}>
          <i className="bi bi-heart text-muted" style={{ fontSize: 64 }}></i>
          <h4 className="mt-3 fw-bold">Your wishlist is empty</h4>
          <p className="text-muted small">Tap the heart icon on any product to save it for later.</p>
          <Link to="/products" className="btn btn-accent mt-2">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">My Wishlist ({items.length})</h4>
      <div className="row g-3">
        {items.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
