import { Button, UploadFile, Table } from '@/components';
import { useEffect, useState } from 'react';
import { isEmpty, some } from 'lodash';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import Layout from '@/layouts';
import axios from 'axios';
import moment from 'moment';

const excelType = [
  "application/vnd.ms-excel",
  "application/vnd.ms-excel",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/vnd.ms-excel.template.macroEnabled.12",
  "application/vnd.ms-excel.addin.macroEnabled.12",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
]

export default function Upload() {
  const [datas, setDatas] = useState<any[]>([]);
  const [files, setFiles] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(true);
  const [error, setError] = useState<string>('')

  const header = [
    {
      fieldId: 'index',
      label: 'No',
      width: 60
    },
    {
      fieldId: 'order_id',
      label: 'ID Transaksi',
      width: 120
    },
    {
      fieldId: 'order_date',
      label: 'Tanggal Transaksi',
      renderItem: (order_date: string) => (<>
        {moment(order_date).format('DD-MM-yyyy')}
      </>),
      width: 158
    },
    {
      fieldId: 'products',
      label: 'Produk',
      renderItem: (products: string, index: number) => (<>
        <Tooltip
          id={`${index}-tooltip`}
          content={`${products}`}
          place={"top"}
        />
        <div data-tooltip-id={`${index}-tooltip`} className="truncate w-[310px] text-left hover:cursor-pointer">
          {products}
        </div>
      </>)
    },
  ];

  useEffect(() => {
    getTransaction()
  }, []);

  const getTransaction = async () => {
    setLoadingTable(true)
    try {
      const { data } = await axios.get("/api/transaction");
      setDatas(data)
      setLoadingTable(false)
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  }

  const handleChangeFIle = (event: any) => {
    setError("")
    if (!some(excelType, item => [event.target.files[0].type].includes(item))) {
      setError("hanya dapat mengunggah file XLS, XLSX")
      return
    }
    setFiles(event.target.files[0])
  };

  const handleRemoveFIle = () => {
    const file: any = document.querySelector('#file-upload')
    file.value = null
    setError("")
    setFiles(null)
  };

  const onSubmit = () => {
    if (!files) {
      setError("File harus di isi")
      return
    }
    setLoading(true)
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer: any = this.result,
        array: any = new Uint8Array(arrayBuffer),
        binaryString = String.fromCharCode.apply(null, array),
        workbook: any = XLSX.read(binaryString, { type: "binary" }),
        first_sheet_name = workbook.SheetNames[0],
        worksheet = workbook.Sheets[first_sheet_name],
        data = XLSX.utils.sheet_to_json(worksheet, { raw: false }),
        dataset = data.map((o: any) => [o.order_id, o.date, o.products])
      onSave(dataset)
    }
    reader.readAsArrayBuffer(files);
  };

  const onSave = async (dataset: any) => {
    if (!isEmpty(dataset)) {
      try {
        await axios.post("/api/upload", dataset)
        await handleRemoveFIle()
        await getTransaction()
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        setError(error.response.data.message);
      }
    }
  };

  const onDelete = async () => {
    setLoading(true)
    try {
      await axios.delete("/api/transaction")
      await getTransaction()
      setLoading(false)
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false)
    }
  };

  return (
    <div className="grid grid-cols-3 gap-11">
      <div className="col-span-1">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Unggah Transaksi
            </h3>
          </div>
          <div className="space-y-6">
            <UploadFile
              onChange={handleChangeFIle}
              disabled={!isEmpty(datas)}
              loading={loading}
              error={error}
            />
            {files && <div className="flex p-4 text-sm text-[#3699FF] bg-[#ECF8FF] rounded-md">
              <div className="text-sm font-medium">
                {files?.name}
              </div>
              <button onClick={handleRemoveFIle} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-md focus:outline-none p-1.5 inline-flex h-8 w-8">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>}
            {!isEmpty(datas) && <div className="p-4 text-sm text-[#F64E60] rounded-md bg-[#FFF5F8]">
              <span className="font-medium">Hapus Transaksi</span> untuk melakukan unggah transaksi.
            </div>}
            <div className="pt-4">
              <Button
                title={!isEmpty(datas) ? "Hapus Transaksi" : "Upload"}
                color={!isEmpty(datas) ? "danger" : "primary"}
                onClick={!isEmpty(datas) ? onDelete : onSubmit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex flex-col">
            <h3 className="mb-1.5 text-xl text-[#464E5F] font-semibold uppercase">
              Transaksi
            </h3>
            <p className="text-gray-400">
              Total {datas.length}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="border border-[#BDBDBD] rounded-lg">
              <Table
                data={datas}
                headers={header}
                loading={loadingTable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Upload.getLayout = (page: any) => <Layout>{page}</Layout>;