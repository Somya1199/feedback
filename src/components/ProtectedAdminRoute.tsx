// // import { useEffect } from 'react';
// // import { useAuth } from '@/hooks/useAuth';

// // export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
// //   const { checkAccess, isLoading } = useAuth();

// //   useEffect(() => {
// //     if (!isLoading) {
// //       checkAccess();
// //     }
// //   }, [checkAccess, isLoading]);

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
// //           <p>Verifying access...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return <>{children}</>;
// // }


// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';

// export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
//   const { isLoading, isAdmin } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && !isAdmin) {
//       // Redirect to home if not admin
//       navigate('/', { replace: true });
//     }
//   }, [isLoading, isAdmin, navigate]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>Verifying access...</p>
//         </div>
//       </div>
//     );
//   }

//   // Only render children if user is admin
//   return isAdmin ? <>{children}</> : null;
// }

// // Make sure to export it as a named export
// export default ProtectedAdminRoute; // You can also use default export





import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // Redirect to home if not admin
      navigate('/', { replace: true });
    }
  }, [isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is admin
  return isAdmin ? <>{children}</> : null;
};

export default ProtectedAdminRoute;