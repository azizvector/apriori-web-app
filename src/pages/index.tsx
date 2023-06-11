import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts';

export default function Example() {
  const { push } = useRouter();
  useEffect(() => {
    push('/dashboard');
  }, []);
  return <></>;
}

Example.getLayout = (page: any) => <Layout>{page}</Layout>;