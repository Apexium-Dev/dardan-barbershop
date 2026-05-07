// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React, { useState, useEffect } from 'react';
// import { AnimatePresence } from 'motion/react';

// // Firebase imports
// import { auth, db, OperationType, handleFirestoreError } from './lib/firebase';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   User as FirebaseUser,
//   GoogleAuthProvider,
//   signInWithPopup
// } from 'firebase/auth';
// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   onSnapshot,
//   collection,
//   addDoc,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
//   increment
// } from 'firebase/firestore';

// import { translations, Language } from './translations';
// import { SERVICES } from './constants';

// // Components
// import { LoadingScreen } from './components/LoadingScreen';
// import { Navbar } from './components/Navbar';
// import { HomeView } from './components/views/HomeView';
// import { AuthView } from './components/views/AuthView';
// import { BookingView } from './components/views/BookingView';
// import { LoyaltyView } from './components/views/LoyaltyView';
// import { AdminView } from './components/views/AdminView';

// export default function App() {
//   const [lang, setLang] = useState<Language>('en');
//   const t = translations[lang];

//   const [view, setView] = useState<'home' | 'loyalty' | 'booking' | 'auth' | 'admin'>('home');
//   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

//   // Auth State
//   const [user, setUser] = useState<FirebaseUser | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(false);

//   // Booking State
//   const [bookingStep, setBookingStep] = useState(1);
//   const [selectedService, setSelectedService] = useState<any>(null);
//   const [selectedBarber, setSelectedBarber] = useState<any>(null);
//   const [selectedTime, setSelectedTime] = useState<string | null>(null);
//   const [myBookings, setMyBookings] = useState<any[]>([]);
//   const [pendingBookings, setPendingBookings] = useState<any[]>([]); // For Admin
//   const [redemptionQR, setRedemptionQR] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       if (u) {
//         // Listen to user profile
//         const userRef = doc(db, 'users', u.uid);
//         const unsubUser = onSnapshot(userRef, (docSnap) => {
//           if (docSnap.exists()) {
//             setUserData(docSnap.data());
//           }
//         });

//         // Listen to my bookings
//         const bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('userId', '==', u.uid),
//           orderBy('createdAt', 'desc')
//         );
//         const unsubBookings = onSnapshot(bookingsQuery, (snap) => {
//           setMyBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//         });

//         return () => {
//           unsubUser();
//           unsubBookings();
//         };
//       } else {
//         setUserData(null);
//         setMyBookings([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Admin: Listen to all pending bookings
//   useEffect(() => {
//     if (userData?.isAdmin) {
//       const q = query(
//         collection(db, 'bookings'),
//         where('status', '==', 'pending'),
//         orderBy('createdAt', 'asc')
//       );
//       const unsub = onSnapshot(q, (snap) => {
//         setPendingBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       });
//       return () => unsub();
//     }
//   }, [userData?.isAdmin]);

//   if (loading) return <LoadingScreen />;

//   const startBooking = (service?: any) => {
//     if (!user) {
//       setAuthMode('login');
//       setView('auth');
//       return;
//     }
//     if (service) setSelectedService(service);
//     setView('booking');
//     setBookingStep(1);
//   };

//   const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setAuthLoading(true);
//     const formData = new FormData(e.currentTarget);
//     const email = (formData.get('email') as string).trim();
//     const password = formData.get('password') as string;
//     const name = formData.get('name') as string;

//     try {
//       if (authMode === 'register') {
//         const cred = await createUserWithEmailAndPassword(auth, email, password);
//         const isAdmin = email.toLowerCase() === "mahmutmft@gmail.com";
//         await setDoc(doc(db, 'users', cred.user.uid), {
//           uid: cred.user.uid,
//           name: name || 'Member',
//           email: email,
//           stampCount: 0,
//           isAdmin: isAdmin,
//           createdAt: serverTimestamp()
//         });
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//       setView('home');
//     } catch (error: any) {
//       console.error("Auth error:", error);
//       let msg = error.message;
//       if (error.code === 'auth/operation-not-allowed') msg = "Email/Password login is not enabled. Use Google Account or check Firebase settings.";
//       if (error.code === 'auth/email-already-in-use') msg = "This email is already in our circle. Try signing in.";
//       if (error.code === 'auth/invalid-credential') msg = "The ritual credentials provided are incorrect.";
//       alert(msg);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const loginWithGoogle = async () => {
//     setAuthLoading(true);
//     try {
//       const provider = new GoogleAuthProvider();
//       const cred = await signInWithPopup(auth, provider);

//       const userRef = doc(db, 'users', cred.user.uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         const isAdmin = cred.user.email?.toLowerCase() === "mahmutmft@gmail.com";
//         await setDoc(userRef, {
//           uid: cred.user.uid,
//           name: cred.user.displayName || 'Member',
//           email: cred.user.email,
//           stampCount: 0,
//           isAdmin: isAdmin,
//           createdAt: serverTimestamp()
//         });
//       }
//       setView('home');
//     } catch (error: any) {
//       console.error("Google Auth error:", error);
//       alert(error.message);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const submitBooking = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !selectedService || !selectedTime) return;

//     try {
//       const bookingData = {
//         userId: user.uid,
//         userName: userData?.name || user.email,
//         serviceName: selectedService.name,
//         servicePrice: Number(selectedService.price),
//         barberName: selectedBarber?.name || (lang === 'en' ? 'Any' : lang === 'al' ? 'Çdo' : 'Било кој'),
//         time: selectedTime,
//         status: 'pending',
//         qrValue: `booking-${Math.random().toString(36).substr(2, 9)}`,
//         createdAt: serverTimestamp()
//       };

//       await addDoc(collection(db, 'bookings'), bookingData);
//       alert(t.ritualScheduled);
//       setView('home');
//     } catch (error) {
//       handleFirestoreError(error, OperationType.CREATE, 'bookings');
//     }
//   };

//   const completeBooking = async (bookingId: string, userId: string) => {
//     if (!userData?.isAdmin) return;
//     try {
//       const bookingRef = doc(db, 'bookings', bookingId);
//       const userRef = doc(db, 'users', userId);

//       await updateDoc(bookingRef, { status: 'completed' });
//       await updateDoc(userRef, { stampCount: increment(1) });

//       alert(t.bookingVerified);
//     } catch (error) {
//       handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
//     }
//   };

//   const handleRedemption = async (scannedUserId: string) => {
//     if (!userData?.isAdmin) return;
//     try {
//       const userRef = doc(db, 'users', scannedUserId);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists() && userSnap.data().stampCount >= 10) {
//         await updateDoc(userRef, { stampCount: increment(-10) });
//         alert(t.redemptionVerified);
//       } else {
//         alert(t.insufficientStamps);
//       }
//     } catch (error) {
//       handleFirestoreError(error, OperationType.UPDATE, `users/${scannedUserId}`);
//     }
//   };

//   return (
//     <div className="relative overflow-hidden">
//       <div className="grain-overlay fixed inset-0 z-50"></div>

//       <Navbar
//         lang={lang}
//         setLang={setLang}
//         setView={setView}
//         setAuthMode={setAuthMode}
//         user={user}
//         userData={userData}
//         t={t}
//         startBooking={() => startBooking()}
//       />

//       <AnimatePresence mode="wait">
//         {view === 'home' && (
//           <HomeView
//             key="home"
//             t={t}
//             startBooking={startBooking}
//             setView={setView}
//           />
//         )}
//         {view === 'loyalty' && (
//           <LoyaltyView
//             key="loyalty"
//             t={t}
//             userData={userData}
//             user={user}
//             myBookings={myBookings}
//             redemptionQR={redemptionQR}
//             setRedemptionQR={setRedemptionQR}
//             setView={setView}
//           />
//         )}
//         {view === 'booking' && (
//           <BookingView
//             key="booking"
//             t={t}
//             lang={lang}
//             bookingStep={bookingStep}
//             setBookingStep={setBookingStep}
//             selectedService={selectedService}
//             setSelectedService={setSelectedService}
//             selectedBarber={selectedBarber}
//             setSelectedBarber={setSelectedBarber}
//             selectedTime={selectedTime}
//             setSelectedTime={setSelectedTime}
//             userData={userData}
//             user={user}
//             submitBooking={submitBooking}
//             setView={setView}
//           />
//         )}
//         {view === 'auth' && (
//           <AuthView
//             key="auth"
//             t={t}
//             authMode={authMode}
//             setAuthMode={setAuthMode}
//             handleAuth={handleAuth}
//             loginWithGoogle={loginWithGoogle}
//             authLoading={authLoading}
//             setView={setView}
//           />
//         )}
//         {view === 'admin' && (
//           <AdminView
//             key="admin"
//             t={t}
//             lang={lang}
//             pendingBookings={pendingBookings}
//             handleRedemption={handleRedemption}
//             completeBooking={completeBooking}
//             setView={setView}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
