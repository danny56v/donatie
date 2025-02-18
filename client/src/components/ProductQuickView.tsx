import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { Divider } from "./catalyst/divider";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "./catalyst/dropdown";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { truncateText } from "../utils/truncateText";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export const ProductQuickView = (props) => {

  const user = useSelector((state: RootState) => state.user.currentUser);

  const navigate = useNavigate();
  const { _id, name, description, condition, category, subcategory, createdAt, index, image, updatedAt,owner } =
    props.product;

  return (
    <>
      <li>
        <Divider soft={index > 0} />
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row gap-6 py-6 ">
            <div className="w-32 shrink-0">
              <Link to={`/product/${_id}`} aria-hidden="true">
                <img className="aspect-[3/2] object-cover rounded-lg shadow" src={image} alt="" />
              </Link>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-6">
                <Link to={`/product/${_id}`} className="text-base/6 font-semibold dark:text-zinc-200 ">
                  {truncateText(name, 60)}
                </Link>
                <div className="text-xs/6 text-zinc-600">
                  {category?.name || "Categorie necunoscută"} / {subcategory?.name || "Subcategorie necunoscută"}
                </div>
              </div>
              <div className="text-sm text-zinc-500">{truncateText(description, 80)}</div>

              <div className=" text-zinc-600 text-xs/6 flex gap-2">
                {/* {event.date} at {event.time} <span aria-hidden="true">·</span> {event.location} */}
                <PencilIcon className="w-3" />
                {updatedAt
                  ? new Date(updatedAt).toLocaleString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* <Badge className="max-sm:hidden" color={event.status === "On Sale" ? "lime" : "zinc"}>
              {event.status}
            </Badge> */}
            <Dropdown>
              <DropdownButton plain aria-label="More options">
                <EllipsisVerticalIcon />
              </DropdownButton>
              <DropdownMenu anchor="bottom end">
                <DropdownItem onClick={() => navigate(`/product/${_id}`)}>View</DropdownItem>
                <DropdownItem>
                  {user &&
                    user._id === owner._id && ( // ✅ Afișăm butonul doar dacă utilizatorul este proprietarul
                      <Link to={`/product/edit/${_id}`} className="edit-button">
                         Editează
                      </Link>
                    )}
                </DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </li>
    </>
  );
};
