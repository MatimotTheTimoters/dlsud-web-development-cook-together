// import React, { useEffect, useState } from "react";
// // import Searchbar from "./Searchbar";

// const ScrollDownNav = ({ onSearch, query, onQueryChange }) => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (query && query.trim() !== "") {
//         setVisible(true);
//       } else if (window.scrollY > 200) {
//         setVisible(true);
//       } else {
//         setVisible(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [query]);

//   const handleClear = () => {
//     onQueryChange("");
//     onSearch("");
//   };

//   return (
//     <div
//       className="scroll-down-nav position-fixed top-0 start-0 w-100"
//       style={{
//         zIndex: 1050,
//         background: "rgba(255,255,255,0.95)",
//         boxShadow: visible ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
//         transform: visible ? "translateY(0)" : "translateY(-100%)",
//         opacity: visible ? 1 : 0,
//         pointerEvents: visible ? "auto" : "none",
//         transition: "transform 0.4s ease, opacity 0.4s ease",
//       }}
//     >
//       <div className="container-fluid d-flex justify-content-center p-2">
//         <div className="w-100 px-3" style={{ maxWidth: "800px", position: "relative" }}>
//           <Searchbar
//             value={query}
//             onSearch={onSearch}
//             onQueryChange={onQueryChange}
//           />
//           {query && (
//             <button
//               onClick={handleClear}
//               style={{
//                 position: "absolute",
//                 right: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//                 color: "#090808ff",
//               }}
//             >
//              ✕
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScrollDownNav;
