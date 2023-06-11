import Layout from '@/layouts';
import { Button, Table } from '@/components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import moment from 'moment';

const headerSupport = [
  {
    fieldId: 'index',
    label: 'No'
  },
  {
    fieldId: 'support',
    label: 'Support'
  },
  {
    fieldId: 'itemset',
    label: 'Itemset'
  },
  {
    fieldId: 'candidate',
    label: 'Candidate'
  },
];

const headerConfidence = [
  {
    fieldId: 'index',
    label: 'No'
  },
  {
    fieldId: 'rule',
    label: 'Rule'
  },
  {
    fieldId: 'confidence',
    label: 'Confidence'
  },
];

const headerLift = [
  {
    fieldId: 'index',
    label: 'No'
  },
  {
    fieldId: 'rule',
    label: 'Rule'
  },
  {
    fieldId: 'lift',
    label: 'Lift'
  },
  {
    fieldId: 'description',
    label: 'Description'
  },
];

export default function Dashboard() {
  const { query, push, back } = useRouter();
  const [data, setData] = useState<any>({
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
  const { id } = query;
  useEffect(() => {
    const getSummaryDetails: any = async () => {
      try {
        const { data } = await axios.get(`/api/process/${id}`);
        console.log(data);
        setData(data)

      } catch (error: any) {
        console.error(error.response.data.message);
      }
    }
    getSummaryDetails();
  }, []);

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
          Details Apriori
        </h3>
        <div className="flex items-center justify-between gap-4 ml-4">
          <Button
            title="Back"
            color="secondary"
            onClick={() => back()}
          />
          <Button
            title="Delete"
            color="danger"
            onClick={handleDelete}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-11">
        <div className="col-span-1">
          <div className="text-[#464E5F] bg-gray-50 py-9 px-8 rounded-xl space-y-3">
            <span className="text-lg font-semibold">Notes!</span>
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
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  Support
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {data?.summary?.min_support}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  Confidence
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {data?.summary?.min_confidence}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  Start Date
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {moment(data?.summary?.start_date).format('DD MMMM yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  End Date
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {moment(data?.summary?.end_date).format('DD MMMM yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  Total record
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {moment(data?.summary?.processed_date).format('DD MMMM yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-[#B5B5C3] font-semibold">
                  Process Date
                </div>
                <div className="text-lg text-[#464E5F] font-semibold">
                  {data?.summary?.total_order}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
              Lift Ratio
            </h3>
            <div className="flex flex-col max-h-[calc(100vh_-_38.5rem)]">
              <div className="overflow-x-auto overflow-y-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="overflow-hidden border border-[#BDBDBD] rounded-lg">
                    <Table data={data?.confidence} headers={headerLift} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-11">
        <div className="col-span-1">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
              Support
            </h3>
            <div className="flex flex-col max-h-[calc(100vh_-_20rem)]">
              <div className="overflow-x-auto overflow-y-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="overflow-hidden border border-[#BDBDBD] rounded-lg">
                    <Table data={data?.support} headers={headerSupport} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
            <h3 className="mb-6 text-xl text-[#464E5F] font-semibold uppercase">
              Confidence
            </h3>
            <div className="flex flex-col max-h-[calc(100vh_-_20rem)]">
              <div className="overflow-x-auto overflow-y-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="overflow-hidden border border-[#BDBDBD] rounded-lg">
                    <Table data={data?.confidence} headers={headerConfidence} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

Dashboard.getLayout = (page: any) => <Layout>{page}</Layout>;