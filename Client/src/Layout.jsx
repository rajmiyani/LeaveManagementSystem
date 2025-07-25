// import React, { useState } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";

// const Layout = ({ children }) => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//     return (
//         <>
//             <Header toggleSidebar={toggleSidebar} />
//             <div className="d-flex">
//                 <Sidebar isOpen={isSidebarOpen} />
//                 <main
//                     className="p-4"
//                     style={{
//                         marginLeft: "220px",
//                         width: "100%",
//                         minHeight: "100vh",
//                         background: "#f8f9fa",
//                     }}
//                 >
//                     {children}
//                 </main>
//             </div>
//         </>
//     );
// };

// export default Layout;
