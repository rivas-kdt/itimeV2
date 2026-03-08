// "use client";

// import dynamic from "next/dynamic";
// // import { ProtectedRoute } from "@/components/ProtectedRoute";

// const CameraOcr = dynamic(() => import("@/features/scanner/components/ocrCard"), {
//   ssr: false,
// });

// export default function Page() {
//   return (
//     <div className="flex flex-col bg-background min-h-screen text-black">
//       <div className="flex justify-center items-center px-3 pt-6.5 pb-4.5 w-full shadow-lg bg-white">
//         <h3> Scanner</h3>
//       </div>

//       <div className="flex w-full flex-1 overflow-hidden">
//         <CameraOcr />
//       </div>
//     </div>
//   );
// }

"use client";

import dynamic from "next/dynamic";
// import { ProtectedRoute } from "@/components/ProtectedRoute";

// const CameraOcr = dynamic(() => import("@/components/ocrCard"), {
//   ssr: false,
// });
const EasyOcr = dynamic(() => import("@/components/EasyOcr"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex flex-col bg-background h-screen text-black overflow-hidden">
      <div className="flex justify-center items-center px-3 pt-6.5 pb-4.5 w-full shadow-lg bg-white">
        <h3> Scanner</h3>
      </div>

      <div className="flex-1 min-h-0">
        {/* <CameraOcr /> */}
        <EasyOcr />
      </div>
    </div>
  );
}
