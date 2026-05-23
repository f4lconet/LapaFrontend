import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';
import { useYMaps } from '@pbe/react-yandex-maps';

interface LocationPickerProps {
  initialCoordinates: [number, number] | null;
  initialAddress: string;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export const LocationPicker = ({
  initialCoordinates,
  initialAddress,
  onLocationChange,
}: LocationPickerProps) => {
  const [address, setAddress] = useState(initialAddress || '');
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    initialCoordinates || null
  );
  const [suggestions, setSuggestions] = useState<Array<{ displayName: string; value: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const mapRef = useRef<any>(null);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const ymaps = useYMaps(['geocode', 'suggest']);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAddressFromGeoObject = (geoObject: any): string => {
    try {
      if (geoObject.getAddressLine) return geoObject.getAddressLine();
      const props = geoObject.properties;
      if (props) {
        const text = props.get ? props.get('text') : null;
        const name = props.get ? props.get('name') : null;
        const description = props.get ? props.get('description') : null;
        return (text || name || description || '') as string;
      }
      return '';
    } catch {
      return '';
    }
  };

  const reverseGeocode = useCallback(async (coords: [number, number]): Promise<string> => {
    if (!ymaps) return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
    try {
      const geocodeResult = await ymaps.geocode(coords, { results: 1 });
      const geoObjects = geocodeResult.geoObjects;
      if (geoObjects.getLength() > 0) {
        const foundAddress = getAddressFromGeoObject(geoObjects.get(0));
        return foundAddress || `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
      }
    } catch {}
    return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
  }, [ymaps]);

  const handleAddressChange = useCallback(async (value: string) => {
    setAddress(value);
    setError(null);
    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

    suggestTimerRef.current = setTimeout(async () => {
      if (!ymaps) return;
      setIsSearching(true);
      try {
        const results = await ymaps.suggest(value, { results: 7 });
        setSuggestions(results || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [ymaps]);

  const handleSuggestionSelect = useCallback(async (suggestion: { displayName: string; value: string }) => {
    const selectedAddress = suggestion.value;
    setAddress(selectedAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    if (!ymaps) return;

    try {
      const geocodeResult = await ymaps.geocode(selectedAddress, { results: 1 });
      const geoObjects = geocodeResult.geoObjects;
      if (geoObjects.getLength() > 0) {
        const geometry: any = geoObjects.get(0).geometry;
        if (geometry) {
          const coords = geometry.getCoordinates();
          setCoordinates(coords);
          onLocationChange(coords[0], coords[1], selectedAddress);
          mapRef.current?.setCenter(coords, 15);
        }
      }
    } catch {
      setError('Ошибка при геокодировании адреса');
    }
  }, [ymaps, onLocationChange]);

  const handleLocateMe = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      return;
    }
    setIsLocating(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
      setCoordinates(coords);
      const foundAddress = await reverseGeocode(coords);
      setAddress(foundAddress);
      onLocationChange(coords[0], coords[1], foundAddress);
      mapRef.current?.setCenter(coords, 15);
    } catch (err: any) {
      const messages: Record<number, string> = {
        1: 'Доступ к геолокации запрещён',
        2: 'Информация о местоположении недоступна',
        3: 'Время запроса местоположения истекло',
      };
      setError(messages[err.code] || 'Не удалось определить местоположение');
    } finally {
      setIsLocating(false);
    }
  }, [ymaps, reverseGeocode, onLocationChange]);

  const handleMapClick = useCallback(async (e: any) => {
    const coords = e.get('coords');
    setCoordinates(coords);
    const foundAddress = await reverseGeocode(coords);
    setAddress(foundAddress);
    onLocationChange(coords[0], coords[1], foundAddress);
  }, [reverseGeocode, onLocationChange]);

  const defaultCenter = coordinates || initialCoordinates || [55.751574, 37.573856];

  return (
    <Box>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          ref={inputRef}
          fullWidth
          label="Местоположение"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Начните вводить адрес..."
          error={!!error}
          helperText={error}
          slotProps={{
            input: {
                endAdornment: (
                <InputAdornment position="end">
                    {isSearching ? (
                    <CircularProgress size={20} />
                    ) : (
                    <Button onClick={handleLocateMe} disabled={isLocating} sx={{ minWidth: 'auto', p: 0.5 }}>
                        {isLocating ? <CircularProgress size={20} /> : <MyLocation />}
                    </Button>
                    )}
                </InputAdornment>
                ),
            }
            
          }}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <Paper
            ref={suggestionsRef}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: 300,
              overflow: 'auto',
              mt: 0.5,
            }}
            elevation={3}
          >
            <List dense>
              {suggestions.map((suggestion, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={suggestion.displayName || suggestion.value}
                    secondary={suggestion.displayName !== suggestion.value ? suggestion.value : undefined}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <Box sx={{ height: 400, mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <Map
          instanceRef={mapRef}
          defaultState={{
            center: defaultCenter,
            zoom: coordinates ? 15 : 5,
          }}
          width="100%"
          height="100%"
          onClick={handleMapClick}
          modules={['geocode', 'geoObject.addon.balloon']}
        >
          {coordinates && (
            <Placemark
              geometry={coordinates}
              options={{ draggable: true, preset: 'islands#redIcon' }}
              modules={['geoObject.addon.balloon']}
              properties={{ balloonContent: address || 'Выбранная точка' }}
              onDragEnd={(e: any) => {
                const newCoords = e.get('target').geometry.getCoordinates();
                handleMapClick({ get: () => newCoords });
              }}
            />
          )}
          <ZoomControl />
        </Map>
      </Box>

      {coordinates && (
        <Typography variant="caption" color="text.secondary">
          Координаты: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
        </Typography>
      )}
    </Box>
  );
};