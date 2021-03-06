import React, { useContext } from 'react';
import Link from 'next/link';
import { GlobalContext } from '~/context';

interface NavLink {
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const user = useContext(GlobalContext).user;
  const isUserSignin = user !== null;
  const links: (boolean | NavLink)[] = [
    {
      label: 'Home',
      href: '/',
    },
    !isUserSignin && {
      label: 'Sign Up',
      href: '/auth/signup',
    },
    !isUserSignin && {
      label: 'Sign In',
      href: '/auth/signin',
    },
    isUserSignin && {
      label: 'My Order',
      href: '/orders',
    },
    isUserSignin && {
      label: 'Sells Ticket',
      href: '/tickets/create',
    },
    isUserSignin && {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ];
  const activeLinks = links.filter((link) => link !== false) as NavLink[];

  return (
    <div className="bg-dark">
      <div className="container">
        <div className="navbar navbar-expand-lg navbar-dark bg-dark px-0 justify-content-between">
          <Link href="/">
            <a className="navbar-brand">GitTix</a>
          </Link>

          <div className="d-flex">
            <ul className="navbar-nav d-flex align-items-center flex-row">
              {activeLinks.map((link) => (
                <li key={link.label} className="nav-item">
                  <Link href={link.href}>
                    <a className="nav-link p-2">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
