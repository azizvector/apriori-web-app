import Layout from '@/layouts';
import { Input, Date, Table, Button } from '@/components';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Cookie from 'js-cookie'
import Router from 'next/router'
import axios from "axios";

export default function Login() {
  const [fields, setFields] = useState({
    username: '',
    password: '',
  })

  const { push } = useRouter();
  useEffect(() => {
    const token = Cookie.get('token')
    if (token) {
      push('/dashboard');
    }
  }, []);
  
  const [status, setStatus] = useState('normal')

  const loginHandler = async (e: any) => {
    e.preventDefault()
    console.log("fields", fields);

    try {
      const { data } = await axios.post("/api/auth/login", fields);
      console.log("loginReq", data);
      Cookie.set('token', data)
      Router.push('/dashboard')
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  }

  
  const fieldHandler = (e: any) => {
    console.log(e.target.name);

    const name = e.target.name
    setFields({
      ...fields,
      [name]: e.target.value
    })
  }
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-shrink-0 items-center justify-center">
          <Image
            className="h-9 w-9"
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="bg-white py-14 px-14 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex flex-col items-center justify-between gap-4">

            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Sign in to your account
            </h3>
            <p className="text-sm text-[#B5B5C3]">
              Applications Of Apriori Algorithm
            </p>
          </div>
          <form className="space-y-6" onSubmit={loginHandler} method="POST">
            <Input
              label="Username"
              placeholder='Username'
              name='username'
              onChange={fieldHandler}
            />
            <Input
              label="Password"
              name='password'
              placeholder='Password'
              onChange={fieldHandler}
            />
            <Button
              title="Login"
              color="primary"
              onClick={() => { }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}