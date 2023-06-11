import { useRouter } from 'next/router';
import { Header } from './Header';
import { HTMLAttributes, useEffect } from 'react';
import Cookie from 'js-cookie'

export interface ILayout extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Layout(props: ILayout): React.ReactElement {
  const { push } = useRouter();
  const { children } = props;
  const token = Cookie.get('token')
  useEffect(() => {
    if (!token) {
      push('/auth/login');
    }
  }, []);
  return (
    <div className="min-h-full">
      <Header />
      <main className="mx-auto max-w-7xl mt-[4.5rem]">
        <div className="py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
