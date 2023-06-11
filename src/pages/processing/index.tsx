import Layout from '@/layouts';
import { Input, Date, Table, Button } from '@/components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { calculateSupport, calculateSupportPercentage, generateAssociationRules, generateFrequentItemsets } from '@/functions';

export default function Dashboard() {
  const { push } = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [process, setProcess] = useState<any>({
    start_date: "",
    end_date: "",
    min_support: "",
    min_confidence: "",
    total_record: ""
  });

  const handleChange = ({ target: { name, value } }: any) => {
    setProcess({ ...process, [name]: value });
  }

  const header = [
    {
      fieldId: 'index',
      label: 'No'
    },
    {
      fieldId: 'processed_date',
      label: 'Process Date',
      renderItem: (processed_date: string) => (<>
        {moment(processed_date).format('DD-MM-yyyy hh:mm')}
      </>)
    },
    {
      fieldId: 'start_date',
      label: 'Start Date',
      renderItem: (start_date: string) => (<>
        {start_date ? moment(start_date).format('yyyy-MM-DD') : "All"}
      </>)
    },
    {
      fieldId: 'end_date',
      label: 'End Date',
      renderItem: (end_date: string) => (<>
        {end_date ? moment(end_date).format('yyyy-MM-DD') : "All"}
      </>)
    },
    {
      fieldId: 'min_support',
      label: 'Min Support',
      renderItem: (min_support: string) => (<>
        {min_support}%
      </>)
    },
    {
      fieldId: 'min_confidence',
      label: 'Min Confidence',
      renderItem: (min_confidence: string) => (<>
        {min_confidence}%
      </>)
    },
    {
      fieldId: 'total_order',
      label: 'Total Record'
    },
  ];

  const handleRowClick = (item: any) => {
    push(`/processing/${item.summary_id}`);
  };

  const getSummary = async () => {
    try {
      const { data } = await axios.get("/api/process");
      setData(data)
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  }

  useEffect(() => {
    getSummary();
  }, []);

  const handleSubmit = async () => {
    await handleCalculate();
    await getSummary();
  };


  const handleCalculate = async () => {
    const { start_date, end_date, min_support, min_confidence } = process

    // Get transaction
    const { data } = await axios.get("/api/transaction", {
      params: { start_date, end_date }
    })

    // Post summary
    const resSummary = await axios.post("/api/process", {
      start_date: start_date ? moment(start_date).format('yyyy-MM-DD') : null,
      end_date: start_date ? moment(end_date).format('yyyy-MM-DD') : null,
      min_support,
      min_confidence,
      total_order: data.length
    })

    const summary_id = resSummary.data.summary_id
    const dataset: any[] = []
    data.forEach((element: any) => {
      const splited = element.products.split(",")
      dataset.push(splited)
    });

    // Generate frequent itemsets
    const frequentItemsets = generateFrequentItemsets(dataset, min_support);

    // Output the result
    var supportList = []
    for (let itemset of frequentItemsets) {
      let support = calculateSupportPercentage(dataset, itemset);
      supportList.push({
        summary_id: summary_id,
        itemset: itemset.length,
        candidate: itemset.toString(),
        support: support
      })
    }

    // Post support
    await axios.post("/api/support", { supports: supportList })

    var ruleArray = []
    for (let itemset of frequentItemsets) {
      let rules = generateAssociationRules(dataset, itemset, frequentItemsets, min_confidence / 100);
      for (let rule of rules) {

        // Calculate support values
        const supportAB = calculateSupport(dataset, rule.antecedent.concat(rule.consequent)); // 3 (Occurrences of ['bread', 'milk'])
        const supportA = calculateSupport(dataset, rule.antecedent); // 5 (Occurrences of ['bread'])
        const supportB = calculateSupport(dataset, rule.consequent); // 4 (Occurrences of ['milk'])
        const N = dataset.length; // 6 (Total number of transactions)

        // Calculate lift ratio
        const liftRatio = (supportAB / N) / ((supportA / N) * (supportB / N));

        let description: string = ''
        if (liftRatio > 1) {
          description = 'POSITIVE';
        } else if (liftRatio < 1) {
          description = 'NEGATIVE';
        } else {
          description = 'INDEPENDENT';
        }

        ruleArray.push([summary_id, `${rule.antecedent.join(',')} -> ${rule.consequent.join(',')}`, rule.confidence, Math.round((liftRatio + Number.EPSILON) * 100) / 100, description])
      }
    }

    // Post rule
    await axios.post("/api/rule", { confidence: ruleArray })
  }

  return (
    <div className="grid grid-cols-3 gap-11">
      <div className="col-span-1">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Processing Apriori
            </h3>
          </div>
          <div className="space-y-6">
            <Date
              label="Start Date"
              dateFormat="DD-MM-YY"
              timeFormat={false}
              name="start_date"
              onChange={handleChange}
              value={process.start_date}
            />
            <Date
              label="End Date"
              dateFormat="DD-MM-YY"
              timeFormat={false}
              name="end_date"
              onChange={handleChange}
              value={process.end_date}
            />
            <Input
              label="Min Support"
              name="min_support"
              onChange={handleChange}
              value={process.min_support}
            />
            <Input
              label="Min Confidence"
              name="min_confidence"
              onChange={handleChange}
              value={process.min_confidence}
            />
            <Input
              label="Total Record"
              value="600"
              disabled={true}
            />
            <div className="pt-4">
              <Button
                title="Upload"
                color="primary"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex flex-col  gap-2">
            <h3 className="text-xl text-[#464E5F] font-semibold uppercase">
              Processing List
            </h3>
            <p className="text-sm text-[#B5B5C3]">
              Total Record {data.length}
            </p>
          </div>
          <div className="flex flex-col max-h-[calc(100vh_-_20rem)]">
            <div className="overflow-x-auto overflow-y-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="overflow-hidden border border-[#BDBDBD] rounded-lg">
                  <Table
                    data={data}
                    headers={header}
                    action={true}
                    onRowClick={handleRowClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = (page: any) => <Layout>{page}</Layout>;