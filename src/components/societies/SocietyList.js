import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchSocieties, fetchTopSocieties, clearSearchResults } from '../../store/slices/societiesSlice';
import SocietyCard from './SocietyCard';
import LoadingSpinner from '../common/LoadingSpinner';

const SocietyList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  
  const {
    societies,
    searchResults,
    isLoading,
    isSearching,
    error
  } = useSelector((state) => state.societies);

  useEffect(() => {
    dispatch(fetchTopSocieties());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchSocieties({ query: searchQuery.trim() }));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(clearSearchResults());
  };

  const displaySocieties = searchQuery ? searchResults : societies;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Browse Housing Societies
        </h1>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search societies by name, city, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary px-6"
          >
            {isSearching ? <LoadingSpinner size="w-5 h-5" color="text-white" /> : 'Search'}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </form>

        {searchQuery && (
          <p className="text-secondary-600">
            {isSearching ? 'Searching...' : `Showing results for "${searchQuery}"`}
          </p>
        )}
      </div>

      {/* Results Section */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="w-12 h-12" />
        </div>
      ) : displaySocieties.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-secondary-900">
            {searchQuery ? 'No societies found' : 'No societies available'}
          </h3>
          <p className="mt-1 text-sm text-secondary-500">
            {searchQuery 
              ? 'Try adjusting your search terms or browse all societies.'
              : 'Be the first to add a society to our platform!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySocieties.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>
      )}

      {/* Results count */}
      {displaySocieties.length > 0 && (
        <div className="mt-8 text-center text-secondary-600">
          Showing {displaySocieties.length} {displaySocieties.length === 1 ? 'society' : 'societies'}
        </div>
      )}
    </div>
  );
};

export default SocietyList;
