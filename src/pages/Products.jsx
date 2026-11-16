import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { products, categories, brands } from '../data/products';
import { searchProducts } from '../utils/productSearch';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || '');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState(params.get('sort') || 'featured');
  const [maxPrice, setMaxPrice] = useState(250000);
  const [minRating, setMinRating] = useState(0);
  const search = params.get('search') || '';

  useEffect(() => {
    setCategory(params.get('category') || '');
    setSort(params.get('sort') || 'featured');
  }, [params]);

  const filtered = useMemo(() => {
    let list = search ? searchProducts(search, products) : [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    list = list.filter((p) => p.price <= maxPrice);

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'discount') list.sort((a, b) => b.discount - a.discount);
    return list;
  }, [search, category, brand, maxPrice, minRating, sort]);

  const clearAll = () => {
    setCategory('');
    setBrand('');
    setMaxPrice(250000);
    setMinRating(0);
    setSort('featured');
    setParams({});
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="filter-sidebar shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0"><i className="bi bi-funnel me-1"></i>Filters</h6>
              <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={clearAll}>Reset All</button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <select
                className="form-select form-select-sm"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value) setParams({ category: e.target.value });
                  else setParams({});
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Brand</label>
              <select className="form-select form-select-sm" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</label>
              <input
                type="range"
                className="form-range"
                min="1000"
                max="250000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Customer Rating</label>
              {[4.5, 4, 3].map((r) => (
                <div className="form-check" key={r}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="ratingFilter"
                    id={`rate-${r}`}
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                  />
                  <label className="form-check-label small" htmlFor={`rate-${r}`}>
                    {r}★ & above
                  </label>
                </div>
              ))}
              {minRating > 0 && (
                <button className="btn btn-link btn-sm p-0 mt-1" onClick={() => setMinRating(0)}>Any rating</button>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 bg-white p-3 rounded-3 shadow-sm border">
            <div>
              <h5 className="mb-0 fw-bold">
                {search ? `Results for "${search}"` : category || 'All Products'}
              </h5>
              <span className="text-muted small">Showing {filtered.length} items</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Sort by:</span>
              <select className="form-select form-select-sm w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Relevance / Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h5 className="mt-3">No matching products found</h5>
              <p className="text-muted small">Try clearing filters or searching another keyword.</p>
              <button className="btn btn-accent btn-sm" onClick={clearAll}>Show All Products</button>
            </div>
          ) : (
            <div className="row g-3">
              {filtered.map((p) => (
                <div className="col-6 col-md-4" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
