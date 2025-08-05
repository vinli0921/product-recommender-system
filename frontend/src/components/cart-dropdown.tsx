import { Card, CardBody, Button, Flex, FlexItem } from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { useAuth } from '../contexts/AuthProvider';
import { useCart, useRemoveFromCart, useUpdateCart } from '../hooks/useCart';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to generate consistent prices based on product ID
const hash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Calculate total cart value
const calculateCartTotal = (cartItems: any[]): number => {
  return cartItems.reduce((total, item) => {
    const itemPrice = (hash(item.product_id) % 40) + 10; // $10-50 based on product ID
    return total + itemPrice * (item.quantity || 1);
  }, 0);
};

export const CartDropdown = ({ isOpen, onClose }: CartDropdownProps) => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const { data: cartItems, isLoading } = useCart(userId);
  const removeFromCartMutation = useRemoveFromCart();
  const updateCartMutation = useUpdateCart(); // ← Add this import at the top

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity becomes 0 or less, remove the item
      handleRemoveItem(productId);
      return;
    }

    console.log('📝 Updating quantity:', { productId, newQuantity });
    updateCartMutation.mutate(
      {
        user_id: userId,
        product_id: productId,
        quantity: newQuantity,
      },
      {
        onSuccess: () => {
          console.log('✅ Quantity updated successfully');
        },
        onError: error => {
          console.log('❌ Failed to update quantity:', error);
        },
      }
    );
  };

  const handleRemoveItem = (productId: string) => {
    console.log('🗑️ Removing entire item:', productId);
    removeFromCartMutation.mutate(
      {
        user_id: userId,
        product_id: productId,
        quantity: 1, // Not used for delete, but required by interface
      },
      {
        onSuccess: () => {
          console.log('✅ Item removed successfully');
        },
        onError: error => {
          console.log('❌ Failed to remove item:', error);
        },
      }
    );
  };

  return (
    <>
      {/* Backdrop to close dropdown when clicking outside */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          zIndex: 999,
        }}
        onClick={onClose}
      />

      {/* Cart dropdown */}
      <Card
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '320px',
          maxHeight: '400px',
          overflow: 'auto',
          zIndex: 1000,
          marginTop: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #d2d2d2',
        }}
      >
        <CardBody>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              🛒 Your Cart ({cartItems?.length || 0} items)
            </h3>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Loading cart...
            </div>
          ) : cartItems?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ margin: 0, color: '#6a6e73' }}>Your cart is empty</p>
              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#6a6e73',
                }}
              >
                Add some products to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div style={{ marginBottom: '16px' }}>
                {cartItems?.map((item, index) => {
                  const quantity = item.quantity || 1; // ← Define once, use everywhere
                  const isRemoving =
                    removeFromCartMutation.isPending &&
                    removeFromCartMutation.variables?.product_id ===
                      item.product_id;
                  const isUpdating =
                    updateCartMutation.isPending &&
                    updateCartMutation.variables?.product_id ===
                      item.product_id;

                  return (
                    <div
                      key={`${item.product_id}-${index}`}
                      style={{
                        padding: '12px 0',
                        borderBottom:
                          index < cartItems.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        opacity: isRemoving || isUpdating ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <Flex alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            Product {item.product_id}
                          </div>

                          {/* Quantity Controls */}
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6a6e73',
                              marginTop: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span>
                              Price: $
                              {((hash(item.product_id) % 40) + 10).toFixed(2)}
                            </span>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                border: '1px solid #d2d2d2',
                                borderRadius: '4px',
                                padding: '2px',
                              }}
                            >
                              {/* Minus Button */}
                              <Button
                                variant='plain'
                                aria-label='Decrease quantity'
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    quantity - 1
                                  )
                                }
                                isDisabled={
                                  isUpdating || isRemoving || quantity <= 1
                                }
                                style={{
                                  padding: '2px 6px',
                                  minHeight: 'auto',
                                  fontSize: '14px',
                                  lineHeight: 1,
                                }}
                              >
                                −
                              </Button>

                              {/* Quantity Display */}
                              <span
                                style={{
                                  minWidth: '20px',
                                  textAlign: 'center',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                {quantity}
                              </span>

                              {/* Plus Button */}
                              <Button
                                variant='plain'
                                aria-label='Increase quantity'
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    quantity + 1
                                  )
                                }
                                isDisabled={isUpdating || isRemoving}
                                style={{
                                  padding: '2px 6px',
                                  minHeight: 'auto',
                                  fontSize: '14px',
                                  lineHeight: 1,
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </FlexItem>

                        <FlexItem>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              marginRight: '8px',
                            }}
                          >
                            $
                            {(
                              ((hash(item.product_id) % 40) + 10) *
                              quantity
                            ).toFixed(2)}
                          </div>
                        </FlexItem>

                        <FlexItem>
                          {/* Remove button - now removes entire item */}
                          <Button
                            variant='plain'
                            aria-label={`Remove ${item.product_id} from cart`}
                            onClick={() => handleRemoveItem(item.product_id)}
                            isLoading={isRemoving}
                            isDisabled={isRemoving || isUpdating}
                            style={{
                              padding: '4px',
                              minHeight: 'auto',
                              color: '#c9190b',
                            }}
                          >
                            {isRemoving ? (
                              <span style={{ fontSize: '12px' }}>...</span>
                            ) : (
                              <TrashIcon size={12} />
                            )}
                          </Button>
                        </FlexItem>
                      </Flex>
                    </div>
                  );
                })}
              </div>

              {/* Cart Total */}
              <div
                style={{
                  padding: '12px 0',
                  borderTop: '2px solid #f0f0f0',
                  marginBottom: '16px',
                }}
              >
                <Flex alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Total:
                    </span>
                  </FlexItem>
                  <FlexItem>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      ${calculateCartTotal(cartItems || []).toFixed(2)}
                    </span>
                  </FlexItem>
                </Flex>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Flex
            direction={{ default: 'column' }}
            spaceItems={{ default: 'spaceItemsSm' }}
          >
            <FlexItem>
              <Button
                variant='primary'
                style={{ width: '100%' }}
                isDisabled={!cartItems?.length}
                onClick={() => {
                  alert('🚀 Checkout coming soon!');
                  onClose();
                }}
              >
                Checkout ({cartItems?.length || 0} items)
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant='secondary'
                style={{ width: '100%' }}
                onClick={() => {
                  console.log('🛒 View full cart');
                  onClose();
                }}
              >
                View Cart
              </Button>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
