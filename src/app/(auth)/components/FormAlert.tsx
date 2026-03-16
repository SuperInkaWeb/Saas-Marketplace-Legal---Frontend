interface FormAlertProps {
  message: string;
  help?: string | null;
  type?: "error" | "success";
}

export const FormAlert = ({ message, help, type = "error" }: FormAlertProps) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`flex bg-white items-center px-6 py-4 text-sm border-t-2 rounded-b shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${
        isError ? "border-red-500" : "border-green-500"
      }`}
    >
      {/* Icono */}
      <svg
        viewBox="0 0 24 24"
        className={`w-8 h-8 stroke-current fill-none shrink-0 ${
          isError ? "text-red-500" : "text-green-500"
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {isError ? (
          <path
            d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        )}
      </svg>

      <div className="ml-3">
        {/* Título Principal */}
        <div className="font-bold text-left text-gray-900">
          {message}
        </div>
        
        {/* Mensaje de Ayuda */}
        {help && (
          <div className="w-full text-gray-600 mt-1 leading-relaxed">
            {help}
          </div>
        )}
      </div>
    </div>
  );
};