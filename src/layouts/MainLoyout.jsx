import Header from "../components/Header.jsx";
import { SideBar } from "../components/SideBar.jsx";
import { Outlet } from "react-router-dom";
import '../index.css'
export function MainLoyout() {
  return (
    // <>
    //   <Header />
    //   <SideBar />
    //   <main>
    //     <Outlet />
    //   </main>
    // </>
    <div className="layout">
      <Header />

      <div className="layout-body">
        <SideBar />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
