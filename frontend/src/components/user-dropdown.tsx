import { useState } from 'react';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
} from '@patternfly/react-core';
import { UserIcon, SignOutAltIcon } from '@patternfly/react-icons';
import { useAuth } from '../contexts/AuthProvider';

export const UserDropdown: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    onSelect();
  };

  // Don't render if not authenticated or still loading
  if (!isAuthenticated || isLoading) {
    return null;
  }

  // Extract user's first name or use email as fallback
  const displayName = user?.email.split('@')[0] || 'User';

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      popperProps={{
        position: 'right',
      }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          icon={<Avatar size="sm" src="/vite.svg" alt="User avatar" />}
          ref={toggleRef}
          onClick={toggle}
          aria-label="User menu"
        >
          {displayName}
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="account" to="/account" component="button" icon={<UserIcon />}>
          My Account
        </DropdownItem>
        <DropdownItem key="logout" icon={<SignOutAltIcon />} onClick={handleLogout}>
          Log out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
