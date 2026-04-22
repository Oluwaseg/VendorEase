'use client';

import {
  formatLocationDisplay,
  LocationIQResponse,
  reverseGeocode,
  searchLocations,
} from '@/lib/locationiq';
import { Check, Loader2, MapPin, Navigation, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: LocationIQResponse) => void;
  placeholder?: string;
  label?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Start typing an address...',
  label = 'Address',
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationIQResponse[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(value, 8);
      setSuggestions(results);
      setIsOpen(true);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            selectLocation(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    inputRef.current?.addEventListener('keydown', handleKeyDown);
    return () =>
      inputRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestions, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLocation = (location: LocationIQResponse) => {
    const displayText = formatLocationDisplay(location);
    onChange(displayText);
    onLocationSelect?.(location);
    setIsOpen(false);
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGeolocating(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get address
          const location = await reverseGeocode(latitude, longitude);
          if (location) {
            selectLocation(location);
          } else {
            alert(
              'Could not find address for your location. Please enter it manually.'
            );
          }
          setIsGeolocating(false);
        },
        (error) => {
          console.error(' Geolocation error:', error);
          alert('Unable to get your location. Please enter address manually.');
          setIsGeolocating(false);
        }
      );
    } catch (error) {
      console.error('Geolocation error:', error);
      setIsGeolocating(false);
    }
  };

  return (
    <div className='relative'>
      <div className='flex items-center justify-between mb-2'>
        <label className='block text-sm font-semibold text-foreground'>
          {label} *
        </label>
        <button
          type='button'
          onClick={handleUseMyLocation}
          disabled={isGeolocating}
          className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
        >
          {isGeolocating ? (
            <>
              <Loader2 className='w-3 h-3 animate-spin' />
              Locating...
            </>
          ) : (
            <>
              <Navigation className='w-3 h-3' />
              Use My Location
            </>
          )}
        </button>
      </div>
      <div className='relative'>
        <div className='relative flex items-center'>
          <MapPin className='absolute left-3 w-5 h-5 text-foreground/40 pointer-events-none' />
          <input
            ref={inputRef}
            type='text'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className='w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
            autoComplete='off'
            required
          />
          {isLoading && (
            <Loader2 className='absolute right-3 w-5 h-5 animate-spin text-primary' />
          )}
          {value && !isLoading && (
            <button
              type='button'
              onClick={() => {
                onChange('');
                setSuggestions([]);
              }}
              className='absolute right-3 text-foreground/40 hover:text-foreground transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className='absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto'
          >
            {suggestions.map((location, index) => (
              <button
                key={location.place_id}
                type='button'
                onClick={() => selectLocation(location)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-all hover:bg-primary/5 focus:outline-none focus:bg-primary/5 ${
                  index === selectedIndex ? 'bg-primary/10' : ''
                }`}
              >
                <div className='flex items-start gap-3'>
                  <MapPin className='w-4 h-4 text-primary mt-1 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-foreground text-sm'>
                      {formatLocationDisplay(location)}
                    </p>
                    <p className='text-xs text-foreground/50 truncate'>
                      {location.display_name}
                    </p>
                  </div>
                  {index === selectedIndex && (
                    <Check className='w-4 h-4 text-primary flex-shrink-0' />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isOpen && !isLoading && value && suggestions.length === 0 && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg p-4 z-50'>
            <p className='text-sm text-foreground/60 text-center'>
              No locations found for "{value}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
