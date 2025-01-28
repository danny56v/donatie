import Footer from "./Footer";
import Header from "./Header";

const Layout: React.FC = () => {
  return (<>
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <Header /> 
        {/* <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main> */}
      </div>
    </div>
      <Footer />
      </>
  );
};

export default Layout;