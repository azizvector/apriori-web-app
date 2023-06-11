import { DocumentTextIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames';

interface IOption {
  key: number;
  label: string;
}

interface IUploadFile {
  label?: string;
  name?: string;
  value?: IOption;
  placeholder?: string;
  options?: IOption[];
  onChange?: (event: string) => void;
  prefix?: string | React.ReactElement;
  disabled?: boolean;
  error?: string;
}

export function UploadFile({
  label,
  options,
  name,
  onChange,
  value,
  placeholder,
  disabled,
  error
}: IUploadFile): React.ReactElement {

  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <div className="mt-2 flex justify-center rounded-md border border-dashed border-[#E4E6EF] px-6 py-10">
      <div className="text-center">
        <DocumentTextIcon className="mx-auto h-14 w-14 text-gray-300" />
        <div className="mt-4 flex leading-6 text-[#201B1C]">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer font-medium text-[#187DE4]"
          >
            <span>Upload a file</span>
            <input id="file-upload" accept=".xlsx" name="file-upload" type="file" className="sr-only" onChange={handleChange}/>
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-sm leading-5 text-[#B5B5C3]">XLS, XLSX, CSV up to 10MB</p>
      </div>
    </div>
  );
}
