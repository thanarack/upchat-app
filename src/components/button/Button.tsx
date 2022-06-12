import classnames from 'classnames';

type IButton = {
  isLoading?: boolean;
  text: string;
  form?: string;
  size?: string;
  variant?: string;
  onClick?: () => any;
};

const Button: React.FC<IButton> = (props) => {
  return (
    <button
      className={classnames('btn', {
        'btn-indigo': props.variant === '',
        'btn-gray': props.variant === 'gray',
        'btn-sm': props.size === 'sm',
      })}
      form={props.form}
      disabled={props.isLoading}
      onClick={props.onClick}
    >
      {props.isLoading && (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
          กำลังโหลด...
        </>
      )}
      {props.text}
    </button>
  );
};

Button.defaultProps = {
  variant: '',
};

export default Button;
