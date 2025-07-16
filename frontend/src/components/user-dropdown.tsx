import { useState } from 'react';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  type MenuToggleElement,
} from '@patternfly/react-core';
import { UserIcon, SignOutAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { Link } from '@tanstack/react-router';

export const UserDropdown: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

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
          User Lastname
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem key="account" to="/account" component="button" icon={<UserIcon />}>
          My Account
        </DropdownItem>
        <DropdownItem key="logout" icon={<SignOutAltIcon />}>
          Log out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
