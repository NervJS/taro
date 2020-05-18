/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from "@docusaurus/router";

import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';
import useThemeContext from '@theme/hooks/useThemeContext';
import useHideableNavbar from '@theme/hooks/useHideableNavbar';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useLogo from '@theme/hooks/useLogo';

import styles from './navbar.module.css';

function useVersion() {
  const {
    siteConfig: {
      customFields: {
        versions = []
      },
    },
  } = useDocusaurusContext();

  const defaultVersion = versions[0]
  const location = useLocation()
  let currentVersion = versions.find(v => {
    return location.pathname.includes(v)
  })
  if (location.pathname.includes('/docs/next')) {
    currentVersion = 'next'
  }

  return [defaultVersion, currentVersion ?? defaultVersion]
}

function NavLink({ activeBasePath, activeRegxp, to, href, label, position, ...props }) {
  const [defaultVersion, currentVersion] = useVersion()
  if (defaultVersion !== currentVersion && props.version) {
    label = (currentVersion === 'next' ? '' : 'v')+ currentVersion
  }
  const isDocs = to && to.startsWith('docs/')
  if (isDocs && defaultVersion !== currentVersion) {
    const [docs, ...rest] = to.split('/')
    to = [docs, currentVersion, ...rest].join('/')

    const [base, ...remain] = activeBasePath.split('/')
    activeBasePath = [base, currentVersion, ...remain].join('/')
  }

  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  // console.log(toUrl)
  return (
    <Link
      {...(href
        ? {
          target: '_blank',
          rel: 'noopener noreferrer',
          href,
        }
        : {
          isNavLink: true,
          activeClassName: 'navbar__link--active',
          to: toUrl,
          ...(activeBasePath
            ? {
              isActive: (_match, location) =>
                activeRegxp
                  ? new RegExp(activeBasePath).test(location.pathname)
                  : location.pathname.startsWith(activeBaseUrl)
              ,
            }
            : null),
        })}
      {...props}>
      {label}
    </Link>
  );
}

function NavItem({ items, position, ...props }) {
  if (!items) {
    return <NavLink {...props} className={classnames(['navbar__item', 'navbar__link', props.className])} />;
  }

  return (
    <div
      className={classnames('navbar__item', 'dropdown', 'dropdown--hoverable', {
        'dropdown--left': position === 'left',
        'dropdown--right': position === 'right',
      })}>
      <NavLink className="navbar__item navbar__link" {...props}>
        {props.label}
      </NavLink>
      <ul className="dropdown__menu">
        {items.map((linkItemInner, i) => (
          <li key={i}>
            <NavLink className="navbar__item navbar__link" {...linkItemInner} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileNavItem({ items, ...props }) {
  if (!items) {
    return (
      <li className="menu__list-item">
        <NavLink className="menu__link" {...props} />
      </li>
    );
  }

  return (
    <li className="menu__list-item">
      <NavLink className="menu__link menu__link--sublist" {...props}>
        {props.label}
      </NavLink>
      <ul className="menu__list">
        {items.map((linkItemInner, i) => (
          <li className="menu__list-item" key={i}>
            <NavLink className="menu__link" {...linkItemInner} />
          </li>
        ))}
      </ul>
    </li>
  );
}

function Navbar() {
  const {
    siteConfig: {
      themeConfig: {
        navbar: { title, links = [], hideOnScroll = false } = {},
        disableDarkMode = false,
      },
    },
    isClient,
  } = useDocusaurusContext();
  const [sidebarShown, setSidebarShown] = useState(false);
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  const { isDarkTheme, setLightTheme, setDarkTheme } = useThemeContext();
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
  const { logoLink, logoLinkProps, logoImageUrl, logoAlt } = useLogo();

  useLockBodyScroll(sidebarShown);

  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);

  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );

  return (
    <nav
      ref={navbarRef}
      className={classnames('navbar', 'navbar--light', 'navbar--fixed-top', {
        'navbar-sidebar--show': sidebarShown,
        [styles.navbarHideable]: hideOnScroll,
        [styles.navbarHidden]: !isNavbarVisible,
      })}>
      <div className="navbar__inner">
        <div className="navbar__items">
          <div
            aria-label="Navigation bar toggle"
            className="navbar__toggle"
            role="button"
            tabIndex={0}
            onClick={showSidebar}
            onKeyDown={showSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              role="img"
              focusable="false">
              <title>Menu</title>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </div>
          <Link className="navbar__brand" to={logoLink} {...logoLinkProps}>
            {logoImageUrl != null && (
              <img
                key={isClient}
                className="navbar__logo"
                src={logoImageUrl}
                alt={logoAlt}
              />
            )}
            {title != null && (
              <strong
                className={classnames('navbar__title', {
                  [styles.hideLogoText]: isSearchBarExpanded,
                })}>
                {title}
              </strong>
            )}
          </Link>
          {links
            .filter((linkItem) => linkItem.position === 'left')
            .map((linkItem, i) => (
              <NavItem {...linkItem} key={i} />
            ))}
        </div>
        <div className="navbar__items navbar__items--right">
          {links
            .filter((linkItem) => linkItem.position === 'right')
            .map((linkItem, i) => (
              <NavItem {...linkItem} key={i} />
            ))}
          {!disableDarkMode && (
            <Toggle
              className={styles.displayOnlyInLargeViewport}
              aria-label="Dark mode toggle"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
          <SearchBar
            handleSearchBarToggle={setIsSearchBarExpanded}
            isSearchBarExpanded={isSearchBarExpanded}
          />
        </div>
      </div>
      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={hideSidebar}
      />
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <Link
            className="navbar__brand"
            onClick={hideSidebar}
            to={logoLink}
            {...logoLinkProps}>
            {logoImageUrl != null && (
              <img
                key={isClient}
                className="navbar__logo"
                src={logoImageUrl}
                alt={logoAlt}
              />
            )}
            {title != null && (
              <strong className="navbar__title">{title}</strong>
            )}
          </Link>
          {!disableDarkMode && sidebarShown && (
            <Toggle
              aria-label="Dark mode toggle in sidebar"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
        </div>
        <div className="navbar-sidebar__items">
          <div className="menu">
            <ul className="menu__list">
              {links.map((linkItem, i) => (
                <MobileNavItem {...linkItem} onClick={hideSidebar} key={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
