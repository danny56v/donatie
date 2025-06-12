import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "./catalyst/description-list";
import { Subheading } from "./catalyst/heading";
import { Avatar } from "./catalyst/avatar";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Divider } from "./catalyst/divider";
import { Heading } from "./catalyst/heading";
import { Link } from "./catalyst/link";
import { BanknotesIcon, CalendarIcon, ChevronLeftIcon, CreditCardIcon } from "@heroicons/react/16/solid";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "./catalyst/table";
import { ICategory, ISubcategory } from "../interfaces/Interfaces";
import Pages from "./Pages";
import { truncateText } from "../utils/truncateText";
import { DeleteUserDialog } from "./DeleteUserDialog";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: ICategory;
  subcategory: ISubcategory;
  createdAt: string;
  updatedAt: string;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  username?: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  productsId: IProduct[];
  isBlocked: boolean;
  blockedUntil?: Date;
}

export const UserView = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`/api/products/user-products/${id}/pagination`, {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      // console.log(res.data.products);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
      setLoadingProducts(false);
    };
    fetchProducts();
  }, [currentPage, id]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`/api/user/${id}`);

      setUser(res.data.user);
      console.log(res.data.user);
    } catch (err) {
      setError("Eroare la încărcarea utilizatorului.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(`/api/admin/user/${id}`);
      console.log("User șters:", res.data);
      // Poți redirecționa:
      navigate("/admin/users");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la ștergerea utilizatorului."
          : "A apărut o eroare neprevăzută.";
      setError(errorMessage);
    }
  };

  const handleBlockUser = async () => {
    try {
      const res = await axios.put(`/api/admin/block-user/${id}`);
      // console.log("User blocat:", res.data);
      fetchUser();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la blocarea utilizatorului."
          : "A apărut o eroare neprevăzută.";
      setError(errorMessage);
    }
  };

const handleUnblockUser = async () => {
  try {
    const res = await axios.put(`/api/admin/unblock/${id}`);
    // console.log("User deblocat:", res.data);
    fetchUser();
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response
        ? error.response.data.message || "A apărut o eroare la deblocarea utilizatorului."
        : "A apărut o eroare neprevăzută.";
    setError(errorMessage);
  }
};

  if (loading) return <div>Se încarcă...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Utilizatorul nu a fost găsit</div>;

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Users
        </Link>
      </div>
      <div className="mt-4 lg:mt-8">
        <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
          <Heading>User ID: {user._id}</Heading>
          <div className="flex gap-4">
          {user.isBlocked ? (
  <Button onClick={handleUnblockUser}>Deblochează</Button>
) : (
  <Button onClick={handleBlockUser}>Blochează</Button>
)}
            {/* <Button outline>Refund</Button> */}
            <Button color="red" onClick={() => setDialogOpen(true)}>
              Șterge utilizator
            </Button>
            <DeleteUserDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={handleDeleteUser} />
          </div>
        </div>
        <div className="isolate mt-2.5 flex flex-wrap justify-between gap-x-6 gap-y-4">
          {/* <div className="flex flex-wrap gap-x-10 gap-y-4 py-1.5">
            <span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white">
              <BanknotesIcon className="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" />
              <span>US{order.amount.usd}</span>
            </span>
            <span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white">
              <CreditCardIcon className="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" />
              <span className="inline-flex gap-3">
                {order.payment.card.type}{' '}
                <span>
                  <span aria-hidden="true">••••</span> {order.payment.card.number}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-3 text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white">
              <CalendarIcon className="size-4 shrink-0 fill-zinc-400 dark:fill-zinc-500" />
              <span>{order.date}</span>
            </span>
          </div> */}
          {/* <div className="flex gap-4">
            <RefundOrder outline amount={order.amount.usd}>
              Refund
            </RefundOrder>
            <Button>Resend Invoice</Button>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="mt-12 flex-1">
          <Subheading>Despre utilizator</Subheading>
          <Divider className="mt-4" />
          <DescriptionList>
            <DescriptionTerm>Nume</DescriptionTerm>
            <DescriptionDetails>{user.lastName}</DescriptionDetails>
            <DescriptionTerm>Prenume</DescriptionTerm>
            <DescriptionDetails>
              {/* <Link href={order.event.url} className="flex items-center gap-2">
              <Avatar src={order.event.thumbUrl} className="size-6" />
              <span>{order.event.name}</span>
            </Link> */}
              {user.firstName}
            </DescriptionDetails>
            <DescriptionTerm>Username</DescriptionTerm>
            <DescriptionDetails>{user.username}</DescriptionDetails>
            <DescriptionTerm>Email</DescriptionTerm>
            <DescriptionDetails>{user.email}</DescriptionDetails>
            <DescriptionTerm>Admin</DescriptionTerm>
            <DescriptionDetails>{user.isAdmin ? "Da" : "Nu"}</DescriptionDetails>
            {/* <DescriptionTerm>Net</DescriptionTerm>
          <DescriptionDetails>CA{order.amount.net}</DescriptionDetails> */}
          </DescriptionList>
        </div>
        <div className="flex-1 min-h-screen flex flex-col">
          <main className="flex-grow">
            <Table className="mt-12 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
              <TableHead>
                <TableRow>
                  {/* <TableHeader>ID</TableHeader> */}
                  <TableHeader>Data</TableHeader>
                  <TableHeader>Denumire</TableHeader>
                  <TableHeader>Descriere</TableHeader>
                  <TableHeader>Categorie</TableHeader>
                  <TableHeader>Subcategorie</TableHeader>
                  {/* <TableHeader className="text-right">Amount</TableHeader> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const formattedDate = new Date(product.createdAt).toLocaleString("ro-RO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  });

                  return (
                    <TableRow key={product._id} href={`/product/${product._id}`}>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell className="text-zinc-500">{product.name}</TableCell>
                      <TableCell>{truncateText(product.description, 33)}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>{product.subcategory.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {loadingProducts && <div>Se încarcă produsele...</div>}
            {loadingProducts && <div className="text-red-500">{error}</div>}
            {products.length === 0 && <div>Nu există produse</div>}
          </main>
          <Pages
            totalPages={totalPages}
            currentPage={currentPage}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </>
  );
};
