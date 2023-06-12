import Layout from '@/layouts';
import { Button, UploadFile, Select, Table } from '@/components';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import moment from 'moment';

export default function Upload() {
  const { push } = useRouter();
  const [data, setData] = useState<any[]>([]);

  const header = [
    {
      fieldId: 'index',
      label: 'No'
    },
    {
      fieldId: 'order_id',
      label: 'Order ID',
    },
    {
      fieldId: 'order_date',
      label: 'Order Date',
      renderItem: (order_date: string) => (<>
        {moment(order_date).format('DD-MM-yyyy')}
      </>)
    },
    {
      fieldId: 'products',
      label: 'Products',
      renderItem: (products: string) => (
        <div className="text-left">{products}</div>
      )
    },
  ];

  useEffect(() => {
    const getTransaction: any = async (e: any) => {
      try {
        const { data } = await axios.get("/api/transaction");
        setData(data)
      } catch (error: any) {
        console.error(error.response.data.message);
      }
    }
    getTransaction()
  }, []);

  const [datas, setDatas] = useState<any[]>([]);
  const handleChangeFIle = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        const arrayBuffer: any = this.result,
          array: any = new Uint8Array(arrayBuffer),
          binaryString = String.fromCharCode.apply(null, array),
          workbook: any = XLSX.read(binaryString, { type: "binary" }),
          first_sheet_name = workbook.SheetNames[0],
          worksheet = workbook.Sheets[first_sheet_name],
          data = XLSX.utils.sheet_to_json(worksheet, { raw: false }),
          res = data.map((o: any) => [o.order_id, o.date, o.products])
        setDatas(res)
      }
      reader.readAsArrayBuffer(file);
    }
  };

  const insertDataToDB = async () => {
    if (!isEmpty(datas)) {
      const { data } = await axios.post("/api/upload", datas);
      console.log(data);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-11">
      <div className="col-span-1">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Upload Transaction
            </h3>
          </div>
          <div className="space-y-6">
            <UploadFile
              onChange={handleChangeFIle}
            />
            <div className="p-4 text-sm text-gray-800 rounded-md bg-gray-50" role="alert">
              <span className="font-medium">Dark alert!</span> Change a few things up and try submitting again.
            </div>
            <div className="pt-4">
              <Button
                title="Upload"
                color="primary"
                onClick={insertDataToDB}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex flex-col  gap-2">
            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Transaction List
            </h3>
            <p className="text-sm text-[#B5B5C3]">
              Total Record {data.length}
            </p>
          </div>
          <div className="flex flex-col max-h-[calc(100vh_-_20rem)]">
            <div className="overflow-x-auto overflow-y-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="overflow-hidden border border-[#BDBDBD] rounded-lg">
                  <Table data={data} headers={header} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Upload.getLayout = (page: any) => <Layout>{page}</Layout>;