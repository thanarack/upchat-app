type IButton = {
  isLoading: boolean;
  text: string;
  form?: string;
};

const Button: React.FC<IButton> = (props) => {
  return (
    <button
      form={props.form}
      className="btn btn-indigo"
      disabled={props.isLoading}
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

export default Button;
