import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { College, Enquiry, Favorite, Property, Review, VisitRequest, PropertyFilterState } from '../types';
import { INITIAL_COLLEGES, INITIAL_PROPERTIES, INITIAL_REVIEWS } from '../data/seedData';
import { db, isFirebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc
} from 'firebase/firestore';

export const DEFAULT_FILTER: PropertyFilterState = {
  searchQuery: '',
  collegeId: '',
  city: '',
  area: '',
  minRent: 3000,
  maxRent: 30000,
  propertyTypes: [],
  roomTypes: [],
  gender: 'all',
  maxDistanceKm: 10,
  amenities: [],
  foodIncludedOnly: false,
  acOnly: false,
  verifiedOnly: false,
  availableOnly: false,
  sortBy: 'nearest',
};

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  colleges: College[];
  reviews: Review[];
  favorites: string[]; // array of property IDs
  enquiries: Enquiry[];
  visitRequests: VisitRequest[];
  comparedPropertyIds: string[];
  filter: PropertyFilterState;
  setFilter: (filter: PropertyFilterState | ((prev: PropertyFilterState) => PropertyFilterState)) => void;
  resetFilter: () => void;
  loading: boolean;
  isLoading: boolean;
  
  // Property Actions
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoriteCount'>) => Promise<string>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  togglePublishProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  incrementViews: (id: string) => void;

  // Favorites
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;

  // Enquiries
  sendEnquiry: (data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], ownerResponse?: string) => Promise<void>;

  // Visit Requests
  requestVisit: (data: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateVisitStatus: (id: string, status: VisitRequest['status'], note?: string, rescheduledDate?: string, rescheduledTime?: string) => Promise<void>;

  // Reviews
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  getPropertyReviews: (propertyId: string) => Review[];
  getReviewsByProperty: (propertyId: string) => Review[];

  // Comparison
  addToCompare: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isCompared: (propertyId: string) => boolean;
  getComparedProperties: () => Property[];

  // College
  getCollegeById: (id: string) => College | undefined;
  addCollege: (collegeData: College) => Promise<void>;
}

const LOCAL_STORAGE_PROPS_KEY = 'staymate_properties';
const LOCAL_STORAGE_FAVS_KEY = 'staymate_favorites';
const LOCAL_STORAGE_ENQUIRIES_KEY = 'staymate_enquiries';
const LOCAL_STORAGE_VISITS_KEY = 'staymate_visits';
const LOCAL_STORAGE_REVIEWS_KEY = 'staymate_reviews';
const LOCAL_STORAGE_COLLEGES_KEY = 'staymate_colleges';

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<PropertyFilterState>(DEFAULT_FILTER);
  const [loading, setLoading] = useState(true);

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  // Initialize data from Firestore or LocalStorage
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        if (isFirebaseConfigured && db) {
          // Fetch from Firestore
          const propsSnap = await getDocs(collection(db, 'properties'));
          if (!propsSnap.empty) {
            const list: Property[] = [];
            propsSnap.forEach((d) => list.push({ ...d.data(), id: d.id } as Property));
            setProperties(list);
          } else {
            // Seed initial properties to Firestore
            for (const p of INITIAL_PROPERTIES) {
              await setDoc(doc(db, 'properties', p.id), p);
            }
            setProperties(INITIAL_PROPERTIES);
          }

          // Colleges
          const collegeSnap = await getDocs(collection(db, 'colleges'));
          if (!collegeSnap.empty) {
            const cList: College[] = [];
            collegeSnap.forEach((d) => cList.push({ ...d.data(), id: d.id } as College));
            setColleges(cList);
          } else {
            for (const c of INITIAL_COLLEGES) {
              await setDoc(doc(db, 'colleges', c.id), c);
            }
            setColleges(INITIAL_COLLEGES);
          }

          // Reviews
          const revSnap = await getDocs(collection(db, 'reviews'));
          if (!revSnap.empty) {
            const rList: Review[] = [];
            revSnap.forEach((d) => rList.push({ ...d.data(), id: d.id } as Review));
            setReviews(rList);
          } else {
            setReviews(INITIAL_REVIEWS);
          }
        } else {
          // LocalStorage fallback
          const savedProps = localStorage.getItem(LOCAL_STORAGE_PROPS_KEY);
          if (savedProps) {
            setProperties(JSON.parse(savedProps));
          } else {
            setProperties(INITIAL_PROPERTIES);
            localStorage.setItem(LOCAL_STORAGE_PROPS_KEY, JSON.stringify(INITIAL_PROPERTIES));
          }

          const savedColleges = localStorage.getItem(LOCAL_STORAGE_COLLEGES_KEY);
          if (savedColleges) {
            setColleges(JSON.parse(savedColleges));
          } else {
            setColleges(INITIAL_COLLEGES);
            localStorage.setItem(LOCAL_STORAGE_COLLEGES_KEY, JSON.stringify(INITIAL_COLLEGES));
          }

          const savedReviews = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
          if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
          } else {
            setReviews(INITIAL_REVIEWS);
            localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
          }

          const savedEnquiries = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
          if (savedEnquiries) {
            setEnquiries(JSON.parse(savedEnquiries));
          } else {
            // Seed initial enquiries
            const sampleEnquiries: Enquiry[] = [
              {
                id: 'enq-101',
                propertyId: 'pg-101',
                propertyName: 'Stanza Living - Hudson House',
                propertyImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
                propertyArea: 'Hudson Lane, GTB Nagar',
                ownerId: 'owner-1',
                tenantId: 'user-stud-1',
                tenantName: 'Aarav Gupta',
                tenantPhone: '+91 98765 43210',
                tenantEmail: 'student@staymate.com',
                message: 'Hello, looking for a double sharing room starting next semester from Sept 1st. Are meals included on weekends?',
                preferredMoveInDate: '2026-09-01',
                moveInDate: '2026-09-01',
                preferredRoomType: 'Twin Sharing AC Room',
                status: 'responded',
                ownerResponse: 'Yes Aarav! 3-time meals are provided all 7 days with special menu on Sundays. You can visit anytime.',
                createdAt: '2026-08-25T11:00:00Z',
                updatedAt: '2026-08-26T09:30:00Z'
              }
            ];
            setEnquiries(sampleEnquiries);
            localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(sampleEnquiries));
          }

          const savedVisits = localStorage.getItem(LOCAL_STORAGE_VISITS_KEY);
          if (savedVisits) {
            setVisitRequests(JSON.parse(savedVisits));
          } else {
            const sampleVisits: VisitRequest[] = [
              {
                id: 'vis-101',
                propertyId: 'pg-101',
                propertyName: 'Stanza Living - Hudson House',
                propertyImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
                propertyArea: 'Hudson Lane, GTB Nagar',
                ownerId: 'owner-1',
                tenantId: 'user-stud-1',
                tenantName: 'Aarav Gupta',
                tenantPhone: '+91 98765 43210',
                tenantEmail: 'student@staymate.com',
                date: '2026-09-02',
                preferredTime: 'afternoon',
                timeSlotDetail: '2:00 PM - 4:00 PM',
                message: 'Visiting with my parents to check room and mess hygiene.',
                notes: 'Visiting with my parents to check room and mess hygiene.',
                status: 'accepted',
                ownerNote: 'Confirmed. Warden Mr. Vinod will receive you at main reception.',
                createdAt: '2026-08-26T14:20:00Z',
                updatedAt: '2026-08-27T10:00:00Z'
              }
            ];
            setVisitRequests(sampleVisits);
            localStorage.setItem(LOCAL_STORAGE_VISITS_KEY, JSON.stringify(sampleVisits));
          }
        }
      } catch (err) {
        console.error('Error initializing property data:', err);
        setProperties(INITIAL_PROPERTIES);
        setColleges(INITIAL_COLLEGES);
        setReviews(INITIAL_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch user favorites, enquiries & visits whenever user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const loadUserData = async () => {
      if (isFirebaseConfigured && db) {
        try {
          // Favorites
          const favQuery = query(collection(db, 'favorites'), where('userId', '==', user.uid));
          const favSnap = await getDocs(favQuery);
          const favList: string[] = [];
          favSnap.forEach((d) => favList.push((d.data() as Favorite).propertyId));
          setFavorites(favList);

          // Enquiries
          const field = user.role === 'owner' ? 'ownerId' : 'tenantId';
          const enqQuery = query(collection(db, 'enquiries'), where(field, '==', user.uid));
          const enqSnap = await getDocs(enqQuery);
          const enqList: Enquiry[] = [];
          enqSnap.forEach((d) => enqList.push({ ...d.data(), id: d.id } as Enquiry));
          setEnquiries(enqList);

          // Visit Requests
          const visQuery = query(collection(db, 'visitRequests'), where(field, '==', user.uid));
          const visSnap = await getDocs(visQuery);
          const visList: VisitRequest[] = [];
          visSnap.forEach((d) => visList.push({ ...d.data(), id: d.id } as VisitRequest));
          setVisitRequests(visList);
        } catch (err) {
          console.error('Error loading user Firestore data:', err);
        }
      } else {
        // LocalStorage
        const userFavsKey = `${LOCAL_STORAGE_FAVS_KEY}_${user.uid}`;
        const savedFavs = localStorage.getItem(userFavsKey);
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        } else {
          // Default initial favorites for demo student
          if (user.role === 'tenant') {
            setFavorites(['pg-101', 'pg-102']);
            localStorage.setItem(userFavsKey, JSON.stringify(['pg-101', 'pg-102']));
          } else {
            setFavorites([]);
          }
        }
      }
    };

    loadUserData();
  }, [user]);

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = property.name.toLowerCase().includes(query);
        const matchesArea = property.area.toLowerCase().includes(query);
        const matchesCity = property.city.toLowerCase().includes(query);
        const matchesCollege = property.nearbyCollegeName.toLowerCase().includes(query);
        const matchesTagline = property.tagline?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesArea && !matchesCity && !matchesCollege && !matchesTagline) {
          return false;
        }
      }

      // College filter
      if (filter.collegeId) {
        const matchesCollege =
          property.nearbyCollegeId === filter.collegeId ||
          property.nearbyCollegeName.toLowerCase().includes(filter.collegeId.toLowerCase());
        if (!matchesCollege) return false;
      }

      // City filter
      if (filter.city && property.city.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }

      // Area filter
      if (filter.area && !property.area.toLowerCase().includes(filter.area.toLowerCase())) {
        return false;
      }

      // Rent range
      if (property.startingRent < filter.minRent || property.startingRent > filter.maxRent) {
        return false;
      }

      // Gender preference
      if (filter.gender !== 'all' && property.genderPreference !== filter.gender) {
        return false;
      }

      // Distance
      if (property.distanceFromCollegeKm > filter.maxDistanceKm) {
        return false;
      }

      // Food included
      if (filter.foodIncludedOnly && !property.foodChargesIncluded && property.foodService.type !== 'included') {
        return false;
      }

      // AC only
      if (filter.acOnly && !property.rooms.some((r) => r.acAvailable || r.hasAC)) {
        return false;
      }

      // Verified only
      if (filter.verifiedOnly && !property.isVerified) {
        return false;
      }

      // Available only
      if (filter.availableOnly) {
        const availableCount = property.availableOccupancy || property.availableBeds || 0;
        if (availableCount <= 0) return false;
      }

      // Property types
      if (filter.propertyTypes.length > 0 && !filter.propertyTypes.includes(property.propertyType || property.type || 'PG')) {
        return false;
      }

      // Room types
      if (filter.roomTypes.length > 0) {
        const hasMatchingRoom = property.rooms.some((r) => filter.roomTypes.includes(r.type));
        if (!hasMatchingRoom) return false;
      }

      // Amenities
      if (filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every((a) => property.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'lowest_rent':
          return a.startingRent - b.startingRent;
        case 'highest_rated':
          return b.rating - a.rating;
        case 'most_popular':
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case 'recently_added':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'nearest':
        default:
          return a.distanceFromCollegeKm - b.distanceFromCollegeKm;
      }
    });
  }, [properties, filter]);

  // Actions
  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoriteCount'>): Promise<string> => {
    const now = new Date().toISOString();
    const id = `pg-${Date.now()}`;
    const newProp: Property = {
      ...propertyData,
      id,
      viewsCount: 0,
      favoriteCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'properties', id), newProp);
    }

    setProperties((prev) => {
      const updated = [newProp, ...prev];
      localStorage.setItem(LOCAL_STORAGE_PROPS_KEY, JSON.stringify(updated));
      return updated;
    });

    return id;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const now = new Date().toISOString();
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'properties', id), { ...updates, updatedAt: now });
    }

    setProperties((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p));
      localStorage.setItem(LOCAL_STORAGE_PROPS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProperty = async (id: string) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'properties', id));
    }

    setProperties((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_PROPS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const togglePublishProperty = async (id: string) => {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    await updateProperty(id, { isPublished: !prop.isPublished });
  };

  const getPropertyById = useCallback((id: string) => {
    return properties.find((p) => p.id === id);
  }, [properties]);

  const incrementViews = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p))
    );
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) return;
    const isFav = favorites.includes(propertyId);
    let newFavs: string[];

    if (isFav) {
      newFavs = favorites.filter((id) => id !== propertyId);
      if (isFirebaseConfigured && db) {
        const favQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('propertyId', '==', propertyId)
        );
        const snap = await getDocs(favQuery);
        snap.forEach((d) => deleteDoc(d.ref));
      }
    } else {
      newFavs = [...favorites, propertyId];
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          propertyId,
          createdAt: new Date().toISOString(),
        });
      }
    }

    setFavorites(newFavs);
    localStorage.setItem(`${LOCAL_STORAGE_FAVS_KEY}_${user.uid}`, JSON.stringify(newFavs));

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, favoriteCount: Math.max(0, (p.favoriteCount || 0) + (isFav ? -1 : 1)) }
          : p
      )
    );
  };

  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const sendEnquiry = async (data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
    const id = `enq-${Date.now()}`;
    const now = new Date().toISOString();
    const newEnquiry: Enquiry = {
      ...data,
      id,
      status: 'sent',
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'enquiries', id), newEnquiry);
    }

    setEnquiries((prev) => {
      const updated = [newEnquiry, ...prev];
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
      return updated;
    });

    return id;
  };

  const updateEnquiryStatus = async (id: string, status: Enquiry['status'], ownerResponse?: string) => {
    const now = new Date().toISOString();
    const updates: Partial<Enquiry> = { status, updatedAt: now };
    if (ownerResponse !== undefined) {
      updates.ownerResponse = ownerResponse;
    }

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'enquiries', id), updates);
    }

    setEnquiries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const requestVisit = async (data: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
    const id = `vis-${Date.now()}`;
    const now = new Date().toISOString();
    const newVisit: VisitRequest = {
      ...data,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'visitRequests', id), newVisit);
    }

    setVisitRequests((prev) => {
      const updated = [newVisit, ...prev];
      localStorage.setItem(LOCAL_STORAGE_VISITS_KEY, JSON.stringify(updated));
      return updated;
    });

    return id;
  };

  const updateVisitStatus = async (
    id: string,
    status: VisitRequest['status'],
    note?: string,
    rescheduledDate?: string,
    rescheduledTime?: string
  ) => {
    const now = new Date().toISOString();
    const updates: Partial<VisitRequest> = { status, updatedAt: now };
    if (note !== undefined) updates.ownerNote = note;
    if (rescheduledDate) updates.rescheduledDate = rescheduledDate;
    if (rescheduledTime) updates.rescheduledTime = rescheduledTime;

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'visitRequests', id), updates);
    }

    setVisitRequests((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
      localStorage.setItem(LOCAL_STORAGE_VISITS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const now = new Date().toISOString();
    const newRev: Review = {
      ...reviewData,
      id,
      createdAt: now,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'reviews', id), newRev);
    }

    setReviews((prev) => {
      const updated = [newRev, ...prev];
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
      return updated;
    });

    const propReviews = [...reviews.filter((r) => r.propertyId === reviewData.propertyId), newRev];
    const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    await updateProperty(reviewData.propertyId, {
      rating: Number(avg.toFixed(1)),
      reviewCount: propReviews.length,
    });
  };

  const getPropertyReviews = useCallback((propertyId: string) => {
    return reviews.filter((r) => r.propertyId === propertyId);
  }, [reviews]);

  const addToCompare = (propertyId: string): boolean => {
    if (comparedPropertyIds.includes(propertyId)) return true;
    if (comparedPropertyIds.length >= 4) return false;
    setComparedPropertyIds((prev) => [...prev, propertyId]);
    return true;
  };

  const removeFromCompare = (propertyId: string) => {
    setComparedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
  };

  const clearCompare = () => {
    setComparedPropertyIds([]);
  };

  const isCompared = (propertyId: string) => {
    return comparedPropertyIds.includes(propertyId);
  };

  const getComparedProperties = (): Property[] => {
    return comparedPropertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is Property => p !== undefined);
  };

  const getCollegeById = useCallback((id: string) => {
    return colleges.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  }, [colleges]);

  const addCollege = async (collegeData: College) => {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'colleges', collegeData.id), collegeData);
    }
    setColleges((prev) => {
      const updated = [...prev, collegeData];
      localStorage.setItem(LOCAL_STORAGE_COLLEGES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        colleges,
        reviews,
        favorites,
        enquiries,
        visitRequests,
        comparedPropertyIds,
        filter,
        setFilter,
        resetFilter,
        loading,
        isLoading: loading,
        addProperty,
        updateProperty,
        deleteProperty,
        togglePublishProperty,
        getPropertyById,
        incrementViews,
        toggleFavorite,
        isFavorite,
        sendEnquiry,
        updateEnquiryStatus,
        requestVisit,
        updateVisitStatus,
        addReview,
        getPropertyReviews,
        getReviewsByProperty: getPropertyReviews,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        getComparedProperties,
        getCollegeById,
        addCollege,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
