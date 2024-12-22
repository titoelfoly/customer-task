"use client";
import CustomerTable, {
  Customer,
  CustomerCreation,
  CustomerUpdate,
} from "@/components/CustomerTable";
import Header from "@/components/Header";
import SearchFilterBar from "@/components/SearchFilterBar";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentSort, setCurrentSort] = useState<{
    column: string;
    direction: string;
  }>();

  const [searchWord, setSearchWord] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const handleSearch = (query: string) => {
    setSearchWord(query);
  };

  const handleFilter = (status: string | null) => {
    console.log(status, "stastus");
    switch (status) {
      case "InActive":
        setStatusFilter(false);
        break;
      case "Active":
        setStatusFilter(true);
        break;
      default:
        setStatusFilter(null);
    }
  };

  const fetchCustomers = useCallback(async () => {
    try {
      let response;
      if (currentSort) {
        response = await fetch(
          `/api/customers?userId=${session?.user?.id}&search=${searchWord}&status=${statusFilter}&sortBy=${currentSort.column}&sortDirection=${currentSort.direction}`,
        );
      } else {
        response = await fetch(
          `/api/customers?userId=${session?.user?.id}&search=${searchWord}&status=${statusFilter}`,
        );
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }, [session?.user?.id, currentSort, statusFilter, searchWord]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCustomers();
    }
  }, [fetchCustomers, session?.user?.id]);

  const onAddCustomer = async (customer: CustomerCreation) => {
    try {
      await fetch(`/api/customers?userId=${session?.user?.id}`, {
        method: "POST",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
    fetchCustomers();
  };

  const onEditCustomer = async (customer: CustomerUpdate) => {
    try {
      await fetch(`/api/customers?userId=${session?.user?.id}`, {
        method: "PUT",
        body: JSON.stringify(customer),
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
    fetchCustomers();
  };

  const onBulkyDelete = async (selectedCustomers: string[]) => {
    try {
      await fetch(`/api/customers?userId=${session?.user?.id}`, {
        method: "DELETE",
        body: JSON.stringify(selectedCustomers),
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
    fetchCustomers();
  };

  const onDeleteCustomer = async (id: string) => {
    try {
      await fetch(`/api/customers?id=${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
    fetchCustomers();
  };

  const onSort = (name: string, direction: string) => {
    setCurrentSort({ column: name, direction });
  };

  return (
    <>
      <div className="flex flex-col">
        <Header session={session} />
        <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />
        <div className="w-[90%] m-auto">
          <CustomerTable
            customers={customers}
            onDelete={onDeleteCustomer}
            onEditCustomer={onEditCustomer}
            onAddCustomer={onAddCustomer}
            onBulkyDelete={onBulkyDelete}
            onSort={onSort}
          />
        </div>
      </div>
    </>
  );
}
