# Hooks Documentation

## User Types and Recommendation Strategies

This application distinguishes between different types of users and provides appropriate recommendation strategies for each:

### User Types

#### 🆕 **New Users**
- Users who have **no interaction history** (cold start problem)
- Haven't viewed, purchased, or rated any products yet
- Typically users who just signed up or are browsing anonymously

#### 👤 **Existing Users**
- Users with **established interaction history**
- Have viewed, purchased, rated, or added products to cart/wishlist
- Have sufficient data for personalized recommendations

#### 🔒 **Authenticated Users**
- Users who are currently logged in
- Can perform actions like adding to cart, wishlist, making purchases
- Required for personalized features and data persistence

### Recommendation Hooks

#### `useRecommendations()`
- **General recommendations** not tied to any specific user
- Based on overall popularity, trending items, or curated lists
- Safe to use for anonymous visitors

#### `useExistingUserRecommendations(userId)`
- **Personalized recommendations** for users with interaction history
- Uses machine learning models trained on user's past behavior
- Requires a valid `userId` parameter

#### `useNewUserRecommendations(numRecommendations)`
- **Cold start recommendations** for users without history
- Based on general popularity, category preferences, or demographic data
- Good for onboarding new users or first-time visitors

### Product Action Hooks

#### `useProductActions(productId)` - **For Product Detail Pages**
- **Full-featured hook** that fetches product data and provides all actions
- Combines product data, cart operations, wishlist operations, and interaction tracking
- **Use when**: Viewing a single product details page
- **Performance**: Makes individual product API call

#### `useProductCardActions(productId)` - **For Product Lists/Grids**
- **Lightweight hook** for product cards in lists (homepage, search results, catalog)
- Provides cart/wishlist actions WITHOUT fetching product data
- **Use when**: Product cards in lists where you already have product data
- **Performance**: Optimized for multiple simultaneous usage

### Usage Examples

#### Product Detail Page
```typescript
// ✅ Use useProductActions for detail pages
import { useProductActions } from '../hooks';

const ProductDetailPage = ({ productId }) => {
  const { 
    product,           // ← Fetches product data
    addToCart, 
    toggleWishlist, 
    isInCart,
    isInWishlist,
    isAddingToCart 
  } = useProductActions(productId);

  return (
    <div>
      <h1>{product?.title}</h1>
      <button onClick={() => addToCart(1)} disabled={isAddingToCart}>
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

#### Product Card in Lists  
```typescript
// ✅ Use useProductCardActions for cards in lists
import { useProductCardActions } from '../hooks';

const ProductCard = ({ product }) => {  // ← Product data already provided
  const { 
    addToCart, 
    toggleWishlist, 
    isInCart,
    isInWishlist,
    isAddingToCart,
    isAuthenticated 
  } = useProductCardActions(product.id);  // ← No product fetching

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      
      {isAuthenticated && (
        <div className="actions">
          <button 
            onClick={() => addToCart(1)} 
            disabled={isAddingToCart}
            className={isInCart ? 'in-cart' : ''}
          >
            {isAddingToCart ? 'Adding...' : isInCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
          
          <button 
            onClick={toggleWishlist}
            className={isInWishlist ? 'in-wishlist' : ''}
          >
            {isInWishlist ? '♥' : '♡'}
          </button>
        </div>
      )}
    </div>
  );
};
```

#### Homepage with Product Cards
```typescript
// ✅ Perfect for homepage/search results
import { useRecommendations } from '../hooks';
import { ProductCard } from './ProductCard';

const HomePage = () => {
  const { data: products, isLoading } = useRecommendations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="products-grid">
      {products?.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}  {/* ← Each card gets product data */}
        />                  {/* ← Each card uses useProductCardActions internally */}
      ))}
    </div>
  );
};
```

#### Search Results with Product Cards
```typescript
// ✅ Same pattern for search results
import { useProductSearch } from '../hooks';
import { ProductCard } from './ProductCard';

const SearchResults = ({ query }) => {
  const { data: products, isLoading } = useProductSearch(query);

  return (
    <div className="search-results">
      <h2>Results for "{query}"</h2>
      <div className="products-grid">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
```

#### Browse/Catalog Pages
```typescript
// ✅ Use recommendations for browse/catalog functionality
import { useRecommendations } from '../hooks';
import { ProductCard } from './ProductCard';

const CatalogPage = () => {
  const { data: products, isLoading } = useRecommendations();

  return (
    <div className="catalog">
      <h1>Browse Products</h1>
      <div className="products-grid">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
```

### Performance Benefits

#### ✅ **useProductCardActions** (Optimized for Lists)
- **Single cart query** shared across all product cards
- **Single wishlist query** shared across all product cards
- **No individual product queries** (data already available)
- **Fast rendering** of product grids/lists

#### ⚠️ **useProductActions** (Heavy for Lists) 
- **Individual product query** per product = N queries for N products
- **Individual cart query** per product = redundant data fetching
- **Slow rendering** when used in lists

### Authentication

For authentication, **always import `useAuth` directly from the AuthProvider**:

```typescript
// ✅ CORRECT: Import useAuth from AuthProvider
import { useAuth } from '../contexts/AuthProvider';

const { user, isAuthenticated, login, logout } = useAuth();
```

**Note**: `useAuth` is NOT re-exported from the hooks index to avoid confusion. The AuthProvider is the single source of truth for authentication state.

### Error Handling

- Cart and wishlist operations require authentication
- Hooks will throw descriptive errors like "User must be authenticated to add to cart"
- Recommendation hooks gracefully handle missing or invalid user IDs 