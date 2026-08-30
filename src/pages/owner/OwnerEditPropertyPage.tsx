import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PropertyForm } from '../../components/owner/PropertyForm';
import type { Property } from '../../types';

export const OwnerEditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, updateProperty } = useProperty();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <DashboardLayout title="Property Not Found">
        <p className="text-slate-500">The property you are trying to edit does not exist.</p>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (propertyData: Partial<Property>) => {
    setIsSubmitting(true);
    try {
      await updateProperty(property.id, propertyData);
      success('Property details updated successfully!');
      navigate('/owner/properties');
    } catch (err: any) {
      error(err.message || 'Failed to update property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title={`Edit "${property.name}"`}
      subtitle="Update room pricing, vacancies, mess facilities, or rules."
    >
      <div className="max-w-4xl bg-[#161618] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-xl">
        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/owner/properties')}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
};
