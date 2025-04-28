'use client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect, useState } from 'react';
import { fetchReportedUsers, deleteReport } from '../../../communicationManager/communicationManager';

export default function ReportedUsersPage() {
  const loading = useAdminAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!loading) {
      fetchReportedUsers().then(setReports);
    }
  }, [loading]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Usuarios Reportados</h1>
      {reports.length === 0 ? (
        <p>No hay usuarios reportados.</p>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="bg-white rounded shadow p-4 mb-4">
            <p className="font-semibold">{r.reportedUser.name} fue reportado por {r.reporter.name}</p>
            <p>Motivo: {r.reason}</p>
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => {
                deleteReport(r.id).then(() =>
                  setReports((prev) => prev.filter((x) => x.id !== r.id))
                );
              }}
            >
              Eliminar Reporte
            </button>
          </div>
        ))
      )}
    </div>
  );
}
