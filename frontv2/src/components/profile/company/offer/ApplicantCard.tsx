import { useState } from 'react';
import { Building2, MapPin, CheckCircle2, XCircle, GraduationCap, Code2, Calendar, Mail, Clock, FileText, FileSpreadsheet, User, Phone, Clock3 } from 'lucide-react';
import config from '@/types/config';

interface Skill {
  id: number;
  name: string;
}

interface Education {
  institute: string;
}

interface Student {
  name: string;
  email: string;
  education: Education[];
  skills: Skill[];
  cv_url?: string;
  cover_letter_url?: string;
  profile_picture?: string;
  phone?: string;
  availability?: string;
}

interface Applicant {
  id: number;
  student: Student;
  email: string;
  status: string;
  created_at: string;
  pivot: {
    id: number;
    status: string;
    availability: string;
    created_at: string;
    cv_attachment: string;
    cover_letter_attachment: string;
  },
  education: Education[];
  skills: Skill[];
  cv_url?: string;
  cover_letter_url?: string;
  profile_picture?: string;
  phone?: string;
  availability?: string;
}

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusUpdate: (id: number, status: 'accept' | 'rejected') => void;
}

export default function ApplicantCard({ applicant, onStatusUpdate }: ApplicantCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format the application date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accept':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'accept':
        return 'Aceptado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden border`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator at top */}
      <div className={`h-1.5 ${
        applicant.pivot.status === 'accept' ? 'bg-green-500' : 
        applicant.pivot.status === 'rejected' ? 'bg-red-500' : 
        'bg-amber-500'
      }`} />
      
      <div className="p-6">
        {/* Header with profile picture, name and status */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            {applicant.student.profile_picture && !imageError ? (
              <img
                src={applicant.student.profile_picture}
                alt={applicant.student.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600">
                {applicant.student.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                getStatusColor(applicant.pivot.status)
              }`}>
                {getStatusLabel(applicant.pivot.status)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Contact info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
            <a href={`mailto:${applicant.email}`} className="hover:text-blue-600 transition-colors">
              {applicant.email}
            </a>
          </div>
          {applicant.student.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
              <a href={`tel:${applicant.student.phone}`} className="hover:text-blue-600 transition-colors">
                {applicant.student.phone}
              </a>
            </div>
          )}
          {applicant.pivot.availability && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock3 className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
              <span>{applicant.pivot.availability}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Education */}
          <div className="flex items-start">
            <GraduationCap className="flex-shrink-0 mt-0.5 mr-2 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">Educación</p>
              <p className="text-sm text-gray-800">{applicant.student.education[0]?.institute}</p>
            </div>
          </div>
          
          {/* Application date */}
          <div className="flex items-start">
            <Clock className="flex-shrink-0 mt-0.5 mr-2 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">Fecha de aplicación</p>
              <p className="text-sm text-gray-800">{formatDate(applicant.created_at)}</p>
            </div>
          </div>

          {/* Documents section */}
          {(applicant.pivot.cv_attachment || applicant.pivot.cover_letter_attachment) && (
            <div className="flex items-start">
              <FileText className="flex-shrink-0 mt-0.5 mr-2 h-5 w-5 text-gray-500" />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">Documentos</p>
                <div className="space-y-2">
                  {applicant.pivot.cv_attachment && (
                    <a
                      href={config.storageUrl + applicant.pivot.cv_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                      Curriculum Vitae
                    </a>
                  )}
                  {applicant.pivot.cover_letter_attachment && (
                    <a
                      href={config.storageUrl + applicant.pivot.cover_letter_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-1.5" />
                      Carta de Presentación
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Skills section */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <h4 className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-3 flex items-center">
            <Code2 className="h-4 w-4 mr-1.5" />
            Competencias
          </h4>
          <div className="flex flex-wrap gap-2">
            {applicant.student.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 transition-colors hover:bg-blue-100"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons for pending applications */}
        {applicant.pivot.status === 'pending' && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={() => onStatusUpdate(applicant.id, 'rejected')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
              Rechazar
            </button>
            <button
              onClick={() => onStatusUpdate(applicant.id, 'accept')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}