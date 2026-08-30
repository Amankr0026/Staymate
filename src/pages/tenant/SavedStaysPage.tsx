import React from 'react';
import { Heart, Compass } from 'lucide-react';
import { useProperty } from '../../context/PropertyContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PropertyCard } from '../../components/property/PropertyCard';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedStaysPage: React.FC = () => {
  const { properties, favorites } = useProperty();
  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <DashboardLayout
      title="Saved Accommodations"
      subtitle="Keep track of your shortlisted student PGs, hostels, and rooms."
    >
      {savedProperties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Click the heart icon on any PG card to bookmark accommodations for quick comparison and easy booking."
          actionText="Explore Campus Stays"
          actionHref="/explore"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
