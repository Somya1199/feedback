// // import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // interface AuthContextType {
// //   userEmail: string | null;
// //   isAdmin: boolean;
// //   isLoading: boolean;
// //   checkAccess: () => boolean;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // Allowed admin emails
// // const ALLOWED_ADMINS = ['somya@highspring.in', 'srath@google.com'];

// // export function AuthProvider({ children }: { children: ReactNode }) {
// //   const [userEmail, setUserEmail] = useState<string | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     // In a real app, you'd get this from your auth provider (Google OAuth, etc.)
// //     // For now, we'll simulate auto-detection
// //     const detectEmail = async () => {
// //       try {
// //         // Try to get email from browser storage or auth system
// //         // This is a placeholder - implement based on your auth system
// //         const storedEmail = localStorage.getItem('userEmail');
        
// //         if (storedEmail) {
// //           setUserEmail(storedEmail);
// //         } else {
// //           // In production, you would:
// //           // 1. Check for Google OAuth token
// //           // 2. Get email from your authentication provider
// //           // 3. Redirect to login if not authenticated
          
// //           // For demo, we'll use a mock
// //           // setUserEmail('user@example.com'); // Uncomment for testing
// //         }
// //       } catch (error) {
// //         console.error('Error detecting email:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     detectEmail();
// //   }, []);

// //   const isAdmin = userEmail ? ALLOWED_ADMINS.includes(userEmail.toLowerCase()) : false;

// //   const checkAccess = (): boolean => {
// //     if (isAdmin) {
// //       return true;
// //     } else {
// //       // Redirect non-admins away from admin pages
// //       navigate('/', { replace: true });
// //       return false;
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider value={{ userEmail, isAdmin, isLoading, checkAccess }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (context === undefined) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // }


// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface AuthContextType {
//   userEmail: string | null;
//   isAdmin: boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Allowed admin emails
// const ALLOWED_ADMINS = ['somya@highspring.in', 'srath@google.com'];

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const detectEmail = async () => {
//       try {
//         // Try to get email from localStorage (for demo purposes)
//         const storedEmail = localStorage.getItem('userEmail');
        
//         if (storedEmail) {
//           setUserEmail(storedEmail);
//         }
//         // For testing, you can uncomment one of these lines:
//         // const testEmail = 'somya@highspring.in'; // or 'srath@google.com'
//         // localStorage.setItem('userEmail', testEmail);
//         // setUserEmail(testEmail);
//       } catch (error) {
//         console.error('Error detecting email:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     detectEmail();
//   }, []);

//   const isAdmin = userEmail ? ALLOWED_ADMINS.includes(userEmail.toLowerCase()) : false;

//   return (
//     <AuthContext.Provider value={{ userEmail, isAdmin, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }



import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  userEmail: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  checkAccess: () => boolean; // Add this back
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Allowed admin emails
const ALLOWED_ADMINS = ['somya@highspring.in', 'srath@google.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectEmail = async () => {
      try {
        // Try to get email from localStorage (for demo purposes)
        const storedEmail = localStorage.getItem('userEmail');
        
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error detecting email:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectEmail();
  }, []);

  const isAdmin = userEmail ? ALLOWED_ADMINS.includes(userEmail.toLowerCase()) : false;

  // Add the checkAccess function back
  const checkAccess = (): boolean => {
    return isAdmin; // Simply returns whether user is admin
  };

  return (
    <AuthContext.Provider value={{ userEmail, isAdmin, isLoading, checkAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}