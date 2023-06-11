import Layout from '@/layouts';

const data: any[] = [];
for (let i = 0; i < 10; i += 1) {
  data.push({
    date: '22-03-2023',
    time: '18:00',
    products: 'Product 1, Product 2, Product 3, Product 4, Product 5, Product 6, Product 7, Product 8',
  });
}

const header = [
  {
    fieldId: 'index',
    label: 'No'
  },
  {
    fieldId: 'date',
    label: 'Date'
  },
  {
    fieldId: 'time',
    label: 'Time'
  },
  {
    fieldId: 'products',
    label: 'Products'
  },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-11">
      <div className="col-span-1">
        <div className="bg-white py-9 px-8 rounded-xl shadow-[0px_0px_20px_rgba(56,71,109,0.03)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl text-[#464E5F] font-semibold">
              Apriori
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = (page: any) => <Layout>{page}</Layout>;