import classNames from 'classnames';

interface IButton {
  title: string;
  color: 'primary' | 'secondary' | 'success' | 'danger';
  type?: 'solid' | 'outline';
  icon?: JSX.Element;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function Button({
  type,
  title,
  color,
  onClick,
  disabled,
}: IButton): React.ReactElement {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      disabled={disabled}
      className={classNames(
        "w-full flex justify-center py-2.5 px-6 border border-transparent rounded-md font-medium focus:outline-none", {
        'text-white bg-[#3699FF] hover:bg-[#187DE4]': color === 'primary',
        'text-[#3F4254] bg-[#D6D6E0] hover:bg-[#B5B5C3]': color === 'secondary',
        'text-white bg-[#1BC5BD] hover:bg-[#0BB7AF]': color === 'success',
        'text-white bg-[#F64E60] hover:bg-[#EE2D41]': color === 'danger'
      })}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}
