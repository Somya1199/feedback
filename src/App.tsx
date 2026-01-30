// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import LandingPage from "./pages/LandingPage";
// // import FeedbackPage from "./pages/FeedbackPage";
// // import AdminPage from "./pages/AdminPage";
// // import NotFound from "./pages/NotFound";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/" element={<LandingPage />} />
// //           <Route path="/feedback" element={<FeedbackPage />} />
// //           <Route path="/admin" element={<AdminPage />} />
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import FeedbackPage from "./pages/FeedbackPage";
// import AdminPage from "./pages/AdminPage";
// import NotFound from "./pages/NotFound";
// import { AuthProvider } from '@/hooks/useAuth';
// import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'; // Add this import

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/feedback" element={<FeedbackPage />} />
//             <Route 
//               path="/admin" 
//               element={
//                 <ProtectedAdminRoute> {/* Wrap AdminPage with ProtectedAdminRoute */}
//                   <AdminPage />
//                 </ProtectedAdminRoute>
//               } 
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'; // Default import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter> {/* BrowserRouter wraps everything */}
        <AuthProvider> {/* AuthProvider is now inside BrowserRouter */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;