import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ModalProps {
  open: boolean;
  onCancel: () => void;
  children: React.ReactNode;

}

export function Modal({
  children,
  open,
  onCancel,
}: ModalProps): React.ReactElement {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onCancel}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-[#464E5F] font-semibold uppercase mt-4"
                    >
                      Hapus Transaksi
                    </Dialog.Title>
                    <div className="mt-1.5 mb-6">
                      <div className="text-gray-400">Pilih tanggal untuk <span className="font-medium">Hapus Transaksi</span></div>
                    </div>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
