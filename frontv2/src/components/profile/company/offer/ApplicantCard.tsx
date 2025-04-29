'use client'

import { useState } from 'react';
import { Building2, MapPin, Globe, Users, CheckCircle2, XCircle, GraduationCap, Code2, Calendar } from 'lucide-react';
interface Applicant {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  education: string;
  skills: string[];
  competencies: string[];
}

export default function ApplicantCard({ applicant, onStatusUpdate }: { 
  applicant: Applicant; 
  onStatusUpdate: (id: number, status: 'accepted' | 'rejected') => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
            <p className="text-sm text-gray-600">{applicant.email}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${applicant.status === 'accepted' ? 'bg-green-100 text-green-800' :
              applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'}`}
          >
            {applicant.status === 'accepted' ? 'Aceptado' :
             applicant.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="flex-shrink-0 mr-1.5 h-5 w-5" />
            {applicant.education}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
            Aplicó el {new Date(applicant.appliedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Code2 className="h-4 w-4 mr-1" />
            Habilidades técnicas
          </h4>
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Competencias</h4>
          <div className="flex flex-wrap gap-2">
            {applicant.competencies.map((competency) => (
              <span
                key={competency}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700"
              >
                {competency}
              </span>
            ))}
          </div>
        </div>

        {applicant.status === 'pending' && (
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={() => onStatusUpdate(applicant.id, 'accepted')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Aceptar
            </button>
            <button
              onClick={() => onStatusUpdate(applicant.id, 'rejected')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}