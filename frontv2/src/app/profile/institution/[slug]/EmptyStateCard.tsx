import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ icon, title, subtitle }) => (
  <Card className="flex flex-col items-center justify-center py-10">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">{title}</h3>
    {subtitle && <p className="text-gray-500 text-center text-sm">{subtitle}</p>}
  </Card>
); 