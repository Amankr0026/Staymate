import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  IndianRupee,
  Bed,
  Sparkles,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type {
  Property,
  PropertyType,
  GenderPreference,
  RoomSharingType,
  RoomDetail,
  FoodServiceDetail,
  HouseRules,
} from '../../types';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ALL_AMENITIES, renderAmenityIcon } from '../../utils/amenities';

interface PropertyFormProps {
  initialData?: Property;
  isEditing?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, isEditing = false }) => {
  const { addProperty, updateProperty, colleges } = useProperty();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    name: initialData?.name || '',
    tagline: initialData?.tagline || 'Modern student stay with premium food & superfast Wi-Fi',
    type: (initialData?.type || 'PG') as PropertyType,
    genderPreference: (initialData?.genderPreference || 'unisex') as GenderPreference,
    totalBeds: initialData?.totalBeds || 20,
    availableBeds: initialData?.availableBeds || 6,
    description:
      initialData?.description ||
      'Located in a safe student hub with 3 times fresh homestyle meals, daily housekeeping, 300 Mbps fiber optic internet, and 24/7 security warden on campus.',
  });

  const [locationInfo, setLocationInfo] = useState({
    address: initialData?.address || '',
    area: initialData?.area || '',
    city: initialData?.city || 'Delhi',
    pincode: initialData?.pincode || '110007',
    nearbyCollegeId: initialData?.nearbyCollegeId || (colleges[0]?.id || 'du-north'),
    nearbyCollegeName: initialData?.nearbyCollegeName || (colleges[0]?.name || 'Delhi University (North Campus)'),
    distanceFromCollegeKm: initialData?.distanceFromCollegeKm || 0.8,
    walkingTimeMins: initialData?.walkingTimeMins || 10,
    nearestMetroStation: initialData?.nearestMetroStation || 'Vishwa Vidyalaya Metro (500m)',
    latitude: initialData?.latitude || 28.6912,
    longitude: initialData?.longitude || 77.2124,
  });

  const [pricingInfo, setPricingInfo] = useState({
    startingRent: initialData?.startingRent || 9500,
    securityDeposit: initialData?.securityDeposit || 10000,
    maintenanceCharges: initialData?.maintenanceCharges || 0,
    noticePeriodDays: initialData?.noticePeriodDays || 30,
    electricityType: (initialData?.electricityCharges?.type || 'metered') as 'included' | 'metered' | 'fixed_unit',
    electricityRate: initialData?.electricityCharges?.ratePerUnit || 10,
    foodType: (initialData?.foodService?.type || 'included') as 'included' | 'optional' | 'none',
    foodCost: initialData?.foodService?.costPerMonth || 0,
    mealsProvided: initialData?.foodService?.mealsProvided || ['Breakfast', 'Lunch', 'Dinner'],
  });

  const [rooms, setRooms] = useState<RoomDetail[]>(
    initialData?.rooms || [
      {
        type: 'single',
        label: 'Single Occupancy AC',
        rent: 14000,
        totalBeds: 5,
        availableBeds: 2,
        isFurnished: true,
        hasAttachedBathroom: true,
        hasBalcony: true,
        hasAC: true,
      },
      {
        type: 'double',
        label: 'Double Sharing AC',
        rent: 9500,
        totalBeds: 10,
        availableBeds: 3,
        isFurnished: true,
        hasAttachedBathroom: true,
        hasBalcony: false,
        hasAC: true,
      },
      {
        type: 'triple',
        label: 'Triple Sharing Non-AC',
        rent: 7500,
        totalBeds: 9,
        availableBeds: 4,
        isFurnished: true,
        hasAttachedBathroom: true,
        hasBalcony: false,
        hasAC: false,
      },
    ]
  );

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || [
      'Wi-Fi',
      'AC',
      'Food',
      'Washing Machine',
      'Refrigerator',
      'Power Backup',
      'CCTV',
      'Housekeeping',
      'Study Table',
      'Attached Bathroom',
      'Hot Water',
    ]
  );

  const [rules, setRules] = useState<HouseRules>(
    initialData?.rules || {
      curfewTime: '10:30 PM',
      gateClosingTime: '11:00 PM',
      isSmokingAllowed: false,
      isAlcoholAllowed: false,
      isNonVegAllowed: true,
      areVisitorsAllowed: true,
      areOppositeGenderVisitorsAllowed: false,
      quietHoursStart: '11:00 PM',
      quietHoursEnd: '06:00 AM',
      customRules: ['Keep study room quiet after 11 PM', 'Register weekend night-outs in advance'],
    }
  );

  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ]
  );

  const [newImageUrl, setNewImageUrl] = useState('');

  const steps = [
    { num: 1, title: 'Basic Info', icon: Building2 },
    { num: 2, title: 'Location', icon: MapPin },
    { num: 3, title: 'Pricing & Food', icon: IndianRupee },
    { num: 4, title: 'Room Setup', icon: Bed },
    { num: 5, title: 'Amenities', icon: Sparkles },
    { num: 6, title: 'House Rules', icon: ShieldAlert },
    { num: 7, title: 'Photos & Publish', icon: ImageIcon },
  ];

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        type: 'double',
        label: 'New Room Option',
        rent: 8500,
        totalBeds: 4,
        availableBeds: 2,
        isFurnished: true,
        hasAttachedBathroom: true,
        hasBalcony: false,
        hasAC: true,
      },
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleCollegeChange = (collegeId: string) => {
    const selected = colleges.find((c) => c.id === collegeId);
    if (selected) {
      setLocationInfo({
        ...locationInfo,
        nearbyCollegeId: selected.id,
        nearbyCollegeName: selected.name,
        city: selected.city,
        latitude: selected.latitude + (Math.random() - 0.5) * 0.01,
        longitude: selected.longitude + (Math.random() - 0.5) * 0.01,
      });
    }
  };

  const handleSubmit = async () => {
    if (!basicInfo.name.trim() || !locationInfo.address.trim() || !locationInfo.area.trim()) {
      error('Please fill in the required property name and address details.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const minRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.rent)) : pricingInfo.startingRent;

      const propertyPayload: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
        name: basicInfo.name,
        tagline: basicInfo.tagline,
        description: basicInfo.description,
        propertyType: (basicInfo.type || 'PG') as any,
        type: basicInfo.type,
        genderPreference: basicInfo.genderPreference,
        totalBeds: Number(basicInfo.totalBeds),
        availableBeds: Number(basicInfo.availableBeds),
        address: locationInfo.address,
        area: locationInfo.area,
        city: locationInfo.city,
        state: locationInfo.city === 'Bengaluru' ? 'Karnataka' : locationInfo.city === 'Mumbai' ? 'Maharashtra' : locationInfo.city === 'Pune' ? 'Maharashtra' : 'Delhi',
        pincode: locationInfo.pincode,
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        nearbyCollegeId: locationInfo.nearbyCollegeId,
        nearbyCollegeName: locationInfo.nearbyCollegeName,
        distanceFromCollegeKm: Number(locationInfo.distanceFromCollegeKm),
        walkingTimeMins: Number(locationInfo.walkingTimeMins),
        nearestMetroStation: locationInfo.nearestMetroStation,
        startingRent: minRent,
        securityDeposit: Number(pricingInfo.securityDeposit),
        maintenanceCharges: Number(pricingInfo.maintenanceCharges),
        noticePeriodDays: Number(pricingInfo.noticePeriodDays),
        electricityChargesType: (pricingInfo.electricityType || 'included') as any,
        electricityCharges: {
          type: pricingInfo.electricityType,
          ratePerUnit: pricingInfo.electricityRate,
        },
        foodService: {
          available: pricingInfo.foodType !== 'none',
          type: pricingInfo.foodType,
          costPerMonth: pricingInfo.foodCost,
          mealsProvided: pricingInfo.mealsProvided,
        },
        rooms,
        amenities: selectedAmenities,
        rules,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'],
        coverImage: images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        ownerId: user?.uid || 'owner-1',
        ownerName: user?.displayName || 'PG Manager',
        ownerPhone: user?.phone || '+91 98765 43210',
        ownerEmail: user?.email || 'owner@staymate.com',
        isVerified: true,
        rating: initialData?.rating || 4.8,
        reviewCount: initialData?.reviewCount || 1,
        featured: initialData?.featured || false,
        status: 'published',
      };

      if (isEditing && initialData) {
        await updateProperty(initialData.id, propertyPayload);
        success('Property details updated successfully!');
        navigate(`/property/${initialData.id}`);
      } else {
        const newId = await addProperty(propertyPayload);
        success('New PG property published and live on StayMate!');
        navigate(`/property/${newId}`);
      }
    } catch (err) {
      error('Failed to save property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* Progress Steps Header */}
      <div className="bg-[#121214] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${
                    isCurrent
                      ? 'bg-black text-amber-400'
                      : isCompleted
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#1a1a1e] text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span className="hidden md:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-[#121214] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg space-y-6">
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 1: Basic Property Overview</h3>
              <p className="text-xs text-slate-400">Provide the title, property category, and resident gender policy.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">PG / Accommodation Name *</label>
                <input
                  type="text"
                  required
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="e.g. Stanza Elite Student Living"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Catchy Tagline / One-Liner</label>
                <input
                  type="text"
                  value={basicInfo.tagline}
                  onChange={(e) => setBasicInfo({ ...basicInfo, tagline: e.target.value })}
                  placeholder="e.g. 5 Mins Walk to Campus • 3 Meals Included • AC & Wi-Fi"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Property Type</label>
                <select
                  value={basicInfo.type}
                  onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value as PropertyType })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                >
                  <option value="PG">Paying Guest (PG)</option>
                  <option value="Hostel">Student Hostel</option>
                  <option value="Apartment">Student Apartment</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Shared Room">Shared Room / Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Resident Gender Preference</label>
                <select
                  value={basicInfo.genderPreference}
                  onChange={(e) => setBasicInfo({ ...basicInfo, genderPreference: e.target.value as GenderPreference })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                >
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="unisex">Unisex / Co-living (Separate Floors/Rooms)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Bed Capacity</label>
                <input
                  type="number"
                  min={1}
                  value={basicInfo.totalBeds}
                  onChange={(e) => setBasicInfo({ ...basicInfo, totalBeds: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Currently Vacant Beds</label>
                <input
                  type="number"
                  min={0}
                  value={basicInfo.availableBeds}
                  onChange={(e) => setBasicInfo({ ...basicInfo, availableBeds: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  placeholder="Describe your student stay facilities, atmosphere, and warden support..."
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 2: Campus & Exact Location</h3>
              <p className="text-xs text-slate-400">Connect this property to nearby colleges for student discovery.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Target College Campus *</label>
                <select
                  value={locationInfo.nearbyCollegeId}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden font-semibold"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={locationInfo.address}
                  onChange={(e) => setLocationInfo({ ...locationInfo, address: e.target.value })}
                  placeholder="e.g. House 42, Block B, Hudson Lane"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Locality / Sector *</label>
                <input
                  type="text"
                  required
                  value={locationInfo.area}
                  onChange={(e) => setLocationInfo({ ...locationInfo, area: e.target.value })}
                  placeholder="e.g. Hudson Lane / Vijay Nagar"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={locationInfo.city}
                  onChange={(e) => setLocationInfo({ ...locationInfo, city: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Distance to College (in km)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={locationInfo.distanceFromCollegeKm}
                  onChange={(e) => setLocationInfo({ ...locationInfo, distanceFromCollegeKm: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Walking Time (in minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={locationInfo.walkingTimeMins}
                  onChange={(e) => setLocationInfo({ ...locationInfo, walkingTimeMins: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Nearest Metro / Bus Landmark</label>
                <input
                  type="text"
                  value={locationInfo.nearestMetroStation}
                  onChange={(e) => setLocationInfo({ ...locationInfo, nearestMetroStation: e.target.value })}
                  placeholder="e.g. GTB Nagar Metro Station (Gate 3 - 400m away)"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING & FOOD */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 3: Rent, Security Deposit & Meals</h3>
              <p className="text-xs text-slate-400">Transparent pricing for students with food policy.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Starting Base Rent (₹/mo)</label>
                <input
                  type="number"
                  step="500"
                  value={pricingInfo.startingRent}
                  onChange={(e) => setPricingInfo({ ...pricingInfo, startingRent: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-amber-400 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Refundable Security Deposit (₹)</label>
                <input
                  type="number"
                  step="500"
                  value={pricingInfo.securityDeposit}
                  onChange={(e) => setPricingInfo({ ...pricingInfo, securityDeposit: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={pricingInfo.noticePeriodDays}
                  onChange={(e) => setPricingInfo({ ...pricingInfo, noticePeriodDays: Number(e.target.value) })}
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>
            </div>

            {/* Food Section */}
            <div className="p-4 bg-[#161618] rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mess / Food Provision</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'included', label: 'Included in Rent' },
                  { value: 'optional', label: 'Optional Extra (+₹/mo)' },
                  { value: 'none', label: 'Self Cook / No Mess' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPricingInfo({ ...pricingInfo, foodType: opt.value as any })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      pricingInfo.foodType === opt.value
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-[#121214] text-slate-300 border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Electricity */}
            <div className="p-4 bg-[#161618] rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Electricity Charges</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'metered', label: 'Individual Sub-meter (per unit)' },
                  { value: 'included', label: '100% Free / Included in Rent' },
                  { value: 'fixed_unit', label: 'Fixed Monthly Surcharge' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPricingInfo({ ...pricingInfo, electricityType: opt.value as any })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      pricingInfo.electricityType === opt.value
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-[#121214] text-slate-300 border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ROOM SETUP */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Step 4: Room Configurations & Sharing Types</h3>
                <p className="text-xs text-slate-400">Define single, double, or triple room categories and specific rents.</p>
              </div>
              <button
                type="button"
                onClick={handleAddRoom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-xs rounded-xl hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Room Type
              </button>
            </div>

            <div className="space-y-4">
              {rooms.map((room, idx) => (
                <div key={idx} className="p-4 bg-[#161618] rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400">Room #{idx + 1}</span>
                    {rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Room Title / Label</label>
                      <input
                        type="text"
                        value={room.label}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].label = e.target.value;
                          setRooms(copy);
                        }}
                        className="w-full p-2.5 text-xs bg-[#121214] border border-white/10 rounded-xl text-white outline-hidden focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Occupancy Type</label>
                      <select
                        value={room.type}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].type = e.target.value as RoomSharingType;
                          setRooms(copy);
                        }}
                        className="w-full p-2.5 text-xs bg-[#121214] border border-white/10 rounded-xl text-white outline-hidden focus:border-amber-500"
                      >
                        <option value="single">Single (Private)</option>
                        <option value="double">2 Sharing (Double)</option>
                        <option value="triple">3 Sharing (Triple)</option>
                        <option value="four">4 Sharing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Monthly Rent (₹/bed)</label>
                      <input
                        type="number"
                        step="500"
                        value={room.rent}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].rent = Number(e.target.value);
                          setRooms(copy);
                        }}
                        className="w-full p-2.5 text-xs bg-[#121214] border border-white/10 rounded-xl text-amber-400 font-bold outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Room features checkboxes */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={room.hasAC}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].hasAC = e.target.checked;
                          setRooms(copy);
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span>Air Conditioned (AC)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={room.hasAttachedBathroom}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].hasAttachedBathroom = e.target.checked;
                          setRooms(copy);
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span>Attached Bath</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={room.hasBalcony}
                        onChange={(e) => {
                          const copy = [...rooms];
                          copy[idx].hasBalcony = e.target.checked;
                          setRooms(copy);
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span>Balcony</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: AMENITIES */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 5: Amenities & Student Comforts</h3>
              <p className="text-xs text-slate-400">Select all amenities available on your property.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ALL_AMENITIES.map((a) => {
                const selected = selectedAmenities.includes(a.name);
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => toggleAmenity(a.name)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      selected
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-xs'
                        : 'bg-[#161618] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        selected ? 'bg-amber-500 text-black font-bold' : 'bg-[#121214] text-slate-400'
                      }`}
                    >
                      {renderAmenityIcon(a.name, 'w-4 h-4')}
                    </div>
                    <span className="text-xs font-bold">{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: HOUSE RULES */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 6: House Rules & Timings</h3>
              <p className="text-xs text-slate-400">Clear expectations regarding curfew, visitors, and quiet hours.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Evening Curfew Time</label>
                <input
                  type="text"
                  value={rules.curfewTime}
                  onChange={(e) => setRules({ ...rules, curfewTime: e.target.value })}
                  placeholder="e.g. 10:30 PM (No Curfew for Final Year)"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Main Gate Closing Time</label>
                <input
                  type="text"
                  value={rules.gateClosingTime}
                  onChange={(e) => setRules({ ...rules, gateClosingTime: e.target.value })}
                  placeholder="e.g. 11:00 PM"
                  className="w-full p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
                />
              </div>
            </div>

            {/* Toggle Rules Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="p-3 rounded-xl border border-white/10 bg-[#161618] flex items-center justify-between cursor-pointer hover:border-amber-500/30">
                <span className="text-xs font-bold text-slate-300">Visitors / Friends Allowed</span>
                <input
                  type="checkbox"
                  checked={rules.areVisitorsAllowed}
                  onChange={(e) => setRules({ ...rules, areVisitorsAllowed: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
              </label>

              <label className="p-3 rounded-xl border border-white/10 bg-[#161618] flex items-center justify-between cursor-pointer hover:border-amber-500/30">
                <span className="text-xs font-bold text-slate-300">Non-Veg Food Allowed</span>
                <input
                  type="checkbox"
                  checked={rules.isNonVegAllowed}
                  onChange={(e) => setRules({ ...rules, isNonVegAllowed: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
              </label>

              <label className="p-3 rounded-xl border border-white/10 bg-[#161618] flex items-center justify-between cursor-pointer hover:border-amber-500/30">
                <span className="text-xs font-bold text-slate-300">Smoking Allowed</span>
                <input
                  type="checkbox"
                  checked={rules.isSmokingAllowed}
                  onChange={(e) => setRules({ ...rules, isSmokingAllowed: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
              </label>

              <label className="p-3 rounded-xl border border-white/10 bg-[#161618] flex items-center justify-between cursor-pointer hover:border-amber-500/30">
                <span className="text-xs font-bold text-slate-300">Opposite Gender in Common Area</span>
                <input
                  type="checkbox"
                  checked={rules.areOppositeGenderVisitorsAllowed}
                  onChange={(e) => setRules({ ...rules, areOppositeGenderVisitorsAllowed: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 7: PHOTOS & PUBLISH */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-lg font-black text-white">Step 7: Photos & Media Showcase</h3>
              <p className="text-xs text-slate-400">High quality photos of rooms, study desks, and dining areas.</p>
            </div>

            {/* Image URL Adder */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. Unsplash or Cloud URL)..."
                className="flex-1 p-3 text-sm bg-[#161618] border border-white/10 rounded-xl focus:border-amber-500 text-white outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-5 py-3 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 cursor-pointer shadow-md shadow-amber-500/20"
              >
                Add Image
              </button>
            </div>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-4/3 rounded-xl overflow-hidden group border border-white/10">
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Cover Photo
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-300 bg-[#161618] border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Publishing...' : isEditing ? 'Save & Update Listing' : 'Publish PG Listing Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
