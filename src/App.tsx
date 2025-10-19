import { Outlet, NavLink, useNavigation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App(){
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      {busy && <div className="sticky top-0 z-50 h-1 bg-accent animate-pulse" />}
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
}
