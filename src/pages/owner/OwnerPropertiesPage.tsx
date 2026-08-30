import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Bed,
  MapPin,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GenderBadge, VerifiedBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatRent } from '../../utils/formatters';

export const OwnerPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { properties, deleteProperty } = useProperty();
  const { success, error } = useToast();

  const ownerProperties = properties.filter(
    (p) => p.ownerId === user?.uid || p.ownerEmail === user?.email
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from StayMate?`)) {
      try {
        await deleteProperty(id);
        success(`Property "${name}" deleted.`);
      } catch (err) {
        error('Failed to delete property.');
      }
    }
  };

  return (
    <DashboardLayout
      title="My Accommodations"
      subtitle="View, edit, or list new student PGs, hostels, and rooms."
      actions={
        <Link
          to="/owner/properties/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Accommodation</span>
        </Link>
      }
    >
      {ownerProperties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Properties Listed Yet"
          description="Start publishing your PG rooms to get discovered by college students seeking campus accommodation."
          actionText="List Your First PG"
          actionHref="/owner/properties/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
          {ownerProperties.map((property) => (
            <div
              key={property.id}
              className="bg-[#161618] rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-[#121214]">
                  <img
                    src={property.coverImage || property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <GenderBadge gender={property.genderPreference} />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-amber-400 border border-white/10 shadow-xs">
                    {property.availableBeds} beds vacant
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      {property.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{property.rating} ({property.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-1">
                    {property.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {property.address}, {property.area}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Starting Rent</span>
                      <span className="text-base font-extrabold text-white">
                        {formatRent(property.startingRent)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                      {property.rooms.length} Room Types
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#121214] border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  to={`/property/${property.id}`}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="View Live Listing"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/owner/properties/${property.id}/edit`}
                    className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id, property.name)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
