import classNames from 'classnames';

interface IButton {
  title: string;
  type?: "button" | "submit" | "reset" | undefined
  color: 'primary' | 'secondary' | 'success' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Button({
  type,
  title,
  color,
  onClick,
  loading,
  disabled,
  className,
}: IButton): React.ReactElement {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }

  const notClick = disabled || loading
  return (
    <button
      type={type}
      disabled={notClick}
      className={classNames(
        className,
        "w-full flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md font-medium focus:outline-none", {
        'text-white bg-[#3699FF] hover:bg-[#187DE4]': color === 'primary',
        'text-[#3F4254] bg-[#D6D6E0] hover:bg-[#B5B5C3]': color === 'secondary',
        'text-white bg-[#1BC5BD] hover:bg-[#0BB7AF]': color === 'success',
        'text-white bg-[#F64E60] hover:bg-[#EE2D41]': color === 'danger',
        'disabled:opacity-70 pointer-events-none': notClick,
      })}
      onClick={handleClick}
    >
      {loading && (
        <svg
          className="animate-spin mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {notClick ? 'Loading...' : title}
    </button>
  );
}
