import { useEffect, useState } from 'react';
import { ShoppingBagIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid'
import Layout from '@/layouts';
import Image from 'next/image';
import axios from 'axios';

export default function Dashboard() {
  const [count, setCount] = useState<any>({
    transaction: 0,
    process: 0
  });

  useEffect(() => {
    getSummary();
  }, []);

  const getSummary = async () => {
    try {
      const resTrans = await axios.get("/api/count/transaction");
      const resProcess = await axios.get("/api/count/process");
      setCount({
        transaction: resTrans.data.count,
        process: resProcess.data.count,
      })
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-11">
      <div className="col-span-1">
        <div className="grid gap-11">
          <div className="grid grid-cols-2 gap-11">
            <div className="col-span-1">
              <div className="bg-[#3699FF] py-9 px-8 rounded-xl">
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl text-white font-semibold uppercase">
                    {count.transaction}
                  </h3>
                  <ShoppingBagIcon className="w-10 h-10 text-white" />
                </div>
                <div className="mt-4 text-white font-semibold uppercase">
                  Total Transaksi
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="bg-[#1BC5BD] py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
                <div className="flex justify-between">
                  <h3 className="text-3xl text-white font-semibold uppercase">
                    {count.process}
                  </h3>
                  <ClipboardDocumentIcon className="w-10 h-10 text-white" />
                </div>
                <div className="mt-4 text-white font-semibold uppercase">
                  Total Proses
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-3xl text-[#464E5F] font-semibold uppercase">
              Apriori
            </h3>
            <div className="mb-6 text-gray-400">
              Metode data mining untuk mencari frekuensi hubungan atau pola hubungan antar atribut dalam dataset
            </div>
            <div className="px-10">
              <Image
                className="h-9 w-9"
                src="/apriori.png"
                alt="Apriori"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <div className="grid gap-11">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
              Manfaat Apriori
            </h3>
            <ul className="ml-5 max-w-md space-y-1 text-gray-400 list-disc list-outside">
              <li>
                Market basket Analysis (Menganalisa kebiasaan customer dalam memilih item pembelian)
              </li>
              <li>
                Sistem Rekomendasi
              </li>
              <li>
                Menyediakan stok
              </li>
              <li>
                Pemberian diskon
              </li>
              <li>
                Sistem bundling
              </li>
            </ul>
          </div>
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
              Indikator Algoritma Apriori
            </h3>
            <div className="mb-1.5 text-lg text-gray-500 font-semibold">
              Support (Penunjang)
            </div>
            <div className="mb-6 text-gray-400">
              adalah persentase kombinasi item
            </div>
            <div className="mb-1.5 text-lg text-gray-500 font-semibold">
              Confidence (Kepastian)
            </div>
            <div className="mb-6 text-gray-400">
              adalah kuatnya hubungan item antar item dalam aturan assosiatif
            </div>
            <div className="mb-1.5 text-lg text-gray-500 font-semibold">
              Lift Ratio
            </div>
            <div className="text-gray-400">
              adalah untuk cek apakah rule tersebut valid
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

Dashboard.getLayout = (page: any) => <Layout>{page}</Layout>;