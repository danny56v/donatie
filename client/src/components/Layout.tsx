import Home from "../pages/Home";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header>
        <Home />
      </Header>
    </>
  );
}

// export default function Layout() {
//   return (
//     <div>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// }
