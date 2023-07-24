import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import Cookie from 'js-cookie'
import jwt from "jsonwebtoken"
import { upperCase } from 'lodash';

export interface IHeaderMenu {
  href: string;
  label: string;
}

const navigation: IHeaderMenu[] = [
  { label: 'Beranda', href: '/dashboard' },
  { label: 'Unggah', href: '/upload' },
  { label: 'Proses', href: '/processing' },
]

export const Header = (): React.ReactElement => {
  const [user, setUser] = useState<any>({
    id: '',
    name: '',
    username: '',
  });
  const { pathname, replace } = useRouter();
  
  useEffect(() => {
    const token: any = Cookie.get('token')
    if (token) {
      jwt.verify(token, "apriori", (err: any, decoded: any) => {
        setUser(decoded)
      })
    }
  }, []);

  const paths = pathname.split('/');
  const path = `/${paths[1]}`;

  const logout = () => {
    Cookie.remove('token')
    replace('/auth/login')
  }

  return (
    <nav className="bg-[#274C77] fixed w-full z-20 top-0 left-0">
      <div className="mx-auto max-w-7xl px-2">
        <div className="relative flex h-[4.5rem] items-center justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                className="h-9 w-9"
                src="/logo.png"
                alt="Logo"
                width={36}
                height={36}
              />
            </div>
            <div className="block ml-14 mt-3">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <div key={item.label} className="relative flex">
                    <Link
                      href={item.href}
                      className={classNames(
                        'text-center px-5 py-[1.125rem] font-semibold rounded-t-xl', {
                        'text-white hover:text-[#D8E5F3]': path !== item.href,
                        'bg-[#F2F3F7] text-[#274C77] before:absolute before:bottom-0 before:-left-5 before:bg-[#F2F3F7] before:w-5 before:h-5 after:absolute after:bottom-0 after:left-[100%] after:bg-[#F2F3F7] after:w-5 after:h-5': path === item.href,
                      })}
                    >
                      <div className={classNames({
                        'before:absolute before:bottom-0 before:-left-9 before:bg-[#274C77] before:w-9 before:h-9 before:rounded-full before:z-[1] after:absolute after:bottom-0 after:left-[100%] after:bg-[#274C77] after:w-9 after:h-9 after:rounded-full after:z-[1]': path === item.href
                      })}>
                        {item.label}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="static inset-auto right-0 flex items-center ml-6">
            <div className="flex flex-col items-end justify-between gap-1">
              <h3 className="text-sm text-white font-medium">
                {user && user.name}
              </h3>
              <p className="text-xs text-[#9CCDFF] font-medium">
                Administration
              </p>
            </div>
            <Menu as="div" className="relative ml-3.5">
              <div>
                <Menu.Button className="bg-[#FFFFFF14] text-white text-lg font-medium h-10 w-10 rounded-md focus:outline-none">
                  {user && upperCase(user.name[0])}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <div onClick={logout} className={classNames(active ? 'bg-gray-100' : '', 'block cursor-pointer px-4 py-2 text-sm text-gray-700')}>
                        Sign out
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};
