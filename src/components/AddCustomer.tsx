import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { CustomerCreation, CustomerUpdate } from "./CustomerTable";
import { Resolver } from "react-hook-form";

interface CustomerCreationDialogProps {
  onSubmit: (customer: CustomerCreation) => void;
  onUpdate: (customer: CustomerUpdate) => void;
  customer?: CustomerUpdate;
}

const validationSchema: Yup.ObjectSchema<CustomerCreation> = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  status: Yup.boolean().required("Status is required"),
});

const CustomerCreationDialog = ({
  onSubmit,
  onUpdate,
  customer,
}: CustomerCreationDialogProps) => {
  const resolver: Resolver<CustomerCreation> = async (values) => {
    try {
      const validatedData = await validationSchema.validate(values, {
        abortEarly: false,
      });
      return { values: validatedData, errors: {} };
    } catch (validationError) {
      const errors = validationError.inner.reduce(
        (allErrors: any, currentError: any) => {
          allErrors[currentError.path] = {
            type: "validation",
            message: currentError.message,
          };
          return allErrors;
        },
        {},
      );

      return { values: {}, errors };
    }
  };
  const { control, handleSubmit, reset } = useForm<CustomerCreation>({
    resolver,
    defaultValues: customer
      ? customer
      : {
          name: "",
          email: "",
          phone: "",
          status: false,
        },
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (customer) {
      reset(customer);
    }
  }, [customer, reset]);

  const handleFormSubmit = (data: CustomerCreation) => {
    if (customer) {
      onUpdate({ ...data, id: customer.id });
    } else {
      onSubmit(data);
    }
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {customer ? (
          <button className="px-1 py-1 bg-sky-200 text-white rounded-md hover:bg-sky-500 transition duration-200">
            Edit
          </button>
        ) : (
          <button className="w-[120px] px-2 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-500 transition duration-200">
            Add
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4 text-gray-950">
            {customer ? "Edit Customer" : "Create New Customer"}
          </Dialog.Title>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      id="name"
                      type="text"
                      {...field}
                      className={`w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-950 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      id="email"
                      type="email"
                      {...field}
                      className={`w-full text-gray-950  px-3 py-2 border border-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-950 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      id="phone"
                      type="text"
                      {...field}
                      className={`w-full text-gray-950  px-3 py-2 border border-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      name="status"
                      className="text-sky-400 focus:ring-sky-400 focus:ring-opacity-50"
                    />
                  )}
                />
                <span className="text-gray-700 text-sm">Active</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-md hover:opacity-90 transition duration-200"
                  onClick={handleSubmit((data) => {
                    handleFormSubmit(data);
                  })}
                >
                  {customer ? "Update" : "Submit"}
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomerCreationDialog;
