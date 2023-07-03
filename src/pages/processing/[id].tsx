import Layout from '@/layouts';
import { Button, Table } from '@/components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import moment from 'moment';
import { twoDecimalPlacesWithoutRound } from '@/functions';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';

export default function Dashboard() {
  const { query, push, back } = useRouter();
  const { id } = query;

  const [datas, setDatas] = useState<any>({
    confidence: [],
    support: [],
    summary: {
      min_support: "",
      min_confidence: "",
      start_date: "",
      end_date: "",
      processed_date: "",
      total_order: "",
    }
  });

  const headerSupport = [
    {
      fieldId: 'index',
      label: 'No',
      width: 60
    },
    {
      fieldId: 'candidate',
      label: 'Candidate',
      renderItem: (candidate: string, index: number) => (<>
        <Tooltip
          id={`${index}-support-tooltip-1`}
          content={`${candidate}`}
          place={"top"}
        />
        <div data-tooltip-id={`${index}-support-tooltip-1`} className="truncate w-[235px] text-left hover:cursor-pointer">
          {candidate}
        </div>
      </>)
    },
    {
      fieldId: 'itemset',
      label: 'Itemset',
      width: 80
    },
    {
      fieldId: 'support',
      label: 'Support',
      renderItem: (support: number) => (<>
        {twoDecimalPlacesWithoutRound(support)}%
      </>),
      width: 80,
    },
  ];

  const headerConfidence = [
    {
      fieldId: 'index',
      label: 'No',
      width: 60
    },
    {
      fieldId: 'rule',
      label: 'Rule',
      renderItem: (rule: string, index: number) => (<>
        <Tooltip
          id={`${index}-confidence-tooltip-1`}
          content={`${rule}`}
          place={"top"}
        />
        <div data-tooltip-id={`${index}-confidence-tooltip-1`} className="truncate w-[315px] text-left hover:cursor-pointer">
          {rule}
        </div>
      </>)
    },
    {
      fieldId: 'confidence',
      label: 'Confidence',
      renderItem: (confidence: number) => (<>
        {twoDecimalPlacesWithoutRound(confidence * 100)}%
      </>),
      width: 80
    },
  ];

  const headerLiftRatio = [
    {
      fieldId: 'index',
      label: 'No',
      width: 60
    },
    {
      fieldId: 'rule',
      label: 'Rule',
      renderItem: (rule: string, index: number) => (<>
        <Tooltip
          id={`${index}-rule-tooltip-1`}
          content={`${rule}`}
          place={"top"}
        />
        <div data-tooltip-id={`${index}-rule-tooltip-1`} className="truncate w-[398px] text-left hover:cursor-pointer">
          {rule}
        </div>
      </>)
    },
    {
      fieldId: 'lift',
      label: 'Lift',
      width: 80
    },
    {
      fieldId: 'description',
      label: 'Description',
      renderItem: (description: string) => (
        <span
          className={classNames(
            description === 'POSITIVE'
              ? 'bg-[#DCFCE4] text-[#27A590]'
              : description === 'NEGATIVE'
                ? 'bg-[#FFEBEB] text-[#BB1616]'
                : 'bg-[#E9E9E9] text-[#7C7C7C]',
            'inline-flex items-center rounded px-2 py-1 text-xs'
          )}
        >
          {description}
        </span>
      ),
      width: 110
    },
  ];

  useEffect(() => {
    const getSummaryDetails: any = async () => {
      try {
        const { data } = await axios.get(`/api/process/${id}`);
        setDatas(data)
      } catch (error: any) {
        console.error(error.response.data.message);
      }
    }
    getSummaryDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/process/${id}`);
      push("/");
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="grid gap-11">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-3xl text-[#464E5F] font-semibold">
          Detail Apriori
        </h3>
        <div className="flex items-center justify-between gap-4 ml-4">
          <Button
            title="Kembali"
            color="secondary"
            onClick={() => back()}
          />
          <Button
            title="Hapus"
            color="danger"
            onClick={handleDelete}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-11">
        <div className="col-span-1">
          <div className="text-[#464E5F] bg-gray-50 py-9 px-8 rounded-xl space-y-3">
            <span className="text-lg font-semibold">Catatan!</span>
            <div className="space-y-1.5">
              <span className="font-medium">Positive Correlation</span>
              <div>Jika lift ratio lebih besar dari 1, itu menunjukkan bahwa hubungan antara item atau variabel yang dianalisis lebih sering terjadi daripada kejadian acak secara umum. Menunjukkan bahwa ada keterkaitan yang positif dan signifikan antara item-item tersebut.</div>
            </div>
            <div className="space-y-1.5">
              <span className="font-medium">Negative Correlation</span>
              <div>Jika lift ratio kurang dari 1, itu menunjukkan bahwa hubungan antara item atau variabel yang dianalisis kurang sering terjadi dibandingkan dengan kejadian acak secara umum. Menunjukkan bahwa ada keterkaitan yang negatif atau tidak signifikan antara item-item tersebut.</div>
            </div>
            <div className="space-y-1.5">
              <span className="font-medium">Independent Correlation</span>
              <div>Jika lift ratio sama dengan 1, itu menunjukkan bahwa hubungan antara item atau variabel yang dianalisis memiliki tingkat kejadian yang sama dengan kejadian acak secara umum. Menunjukkan bahwa tidak ada hubungan khusus antara item-item tersebut.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-11">
        <div className="col-span-1">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <div className="flex flex-col items-start justify-between gap-4">
              <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
                Information
              </h3>
              <div className="space-y-1">
                <div className="text-gray-400">
                  Support
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {datas?.summary?.min_support}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">
                  Confidence
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {datas?.summary?.min_confidence}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">
                  Start Date
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {datas?.summary?.end_date ? moment(datas?.summary?.start_date).format('DD-MM-yyyy') : "Semua Tanggal"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">
                  End Date
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {datas?.summary?.end_date ? moment(datas?.summary?.end_date).format('DD-MM-yyyy') : "Semua Tanggal"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">
                  Total record
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {moment(datas?.summary?.processed_date).format('DD-MM-yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">
                  Process Date
                </div>
                <div className="text-lg text-gray-500 font-semibold">
                  {datas?.summary?.total_order}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <div className="mb-6 flex flex-col">
              <h3 className="mb-1.5 text-xl text-[#464E5F] font-semibold uppercase">
                Lift Ratio
              </h3>
              <p className="text-gray-400">
                Total {datas?.confidence.length}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border border-[#BDBDBD] rounded-lg">
                <Table
                  data={datas?.confidence}
                  headers={headerLiftRatio}
                  truncate={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-11">
        <div className="col-span-1">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <div className="mb-6 flex flex-col">
              <h3 className="mb-1.5 text-xl text-[#464E5F] font-semibold uppercase">
                Support
              </h3>
              <p className="text-gray-400">
                Total {datas?.support.length}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border border-[#BDBDBD] rounded-lg">
                <Table
                  data={datas?.support}
                  headers={headerSupport}
                  truncate={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <div className="mb-6 flex flex-col">
              <h3 className="mb-1.5 text-xl text-[#464E5F] font-semibold uppercase">
                Confidence
              </h3>
              <p className="text-gray-400">
                Total {datas?.confidence.length}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border border-[#BDBDBD] rounded-lg">
                <Table
                  data={datas?.confidence}
                  headers={headerConfidence}
                  truncate={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

Dashboard.getLayout = (page: any) => <Layout>{page}</Layout>;