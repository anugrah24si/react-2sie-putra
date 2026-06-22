import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

const PAGE_INFO = {
    "/dashboard": { title: "Dashboard", breadcrumb: "Home / Dashboard" },
    "/orders": { title: "Orders", breadcrumb: "Home / Orders" },
    "/customers": { title: "Customers", breadcrumb: "Home / Customers" },
    "/products": { title: "Products", breadcrumb: "Home / Products" },
    "/notes": { title: "Notes", breadcrumb: "Home / Notes" },
    "/components": { title: "Components", breadcrumb: "Home / Components" },
    "/fiturxyz": { title: "Fitur XYZ", breadcrumb: "Home / Fitur XYZ" },
};

export default function MainLayout({ children }) {
    const location = useLocation();

    // Determine page info from path
    const basePath = "/" + (location.pathname.split("/")[1] || "dashboard");
    const currentPage = PAGE_INFO[basePath] || PAGE_INFO["/dashboard"];

    return (
        <div className="min-h-screen w-full bg-latar font-poppins text-teks">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                <Sidebar />

                <main className="min-w-0 flex-1 p-4 md:p-6 xl:p-8">
                    <Header />
                    <div className="mt-6 min-w-0 space-y-6">
                        <PageHeader
                            title={currentPage.title}
                            subtitle={currentPage.breadcrumb}
                        />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
