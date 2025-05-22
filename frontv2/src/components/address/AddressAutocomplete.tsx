"use client"
import React, { useEffect, useRef, ChangeEvent } from 'react'
import debounce from 'lodash.debounce' // npm install lodash.debounce
import { searchAddresses } from '@/helpers/MapsHelper'
import { Loader2, MapPin, Pin } from 'lucide-react'

/**
 * Define interfaz acorde a lo que devuelve tu API:
 */
interface AddressSuggestion {
  place_name: string
  center: [number, number]
  lat: number
  lng: number
}

interface AddressAutocompleteProps {
  /** El texto actual del input */
  value: string
  /** Se dispara al cambiar texto */
  onChange: (val: string) => void
  /** Se dispara al seleccionar, con el objeto completo */
  onSelect: (suggestion: AddressSuggestion) => void
}

export default function AddressAutocomplete({ value, onChange, onSelect }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Búsqueda debounceada
  const debouncedSearch = useRef(
    debounce(async (q: string) => {
      if (q.length < 5) {
        setSuggestions([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const results: AddressSuggestion[] = await searchAddresses(q)
        setSuggestions(results)
        setOpen(true)
      } catch (err) {
        console.error('Address lookup failed', err)
      } finally {
        setLoading(false)
      }
    }, 500)
  ).current

  useEffect(() => {
    setLoading(true)
    debouncedSearch(value)
    return () => debouncedSearch.cancel()
  }, [value])

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = (suggestion: AddressSuggestion) => {
    onSelect(suggestion)
    // Actualizamos el input con el texto formateado
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 5 && suggestions.length > 0 && setOpen(true)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder="Empieza a escribir tu dirección…"
      />

      {loading && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
        </div>
      )}
      {!loading && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
      )}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((sugg) => (
            <li
              key={`${sugg.lat}-${sugg.lng}`}
              onClick={() => handleSelect(sugg)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {sugg.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}