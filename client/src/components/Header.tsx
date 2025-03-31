import { Avatar } from "./catalyst/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./catalyst/dropdown";
import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from "./catalyst/navbar";
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from "./catalyst/sidebar";
import { StackedLayout } from "./catalyst/stacked-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { InboxIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import ThemeToggle from "./ThemeToggle";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import axios from "axios";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/slices/userSlice";
import { Button } from "./catalyst/button";

// interface HeaderProps {
// // children: React.ReactNode
// }
const navItems = [
  { label: "Acasă", url: "/" },
  { label: "Anunțurile mele", url: "/my-products" },
  { label: "Donații", url: "/donations" },
  // { label: "Broadcasts", url: "/broadcasts" },
  // { label: "Settings", url: "/settings" },
];

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/1">
        <Avatar slot="icon" src="/tailwind-logo.svg" />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/teams/2">
        <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  // const loading = useSelector((state: RootState) => state.user.loading);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/auth/checkAuth");
        dispatch(signInStart());
        if (res.data.isAuthenticated) {
          dispatch(signInSuccess(res.data.user));
        }
        dispatch(signInFailure(res.data.message));
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data.message || "A apărut o eroare la autentificare."
            : "A apărut o eroare neprevăzută.";
        dispatch(signInFailure(errorMessage));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.post("/api/auth/signout");
      // const res = await fetch("api/auth/signout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = await res.json();

      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "A apărut o eroare la autentificare."
          : "A apărut o eroare neprevăzută.";
      dispatch(signOutFailure(errorMessage));
    }
  };
  const handleSignIn = () => {
    navigate("/signin");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <StackedLayout
      navbar={
        <Navbar className="">
          {/* <Dropdown>
            <DropdownButton as={NavbarItem} className="max-lg:hidden">
              <Avatar src="/tailwind-logo.svg" />
              <NavbarLabel>Tailwind Labs</NavbarLabel>
              <ChevronDownIcon />
            </DropdownButton>
            <TeamDropdownMenu />
          </Dropdown> */}
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className=" flex flex-row w-full justify-center max-lg:hidden ">
            <div className="flex justify-center pl-36"></div>
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem>
              <ThemeToggle />
            </NavbarItem>
            {/* <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem> */}
            {isAuthenticated ? (
              <>
                <NavbarItem href="/inbox" aria-label="Inbox">
                  <InboxIcon />
                </NavbarItem>
                {location.pathname !== "/product/new" && (
                  <NavbarItem href="/product/new" aria-label="Create Post">
                    <PlusIcon />
                  </NavbarItem>
                )}
                <Dropdown>
                  <DropdownButton as={NavbarItem}>
                    <UserCircleIcon />
                  </DropdownButton>
                  <DropdownMenu className="min-w-64" anchor="bottom end">
                    <DropdownItem href="/my-profile">
                      <UserIcon />
                      <DropdownLabel>My profile</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/settings">
                      <Cog8ToothIcon />
                      <DropdownLabel>Settings</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/privacy-policy">
                      <ShieldCheckIcon />
                      <DropdownLabel>Privacy policy</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/share-feedback">
                      <LightBulbIcon />
                      <DropdownLabel>Share feedback</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={handleSignOut}>
                      <ArrowRightStartOnRectangleIcon />
                      <DropdownLabel>Sign out</DropdownLabel>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <>
                {location.pathname === "/signin" || location.pathname === "/signup" ? (
                  <></>
                ) : (
                  <Button onClick={handleSignIn} >Autentificare</Button>
                )}
              </>
            )}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5 ">
                <Avatar src="/tailwind-logo.svg" />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu />
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <main className=" p-4 ">
        <Outlet />
      </main>
    </StackedLayout>
  );
};

export default Header;

// // import {

// //   Disclosure,
// //   DisclosureButton,
// //   DisclosurePanel,
// //   Menu,
// //   MenuButton,
// //   MenuItem,
// //   MenuItems,
// // } from "@headlessui/react";
// // import { Bars3Icon, BellIcon, PlusCircleIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   signInFailure,
// //   signInStart,
// //   signInSuccess,
// //   signOutFailure,
// //   signOutStart,
// //   signOutSuccess,
// // } from "../redux/slices/userSlice";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { RootState } from "../redux/store";
// // import axios from "axios";
// // import { useEffect, useState } from "react";

// // const navigation = [
// //   { name: "Acasă", href: "/", current: false },
// //   // { name: "Anunțurile tale", href: "#", current: false },
// //   { name: "Despre noi", href: "#", current: false },
// //   { name: "fds", href: "#", current: false },
// // ];

// // function classNames(...classes) {
// //   return classes.filter(Boolean).join(" ");
// // }

// // export default function Header() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
// //   // const loading = useSelector((state: RootState) => state.user.loading);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await axios.get("/api/auth/checkAuth");
// //         dispatch(signInStart());
// //         if (res.data.isAuthenticated) {
// //           dispatch(signInSuccess(res.data.user));
// //         }
// //         dispatch(signInFailure());
// //       } catch (error) {
// //         const errorMessage =
// //           axios.isAxiosError(error) && error.response
// //             ? error.response.data.message || "A apărut o eroare la autentificare."
// //             : "A apărut o eroare neprevăzută.";
// //         dispatch(signInFailure(errorMessage));
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     checkAuth();
// //   }, [dispatch]);

// //   const handleSignOut = async () => {
// //     try {
// //       dispatch(signOutStart());
// //       const res = await axios.post("/api/auth/signout");
// //       // const res = await fetch("api/auth/signout", {
// //       //   method: "POST",
// //       //   headers: {
// //       //     "Content-Type": "application/json",
// //       //   },
// //       // });
// //       // const data = await res.json();

// //       dispatch(signOutSuccess());
// //       navigate("/");
// //     } catch (error) {
// //       const errorMessage =
// //         axios.isAxiosError(error) && error.response
// //           ? error.response.data.message || "A apărut o eroare la autentificare."
// //           : "A apărut o eroare neprevăzută.";
// //       dispatch(signOutFailure(errorMessage));
// //     }
// //   };
// //   const handleSignIn = () => {
// //     navigate("/signin");
// //   };
// //   const handleSignUp = () => {
// //     navigate("/signup");
// //   };
// //   return (
// //     <Disclosure as="nav" className="bg-white">
// //       <div className="mx-auto max-w-9xl px-2 sm:px-6 lg:px-8">
// //         <div className="relative flex h-16 items-center justify-between">
// //           <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
// //             {/* Mobile menu button*/}
// //             <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
// //               <span className="absolute -inset-0.5" />
// //               <span className="sr-only">Open main menu</span>
// //               <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
// //               <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
// //             </DisclosureButton>
// //           </div>
// //           <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
// //             <div className="flex shrink-0 items-center">
// //               <img
// //                 alt="Your Company"
// //                 src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
// //                 className="h-8 w-auto"
// //               />
// //             </div>
// //             <div className="hidden sm:ml-6 sm:block">
// //               <div className="flex space-x-4">
// //                 {navigation.map((item) => (
// //                   <a
// //                     key={item.name}
// //                     href={item.href}
// //                     aria-current={location.pathname === item.href ? "page" : undefined}
// //                     className={classNames(
// //                       location.pathname === item.href
// //                         ? "bg-gray-900 text-white"
// //                         : "text-gray-900 hover:bg-gray-600 hover:text-white",
// //                       "rounded-md px-3 py-2 text-sm font-medium"
// //                     )}
// //                   >
// //                     {item.name}
// //                   </a>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
// //             {loading ? (
// //               <></>
// //             ) : (
// //               <>
// //                 {isAuthenticated ? (
// //                   <>
// //                     {location.pathname !== "/item" && (
// //                       <button
// //                         type="button"
// //                         className="relative rounded-full bg-white p-1 text-gray-900 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
// //                         onClick={() => navigate("/item")}
// //                       >
// //                         <span className="absolute -inset-1.5" />
// //                         <span className="sr-only">Add Item</span>
// //                         <PlusIcon aria-hidden="true" className="size-6" />
// //                       </button>
// //                     )}

// //                     <Menu as="div" className="relative ml-3">
// //                       <div>
// //                         <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
// //                           <span className="absolute -inset-1.5" />
// //                           <span className="sr-only">Open user menu</span>
// //                           <img
// //                             alt=""
// //                             src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
// //                             className="size-8 rounded-full"
// //                           />
// //                         </MenuButton>
// //                       </div>
// //                       <MenuItems
// //                         transition
// //                         className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
// //                       >
// //                         <MenuItem>
// //                           <a
// //                             href="#"
// //                             className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
// //                           >
// //                             Your Profile
// //                           </a>
// //                         </MenuItem>
// //                         <MenuItem>
// //                           <a
// //                             href="#"
// //                             className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
// //                           >
// //                             Settings
// //                           </a>
// //                         </MenuItem>
// //                         <MenuItem>
// //                           <a
// //                             href="#"
// //                             className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
// //                             onClick={handleSignOut}
// //                           >
// //                             Sign out
// //                           </a>
// //                         </MenuItem>
// //                       </MenuItems>
// //                     </Menu>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <span className="hidden md:block">
// //                       <button
// //                         type="button"
// //                         className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
// //                         onClick={handleSignUp}
// //                       >
// //                         Sign Up
// //                       </button>
// //                     </span>
// //                     <span className="">
// //                       <button
// //                         type="button"
// //                         className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800"
// //                         onClick={handleSignIn}
// //                       >
// //                         Sign In
// //                       </button>
// //                     </span>
// //                   </>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <DisclosurePanel className="sm:hidden">
// //         <div className="space-y-1 px-2 pb-3 pt-2">
// //           {navigation.map((item) => (
// //             <DisclosureButton
// //               key={item.name}
// //               as="a"
// //               href={item.href}
// //               aria-current={location.pathname === item.href ? "page" : undefined}
// //               className={classNames(
// //                 location.pathname === item.href
// //                   ? "bg-gray-900 text-white"
// //                   : "text-gray-300 hover:bg-gray-700 hover:text-white",
// //                 "block rounded-md px-3 py-2 text-base font-medium"
// //               )}
// //             >
// //               {item.name}
// //             </DisclosureButton>
// //           ))}
// //         </div>
// //       </DisclosurePanel>
// //     </Disclosure>
// //   );
// // }
