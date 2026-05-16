const EmptyState = ({
  title = "No data found",
  message = "There is nothing to show right now.",
  buttonText,
  onClick,
}) => {
  return (
    <div className="bg-white p-12 rounded-2xl shadow text-center">
      <div className="text-6xl mb-4">🛍️</div>

      <h2 className="text-2xl font-bold mb-2">{title}</h2>

      <p className="text-gray-600 mb-6">{message}</p>

      {buttonText && (
        <button
          onClick={onClick}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;