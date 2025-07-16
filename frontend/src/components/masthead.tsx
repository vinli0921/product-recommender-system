import {
  Flex,
  FlexItem,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Masthead as PFMasthead,
  PageToggleButton,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
  Avatar,
  Divider,
} from '@patternfly/react-core';

import { Link, useLocation } from '@tanstack/react-router';
import { BarsIcon, CogIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { Search } from './search';
import { UserDropdown } from './user-dropdown';
import { useState } from 'react';

export const themeStorageKey = 'app-theme';

interface MastheadProps {
  showSidebarToggle?: boolean;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export function Masthead({
  showSidebarToggle = false,
  isSidebarOpen = false,
  onSidebarToggle,
}: MastheadProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggle =
    showSidebarToggle && onSidebarToggle ? (
      <PageToggleButton
        variant="plain"
        aria-label="Global navigation"
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={onSidebarToggle}
        id="main-padding-nav-toggle"
      >
        <BarsIcon />
      </PageToggleButton>
    ) : null;

  const mobileMenuToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label="User menu"
      variant="plain"
    >
      <EllipsisVIcon />
    </MenuToggle>
  );

  const toolbar = (
    <Toolbar isFullHeight>
      <ToolbarContent>
        <ToolbarGroup
          className="pf-v6-u-w-100 pf-v6-u-w-75-on-md pf-v6-u-px-xl-on-md"
          variant="filter-group"
          align={{ default: 'alignCenter' }}
        >
          <ToolbarItem className="pf-v6-u-w-100">
            <Search />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup
          variant="action-group"
          className="pf-v6-u-display-none pf-v6-u-display-block-on-md"
        >
          <ToolbarItem>
            <UserDropdown />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const title =
    location.pathname == '/search'
      ? 'Search'
      : location.pathname == '/account'
        ? 'My Account'
        : location.pathname == '/login'
          ? 'Login'
          : location.pathname == '/signup'
            ? 'Sign Up'
            : 'Product Recommendations';

  return (
    <PFMasthead>
      <MastheadMain>
        {showSidebarToggle && <MastheadToggle>{toggle}</MastheadToggle>}
        <MastheadBrand data-codemods>
          <Title headingLevel="h4">{title}</Title>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{toolbar}</MastheadContent>
    </PFMasthead>
  );
}
