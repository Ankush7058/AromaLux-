const steps = ["Processing", "Shipped", "Delivered"];

const OrderTimeline = ({ status }) => {
  const currentStep = steps.indexOf(status);

  if (status === "Cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
            ×
          </div>
          <div>
            <h3 className="font-extrabold text-red-600">Order Cancelled</h3>
            <p className="text-sm text-red-500">
              This order has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] rounded-3xl p-6 mt-6 border border-black/5">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold z-10 shadow ${
                index <= currentStep
                  ? "bg-[#c9a24d] text-black"
                  : "bg-white text-gray-400 border"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>

            <p
              className={`mt-3 text-sm font-bold ${
                index <= currentStep ? "text-black" : "text-gray-400"
              }`}
            >
              {step}
            </p>

            {index !== steps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 w-full h-1 ${
                  index < currentStep ? "bg-[#c9a24d]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;