import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '../types';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isFirebaseLive: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (
    emailOrProfile: string | Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>,
    password: string,
    profileData?: Partial<UserProfile>
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  quickLoginAsDemo: (role: UserRole) => void;
  demoLogin: (role: UserRole) => void;
}

const LOCAL_STORAGE_USER_KEY = 'staymate_auth_user';

// Pre-configured Demo Accounts
export const DEMO_STUDENT: UserProfile = {
  uid: 'user-stud-1',
  email: 'student@staymate.com',
  displayName: 'Aarav Gupta',
  role: 'tenant',
  phone: '+91 98765 43210',
  college: 'Delhi University (North Campus)',
  course: 'B.Tech CS 2nd Year',
  gender: 'male',
  preferredLocation: 'Hudson Lane / GTB Nagar',
  verificationStatus: 'verified',
  photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_OWNER: UserProfile = {
  uid: 'owner-1',
  email: 'owner@staymate.com',
  displayName: 'Rajesh Sharma',
  role: 'owner',
  phone: '+91 98112 34567',
  businessName: 'Stanza Living Hudson House',
  city: 'New Delhi',
  verificationStatus: 'verified',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    if (isFirebaseConfigured && auth && db) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser && db) {
          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setUser(userSnap.data() as UserProfile);
            } else {
              // Create default fallback profile in firestore
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || 'StayMate User',
                role: 'tenant',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              await setDoc(userDocRef, newProfile);
              setUser(newProfile);
            }
          } catch (err) {
            console.error('Error fetching Firestore user profile:', err);
            // Fallback from localStorage
            const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (cached) setUser(JSON.parse(cached));
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local demo mode
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, expectedRole?: UserRole) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && db) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          if (expectedRole && profile.role !== expectedRole) {
            throw new Error(`This account is registered as a ${profile.role}. Please log in via the ${profile.role} portal.`);
          }
          setUser(profile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        }
      } else {
        // Mock fallback check
        const storedUsersStr = localStorage.getItem('staymate_registered_users');
        const registeredUsers: (UserProfile & { password?: string })[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        
        const matched = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (matched) {
          if (expectedRole && matched.role !== expectedRole) {
            throw new Error(`This account is registered as a ${matched.role}. Please use the ${matched.role} login.`);
          }
          setUser(matched);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(matched));
        } else if (email === 'student@staymate.com' || (expectedRole === 'tenant' && email.includes('student'))) {
          setUser(DEMO_STUDENT);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEMO_STUDENT));
        } else if (email === 'owner@staymate.com' || (expectedRole === 'owner' && email.includes('owner'))) {
          setUser(DEMO_OWNER);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEMO_OWNER));
        } else {
          // Create instant session for requested email
          const simulatedUser: UserProfile = {
            uid: `user-${Date.now()}`,
            email,
            displayName: email.split('@')[0].replace('.', ' '),
            role: expectedRole || 'tenant',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(simulatedUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(simulatedUser));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    emailOrProfile: string | Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>,
    password: string,
    extraProfile?: Partial<UserProfile>
  ) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      let profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>;

      if (typeof emailOrProfile === 'string') {
        profileData = {
          email: emailOrProfile,
          displayName: extraProfile?.displayName || emailOrProfile.split('@')[0],
          role: extraProfile?.role || 'tenant',
          phone: extraProfile?.phone,
          college: extraProfile?.college,
          course: extraProfile?.course,
          businessName: extraProfile?.businessName,
          gender: extraProfile?.gender,
        };
      } else {
        profileData = emailOrProfile;
      }

      if (isFirebaseConfigured && auth && db) {
        const cred = await createUserWithEmailAndPassword(auth, profileData.email, password);
        const fullProfile: UserProfile = {
          ...profileData,
          uid: cred.user.uid,
          createdAt: now,
          updatedAt: now,
        };
        await setDoc(doc(db, 'users', cred.user.uid), fullProfile);
        setUser(fullProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
      } else {
        const uid = `user-${Date.now()}`;
        const fullProfile: UserProfile = {
          ...profileData,
          uid,
          createdAt: now,
          updatedAt: now,
        };
        
        // Save to mock users list
        const storedUsersStr = localStorage.getItem('staymate_registered_users');
        const registeredUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
        registeredUsers.push({ ...fullProfile, password });
        localStorage.setItem('staymate_registered_users', JSON.stringify(registeredUsers));

        setUser(fullProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fullProfile));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const now = new Date().toISOString();
    const updatedUser: UserProfile = {
      ...user,
      ...updates,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db && user.uid) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { ...updates, updatedAt: now });
      } catch (err) {
        console.error('Error updating profile in Firestore:', err);
      }
    }

    setUser(updatedUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Mock confirmation
      console.log(`Password reset link sent to ${email}`);
    }
  };

  const quickLoginAsDemo = (role: UserRole) => {
    const demoUser = role === 'tenant' ? DEMO_STUDENT : DEMO_OWNER;
    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isFirebaseLive: isFirebaseConfigured,
        login,
        signup,
        logout,
        updateProfile,
        updateUserProfile: updateProfile,
        resetPassword,
        quickLoginAsDemo,
        demoLogin: quickLoginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
