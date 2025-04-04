import { useEffect, useState } from "react";
import { Avatar } from "./catalyst/avatar";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./catalyst/table";
import axios from "axios";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/allusers");
        setUsers(res.data.users);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la confirmarea donației."
            : "A apărut o eroare neprevăzută.";
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Administrare utilizatori</Heading>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Data</TableHeader>
            <TableHeader>Nume Prenume</TableHeader>
            <TableHeader>Email</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} href={`/admin/user/${user._id}`} title={`Order #${user._id}`}>
              <TableCell>{user._id}</TableCell>
              <TableCell className="text-zinc-500">{user.createdAt}</TableCell>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>
                {/* <div className="flex items-center gap-2">
                  <Avatar src={user.event.thumbUrl} className="size-6" />
                  <span>{user.event.name}</span>
                </div> */}
                {user.email}
              </TableCell>
              {/* <TableCell className="text-right">US{user.amount.usd}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
