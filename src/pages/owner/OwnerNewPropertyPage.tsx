import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PropertyForm } from '../../components/owner/PropertyForm';
import type { Property } from '../../types';

export const OwnerNewPropertyPage: React.FC = () => {
  const { user } = useAuth();
  const { addProperty, colleges } = useProperty();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (propertyData: Partial<Property>) => {
    setIsSubmitting(true);
    try {
      // Find matching college name
      const college = colleges.find((c) => c.id === propertyData.nearbyCollegeId);

      const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
        name: propertyData.name || 'Student PG',
        tagline: propertyData.tagline || '',
        description: propertyData.description || '',
        propertyType: (propertyData.propertyType || propertyData.type || 'PG') as any,
        type: propertyData.type || propertyData.propertyType || 'PG',
        genderPreference: propertyData.genderPreference || 'unisex',
        address: propertyData.address || '',
        area: propertyData.area || '',
        city: propertyData.city || 'Delhi',
        state: propertyData.state || 'Delhi',
        pincode: propertyData.pincode || '',
        latitude: Number(propertyData.latitude || propertyData.coordinates?.lat || 28.6920),
        longitude: Number(propertyData.longitude || propertyData.coordinates?.lng || 77.2110),
        coordinates: propertyData.coordinates || { lat: 28.6920, lng: 77.2110 },
        nearbyCollegeId: propertyData.nearbyCollegeId || 'du-north',
        nearbyCollegeName: college?.name || 'Delhi University (North Campus)',
        distanceFromCollegeKm: Number(propertyData.distanceFromCollegeKm) || 0.8,
        walkingTimeMins: Number(propertyData.walkingTimeMins) || 10,
        nearestMetroStation: propertyData.nearestMetroStation || 'Vishwavidyalaya Metro',
        rooms: propertyData.rooms || [],
        startingRent: Number(propertyData.startingRent) || 8000,
        securityDeposit: Number(propertyData.securityDeposit) || 8000,
        noticePeriodDays: Number(propertyData.noticePeriodDays) || 30,
        electricityChargesType: (propertyData.electricityChargesType || (propertyData.electricityCharges?.type as any) || 'included'),
        electricityCharges: propertyData.electricityCharges || { type: 'included' },
        amenities: propertyData.amenities || [],
        foodService: propertyData.foodService || {
          available: true,
          type: 'included',
          mealsProvided: ['Breakfast', 'Dinner'],
        },
        rules: propertyData.rules || {
          smokingAllowed: false,
          alcoholAllowed: false,
          visitorsAllowed: true,
          curfewTime: '10:30 PM',
          gateClosingTime: '11:00 PM',
          areVisitorsAllowed: true,
          isNonVegAllowed: false,
          isSmokingAllowed: false,
          isAlcoholAllowed: false,
          quietHoursStart: '11:00 PM',
          quietHoursEnd: '06:00 AM',
        },
        images: propertyData.images && propertyData.images.length > 0 ? propertyData.images : [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        ],
        coverImage: propertyData.coverImage || propertyData.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        ownerId: user?.uid || 'demo-owner',
        ownerName: user?.displayName || 'Rajesh Sharma',
        ownerEmail: user?.email || 'rajesh@staymate.com',
        ownerPhone: user?.phone || '+91 98765 43210',
        rating: 4.8,
        reviewCount: 0,
        isVerified: true,
        availableBeds: Number(propertyData.availableBeds) || 4,
        totalBeds: Number(propertyData.totalBeds) || 12,
        isFeatured: false,
      };

      await addProperty(newProperty);
      success('Property listed successfully on StayMate!');
      navigate('/owner/properties');
    } catch (err: any) {
      error(err.message || 'Failed to list property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="List New Student Accommodation"
      subtitle="Complete the step-by-step wizard to publish your PG or hostel."
    >
      <div className="max-w-4xl bg-[#161618] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-xl">
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/owner/properties')}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
};
