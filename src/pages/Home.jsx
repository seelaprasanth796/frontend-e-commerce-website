import { Link } from 'react-router-dom';
import { products, categoryMeta } from '../data/products';
import ProductCard from '../components/ProductCard';

const editorialImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85';

export default function Home() {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const deals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 4);

  return (
    <div className="storefront-home">
      <section className="home-hero">
        <img
          className="home-hero-image"
          src={editorialImage}
          alt="A curated edit of this season’s fashion and accessories"
          fetchPriority="high"
        />
        <div className="home-hero-shade" />
        <div className="container home-hero-content">
          <span className="eyebrow eyebrow-light">THE GOOD FINDS EDIT · VOL. 04</span>
          <h1>Everyday objects.<br /><em>Extraordinary</em> finds.</h1>
          <p>Thoughtful picks for the way you live, work, and get out there.</p>
          <Link to="/products" className="btn hero-cta">Explore the collection <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></Link>
          <div className="hero-note"><span className="hero-note-line" /> Curated for you, delivered with care</div>
        </div>
        <div className="hero-index" aria-hidden="true">01 <span /> 03</div>
      </section>

      <section className="container category-section" aria-labelledby="categories-heading">
        <div className="section-heading category-heading">
          <div><span className="eyebrow">A LITTLE BIT OF EVERYTHING</span><h2 id="categories-heading">Shop by mood</h2></div>
          <Link to="/products" className="text-link">View all categories <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
        </div>
        <div className="category-grid">
          {categoryMeta.slice(0, 6).map((category, index) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className={`category-tile category-tile-${index + 1}`}
            >
              <img src={category.image} alt="" loading="lazy" />
              <span className="category-tile-overlay" />
              <span className="category-tile-name">{category.name}<i className="bi bi-arrow-up-right" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">THE ONES WE LOVE</span><h2>Good things, right now</h2><p>Our current favorites, picked with intention.</p></div>
            <Link to="/products" className="text-link">Shop the edit <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
          </div>
          <div className="row g-3 g-lg-4">
            {featured.map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}
          </div>
        </div>
      </section>

      <section className="container story-section">
        <div className="story-copy">
          <span className="eyebrow">A BETTER WAY TO SHOP</span>
          <h2>Less scrolling.<br /><em>More finding.</em></h2>
          <p>We bring the useful, the beautiful, and the just-because into one considered collection. Good quality, honest prices, no fuss.</p>
          <Link to="/products" className="text-link">Find your next favorite <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
        </div>
        <div className="story-image-wrap"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85" alt="A calm, sunlit home interior with thoughtfully chosen objects" loading="lazy" /><span>Made for the everyday</span></div>
      </section>

      <section className="deal-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow eyebrow-light">A GOOD DEAL IS A GOOD FEELING</span><h2>Worth a second look</h2><p>Limited-time prices on pieces we think you’ll love.</p></div>
            <Link to="/products?sort=discount" className="text-link text-link-light">See all offers <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
          </div>
          <div className="row g-3 g-lg-4">
            {deals.map((product) => <div className="col-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}
          </div>
        </div>
      </section>

      <section className="container promise-strip" aria-label="Our shopping promises">
        <div><i className="bi bi-box-seam" aria-hidden="true" /><span><strong>Free delivery</strong><small>On orders over ₹999</small></span></div>
        <div><i className="bi bi-arrow-repeat" aria-hidden="true" /><span><strong>Easy returns</strong><small>7 days to change your mind</small></span></div>
        <div><i className="bi bi-patch-check" aria-hidden="true" /><span><strong>Good, genuine goods</strong><small>Carefully selected brands</small></span></div>
        <div><i className="bi bi-shield-check" aria-hidden="true" /><span><strong>Secure checkout</strong><small>Your details stay protected</small></span></div>
      </section>
    </div>
  );
}
