import { useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CustomerCreationDialog from "./AddCustomer";
import DeleteConfirmationAlert from "./DeleteConfiramtion";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";

export type Customer = {
  email: string;
  id: string;
  name: string;
  status: boolean;
  phone: string;
};

export interface CustomerCreation {
  email: string;
  name: string;
  status: boolean;
  phone: string;
}

export type CustomerUpdate = {
  email: string;
  name: string;
  status: boolean;
  phone: string;
  id: string;
};

const sortIcon = (
  columnId: string,
  sort: { column: string; direction: "asc" | "desc" | null },
) => {
  if (sort.column === columnId) {
    return sort.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  }
  return <FaSort />;
};

export default function CustomerTable({
  customers,
  onAddCustomer,
  onEditCustomer,
  onBulkyDelete,
  onDelete,
  onSort,
}: {
  customers: Customer[];
  onAddCustomer: (customer: CustomerCreation) => void;
  onEditCustomer: (customer: CustomerUpdate) => void;
  onBulkyDelete: (selectedCustomers: string[]) => void;
  onDelete: (id: string) => void;
  onSort: (type: string, direction: string) => void;
}) {
  const { data: session } = useSession();
  const contentRef = useRef<HTMLTableElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const columnHelper = createColumnHelper<Customer>();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string;
    id: string;
  }>();

  const [currentSort, setCurrentSort] = useState<boolean>(true);

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.email, {
      id: "email",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Email</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      header: () => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            onSort("name", currentSort ? "asc" : "desc");
            setCurrentSort(!currentSort);
          }}
        >
          Name
          <span className="ml-2">
            {sortIcon("name", {
              column: "name",
              direction: currentSort ? "asc" : "desc",
            })}
          </span>
        </div>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("phone", {
      header: () => <span>Phone</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (info.getValue() ? "Active" : "Inactive"),
      footer: (info) => info.column.id,
    }),
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id)
        ? prev.filter((customerId) => customerId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked, "event.target");
    if (event.target.checked) {
      setSelectedCustomers(
        table
          .getRowModel()
          .rows.map((row) => row.id)
          .filter((id): id is string => id !== undefined),
      );
      setAllSelected(true);
    } else {
      setSelectedCustomers([]);
      setAllSelected(false);
    }
  };

  const onDeleteConfirmation = () => {
    setIsDeleteOpen(false);
    setAllSelected(false);
    if (selectedCustomers.length > 0) {
      onBulkyDelete(selectedCustomers);
    } else {
      onDelete(selectedCustomer?.id || "");
    }
  };
  const onDeleteSingle = (id: string, name: string) => {
    setSelectedCustomer({ name, id });
    setIsDeleteOpen(true);
  };
  const handleMail = async () => {
    const content = contentRef.current;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("file", pdfBlob, "export.pdf");

    await fetch(`/api/mailer?email${session.user.email}`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="flex flex-col mt-10 gap-6">
      <div className="overflow-x-auto">
        <table
          ref={contentRef}
          className="min-w-full border-collapse table-auto border border-sky-50"
        >
          <thead>
            <tr>
              <th className="px-4 py-2 border border-sky-50 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border border-sky-50 text-left text-black font-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                )),
              )}
              {/* Action Column Header */}
              <th className="px-4 py-2 border border-sky-50 text-left text-black font-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-sky-50 ">
                <td className="px-4 py-2 border border-sky-50 text-left">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedCustomers.includes(row.id)}
                    onChange={() => handleSelectCustomer(row.id)}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border border-sky-50 text-left text-gray-500 font-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-2 border border-sky-50 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <CustomerCreationDialog
                      onSubmit={onAddCustomer}
                      onUpdate={onEditCustomer}
                      customer={customers.find(
                        (item) => item.id === row.original.id,
                      )}
                    />
                    <button
                      onClick={() =>
                        onDeleteSingle(row.original.id, row.original.name)
                      }
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-4">
        <CustomerCreationDialog
          onUpdate={onEditCustomer}
          onSubmit={onAddCustomer}
        />

        {customers.length > 0 && (
          <button
            onClick={() => reactToPrintFn()}
            className="w-[120px] bg-red-300 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Export
          </button>
        )}
        {customers.length > 0 && (
          <button
            onClick={() => handleMail()}
            className="w-[120px] bg-red-300 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Export send
          </button>
        )}
        {selectedCustomers.length >= 1 && (
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationAlert
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={onDeleteConfirmation}
        customerName={
          selectedCustomers.length > 0
            ? "Selected"
            : selectedCustomer?.name || ""
        }
      />
    </div>
  );
}
