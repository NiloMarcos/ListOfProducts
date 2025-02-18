
interface ModalProps {
  handleCloseModal: () => void;
}

export function ModalConfirmOrder({ handleCloseModal }: ModalProps) {
  const handleStartNewOrder = () => {
    localStorage.clear();

    window.location.reload();

    handleCloseModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <h1 className="text-xl font-semibold mb-4">Order confirmation</h1>
        <p className="text-gray-600 mb-6">
          We can confirm your order and begin preparing for shipping?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleCloseModal()}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleStartNewOrder}
            className="bg-[#C73A0F] text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
}
