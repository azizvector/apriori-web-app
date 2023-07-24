import { Button, UploadFile, Table, Modal, Date, Input, Dropdown } from '@/components';
import { useEffect, useState } from 'react';
import { isEmpty, some } from 'lodash';
import { Tooltip } from 'react-tooltip';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as XLSX from 'xlsx';
import Layout from '@/layouts';
import axios from 'axios';
import moment from 'moment';
import * as yup from "yup";

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

type FormData = yup.InferType<typeof schema>;
const schema = yup.object({
  start_date: yup.date().required("Tanggal Awal harus diisi").nullable(),
  end_date: yup.date().required("Tanggal Akhir harus diisi").nullable(),
  total_record: yup.number(),
}).required();

export default function Upload() {
  const [datas, setDatas] = useState<any[]>([]);
  const [files, setFiles] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(true);
  const [error, setError] = useState<string>('')
  const [count, setCount] = useState<any>(0);
  const { control, register, reset, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const start_date = watch("start_date");
    const end_date = watch("end_date");
    getTotalTransaction(start_date, end_date);
  }, [watch("start_date"), watch("end_date")]);

  const onDelete = async (fields: FormData) => {
    const startDate = fields.start_date ? moment(fields.start_date).toDate() : null
    const endDate = fields.end_date ? moment(fields.end_date).toDate() : null

    try {
      await axios.delete("/api/transaction", {
        params: {
          start_date: startDate ? moment(startDate).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD'),
          end_date: endDate ? moment(endDate).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')
        }
      })
      await getTransaction();
      await setModalOpen(false);
    } catch (error: any) {
    
    }
  };

  const getTotalTransaction = async (start_date: Date | null | undefined, end_date: Date | null | undefined) => {
    const startDate = start_date ? moment(start_date).toDate() : null
    const endDate = end_date ? moment(end_date).toDate() : null
    try {
      const { data } = await axios.get("/api/count/transaction", {
        params: {
          start_date: startDate ? moment(startDate).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD'),
          end_date: endDate ? moment(endDate).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')
        }
      });
      setCount(data.count)
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  }
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
        console.log("setLoading", );
        
        setError(`ID Transaksi ${error.response.data.message.split("'")[1]} sudah ada!`);
      }
    }
  };

  const onDeleteAll = async () => {
    setLoading(true)
    try {
      await axios.delete("/api/transaction/all")
      await getTransaction()
      setLoading(false)
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false)
    }
  };

  const showModal = () => {
    setModalOpen(true);
    reset()
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
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
              <div className="pt-4">
                <Button
                  title="Unggah"
                  color="primary"
                  onClick={onSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <div className="mb-6 flex flex-col">
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
                  Transaksi
                </h3>
                {!isEmpty(datas) && <div className="flex items-center justify-between gap-4 ml-4">
                  <Dropdown 
                    onDelete={showModal}
                    onDeleteAll={onDeleteAll}
                  />
                </div>}
              </div>
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
      <Modal open={modalOpen} onCancel={handleCancel}>
        <form className="space-y-6" onSubmit={handleSubmit(onDelete)} autoComplete="off">
          <Date
            label="Tanggal Mulai"
            placeholder="Tanggal Mulai"
            dateFormat="DD-MM-yyyy"
            timeFormat={false}
            name="start_date"
            control={control}
            error={errors.start_date?.message}
          />
          <Date
            label="Tanggal Akhir"
            placeholder="Tanggal Akhir"
            dateFormat="DD-MM-yyyy"
            timeFormat={false}
            name="end_date"
            control={control}
            error={errors.end_date?.message}
          />
          <Input
            label="Total Data"
            name='total_record'
            register={register}
            value={count}
            disabled={true}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              title="Batal"
              color="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              title="Hapus"
              color="danger"
              loading={isSubmitting}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

Upload.getLayout = (page: any) => <Layout>{page}</Layout>;