"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@clerk/backend";
import { flatten, getValidKeys } from "../lib/utils";
import { DataTable } from "@/components/ui/data-table";
import Loader from "./ui/loader";
import { useKeyProvider } from "./key-provider";
import { useEffect } from "react";

interface GetUsersResponse {
  status: number;
  users?: User[];
  error?: string;
}

export default function UsersTable() {
  const { key } = useKeyProvider();
  const { data, isPending, error, refetch, isFetching } = useQuery<{
    users: User[];
    updateTime: string;
  }>({
    retry: (failureCount, error) => {
      const json = JSON.parse(error.message);
      if (failureCount >= 3 || (json.status && json.status == 401)) {
        return false;
      }
      return true;
    },
    queryKey: ["clerkUsers"],
    queryFn: async () => {
      const response = await fetch("/users", {
        cache: "force-cache",
        headers: {
          Authorization: `${Buffer.from(`${key}`).toString("base64")}`,
        },
      });
      const responseJSON = (await response.json()) as GetUsersResponse;
      if (responseJSON.status !== 200) {
        throw new Error(JSON.stringify(responseJSON));
      }
      return {
        users: responseJSON.users ?? [],
        updateTime: new Date().toLocaleString(),
      };
    },
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // first load state
  if (isPending)
    return (
      <div className='flex items-center justify-center gap-3 text-muted-foreground'>
        <Loader />
      </div>
    );

  // error state
  if (error) return <ErrorMessage message={error.message} />;

  // no data state
  if (!data)
    return <ErrorMessage message={`Unable to fetch data from Clerk.`} />;

  const flatClerkUsers = data.users.map((user) => flatten(user));

  const columnLabels = getValidKeys(flatClerkUsers);

  const tanstackColumns: ColumnDef<unknown>[] = [];
  for (const column of columnLabels) {
    tanstackColumns.push({
      id: column,
      accessorKey: column,
      header: column,
    });
  }

  const visibleColumns = columnLabels.reduce(
    (acc, column) => {
      acc[column] =
        column === "id" ||
        column === "username" ||
        column === "firstName" ||
        column === "lastName" ||
        column === "emailAddresses/0/emailAddress";
      return acc;
    },
    {} as Record<string, boolean>,
  );

  return (
    <DataTable
      columns={tanstackColumns}
      data={flatClerkUsers}
      initialColumnVisibility={visibleColumns}
      lastRefresh={data.updateTime}
      isLoading={isFetching}
      onRefreshClick={() => {
        refetch();
      }}
    />
  );
}

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center justify-center'>
      {JSON.parse(message) ? JSON.parse(message).error : message}
    </div>
  );
};
