'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Building2, MapPin, Briefcase, GraduationCap, Users, Euro, Globe, X, Plus } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';
// Mock database skills - replace this with your actual API call
// const mockDatabaseSkills = [
//     'PHP', 'Laravel', 'MySQL', 'API REST', 'JavaScript', 'TypeScript',
//     'React', 'Vue.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
//     'Docker', 'AWS', 'Git', 'CI/CD', 'Python', 'Django', 'Flask',
//     'Java', 'Spring Boot', 'Kubernetes', 'GraphQL', 'Redis'
//   ];
interface Skill {
    id: number;
    name: string;
}
  
export default function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
    const [input, setInput] = useState('');
    const [mockDatabaseSkills, setMockDatabaseSkills] = useState<Skill[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
        const handleSkillsDefault = async () =>{
            const response = await apiRequest('skills');
            if(response.status === 'success') setMockDatabaseSkills(response.data);
        }
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
            inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      handleSkillsDefault();
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const searchSkills = (searchTerm: string) => {
      const filtered = mockDatabaseSkills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !skills.includes(skill.name)
      );
      setSuggestions(filtered.map(skill => skill.name));
      setIsOpen(filtered.length > 0);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      searchSkills(value);
    };
  
    const addSkill = (skill: string) => {
      if (!skills.includes(skill)) {
        onChange([...skills, skill]);
      }
      setInput('');
      setSuggestions([]);
      setIsOpen(false);
    };
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (input.trim()) {
          if (suggestions.length > 0) {
            addSkill(suggestions[0]);
          } else {
            addSkill(input.trim());
          }
        }
      }
    };
  
    const removeSkill = (skillToRemove: string) => {
      onChange(skills.filter(skill => skill !== skillToRemove));
    };
  
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:bg-blue-100 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchSkills(input)}
            placeholder="Buscar o añadir una habilidad"
            className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
          {isOpen && (
            <div
              ref={menuRef}
              className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addSkill(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>{suggestion}</span>
                  <Plus size={16} className="text-blue-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }