import { useState } from 'react';
import { Button, Badge } from '@patternfly/react-core';
import { ShoppingCartIcon } from '@patternfly/react-icons';
import { useAuth } from '../contexts/AuthProvider';
import { useCart } from '../hooks/useCart';
import { CartDropdown } from './cart-dropdown'; // ← Add this import

export const CartIcon = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  
  // Cart data and dropdown state
  const { data: cartItems } = useCart(userId);
  const cartCount = cartItems?.length || 0;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ← Add state

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('🛒 Cart clicked! Current state:', isDropdownOpen); // Debug log
    setIsDropdownOpen(!isDropdownOpen); // ← Toggle dropdown
    console.log('🛒 Setting dropdown to:', !isDropdownOpen); // Debug log
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant="plain"
        aria-label={`Shopping cart with ${cartCount} items`}
        onClick={handleCartClick} // ← Updated click handler
      >
        <ShoppingCartIcon />
      </Button>
      
      {/* Cart count badge */}
      {cartCount > 0 && (
        <Badge
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#c9190b',
            color: 'white',
            minWidth: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </Badge>
      )}

      {/* Cart dropdown - ADD THIS */}
      <CartDropdown 
        isOpen={isDropdownOpen} 
        onClose={handleCloseDropdown} 
      />
    </div>
  );
};