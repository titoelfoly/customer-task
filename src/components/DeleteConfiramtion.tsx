import * as AlertDialog from "@radix-ui/react-alert-dialog";
import React from "react";

interface DeleteConfirmationAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  customerName: string;
}

const DeleteConfirmationAlert: React.FC<DeleteConfirmationAlertProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  customerName,
}) => {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <AlertDialog.Title className="text-lg font-semibold text-gray-800">
            Delete Confirmation
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            Are you sure you want to delete <strong>{customerName}</strong>?
            This action cannot be undone.
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 text-white bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={onConfirm}
              >
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteConfirmationAlert;
