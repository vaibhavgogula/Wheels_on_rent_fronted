"use client";

import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { useVehicleSearch } from '@/hooks/use-vehicle-search';
import { useState } from 'react';
import { Vehicle } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function BrowsePage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minRating: 0,
    maxPrice: 0
  });
  const [appliedFilters, setAppliedFilters] = useState({
    type: '',
    brand: '',
    minRating: 0,
    maxPrice: 0
  });

  const { vehicles, loading, error, totalPages, totalItems } = useVehicleSearch(appliedFilters, page, 12);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setPage(0); // Reset to first page when searching
  };

  const clearFilters = () => {
    const emptyFilters = {
      type: '',
      brand: '',
      minRating: 0,
      maxPrice: 0
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(0);
  };

  const hasActiveFilters = appliedFilters.type || appliedFilters.brand || appliedFilters.minRating > 0 || appliedFilters.maxPrice > 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading vehicles: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Find Your Perfect Ride
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Browse our collection of high-quality vehicles for your next adventure, trip, or project.
        </p>
        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {totalItems} vehicles available
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                (filtered results)
              </span>
            )}
          </p>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-8 p-4 shadow-sm">
        <CardContent className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CAR">Car</SelectItem>
                  <SelectItem value="BIKE">Bike</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                  <SelectItem value="VAN">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Input 
                placeholder="e.g., Ford, Yamaha" 
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Rating</label>
              <Select 
                value={filters.minRating.toString()} 
                onValueChange={(value) => handleFilterChange('minRating', parseInt(value) || 0)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4">4 stars & up</SelectItem>
                  <SelectItem value="3">3 stars & up</SelectItem>
                  <SelectItem value="2">2 stars & up</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium">Max Price/Hour</label>
              <Input 
                type="number" 
                placeholder="₹25" 
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.type && (
                  <Badge variant="secondary" className="text-xs">
                    Type: {filters.type}
                  </Badge>
                )}
                {filters.brand && (
                  <Badge variant="secondary" className="text-xs">
                    Brand: {filters.brand}
                  </Badge>
                )}
                {filters.minRating > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Rating: {filters.minRating}+ stars
                  </Badge>
                )}
                {filters.maxPrice > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Max Price: ₹{filters.maxPrice}/hour
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs h-6 px-2"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      {vehicles && vehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No vehicles found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasActiveFilters ? 'Try adjusting your filters' : 'No vehicles available at the moment'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
