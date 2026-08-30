export type UserRole = 'tenant' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  college?: string;
  course?: string;
  gender?: 'male' | 'female' | 'other';
  preferredLocation?: string;
  businessName?: string;
  city?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'PG' | 'Hostel' | 'Apartment' | 'Private Room' | 'Shared Room';
export type GenderPreference = 'boys' | 'girls' | 'unisex';
export type RoomSharingType = 'single' | 'double' | 'triple' | 'four';

export interface RoomOption {
  type: RoomSharingType;
  label: string;
  rent: number;
  securityDeposit?: number;
  availableBeds: number;
  totalBeds?: number;
  attachedBathroom: boolean;
  hasAttachedBathroom?: boolean;
  balcony?: boolean;
  acAvailable: boolean;
  hasAC?: boolean;
  isFurnished?: boolean;
}

export type RoomDetail = RoomOption;

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'comfort' | 'convenience' | 'safety' | 'food';
}

export interface PropertyRules {
  smokingAllowed: boolean;
  isSmokingAllowed?: boolean;
  alcoholAllowed: boolean;
  isAlcoholAllowed?: boolean;
  visitorsAllowed: boolean;
  areVisitorsAllowed?: boolean;
  isNonVegAllowed?: boolean;
  curfewTime?: string;
  petsAllowed?: boolean;
  noticePeriodDays?: number;
  gateClosingTime?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  customRules?: string[];
}

export type HouseRules = PropertyRules;

export interface NearbyLandmark {
  name: string;
  type: 'college' | 'metro' | 'bus' | 'market' | 'hospital';
  distanceKm: number;
  walkingTimeMin?: number;
}

export interface FoodServiceDetail {
  available: boolean;
  mealsOffered?: ('breakfast' | 'lunch' | 'dinner')[];
  mealsProvided?: string[];
  type: 'veg' | 'non-veg' | 'both' | 'included' | string;
  costPerMonth?: number;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  name: string;
  tagline?: string;
  propertyType: PropertyType;
  type?: PropertyType; // alias
  genderPreference: GenderPreference;
  description: string;
  
  // Location
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  coordinates?: { lat: number; lng: number };
  nearbyCollegeId?: string;
  nearbyCollegeName: string;
  distanceFromCollegeKm: number;
  walkingTimeMins?: number;
  nearestMetroStation?: string;
  nearbyLandmarks?: NearbyLandmark[];

  // Pricing
  startingRent: number;
  securityDeposit: number;
  maintenanceCharges?: number;
  foodChargesIncluded?: boolean;
  foodChargesMonthly?: number;
  electricityChargesType: 'included' | 'metered' | 'fixed';
  electricityChargesAmount?: number;
  electricityCharges?: {
    type: 'included' | 'metered' | 'fixed';
    ratePerUnit?: number;
    monthlyFixed?: number;
  };
  noticePeriodDays?: number;

  // Rooms & Capacity
  rooms: RoomOption[];
  totalOccupancy?: number;
  availableOccupancy?: number;
  totalBeds?: number;
  availableBeds?: number;

  // Amenities & Services
  amenities: string[];
  foodService: FoodServiceDetail;

  // Rules
  rules: PropertyRules;

  // Media
  images: string[];
  coverImage: string;
  videoUrl?: string;

  // Metadata & Stats
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft' | string;
  viewsCount?: number;
  favoriteCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  campus?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  popularAreas?: string[];
  topAreas?: string[];
  averageRent?: number;
  averageRentRange?: string;
  pgCount: number;
  image: string;
  description?: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  propertyArea?: string;
  ownerId: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  message: string;
  preferredMoveInDate?: string;
  moveInDate?: string;
  preferredRoomType: string;
  status: 'sent' | 'viewed' | 'responded' | 'closed';
  ownerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  propertyArea?: string;
  ownerId: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  date: string;
  preferredTime: 'morning' | 'afternoon' | 'evening' | string;
  timeSlotDetail?: string;
  message?: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled';
  ownerNote?: string;
  rescheduledDate?: string;
  rescheduledTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  userCollege?: string;
  rating: number;
  foodRating?: number;
  cleanlinessRating?: number;
  valueRating?: number;
  wifiRating?: number;
  safetyRating?: number;
  ownerRating?: number;
  isVerifiedStay?: boolean;
  comment: string;
  pros?: string[];
  cons?: string[];
  createdAt: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  collegeId: string;
  city: string;
  area: string;
  minRent: number;
  maxRent: number;
  propertyTypes: PropertyType[];
  roomTypes: RoomSharingType[];
  gender: GenderPreference | 'all';
  maxDistanceKm: number;
  amenities: string[];
  foodIncludedOnly: boolean;
  acOnly: boolean;
  verifiedOnly: boolean;
  availableOnly: boolean;
  sortBy: 'nearest' | 'lowest_rent' | 'highest_rated' | 'most_popular' | 'recently_added';
}
