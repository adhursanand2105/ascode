import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  change?: string;
  loading?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, gradient, change, loading }: StatsCardProps) {
  if (loading) {
    return (
      <Card className="glass-card border-gold-500/20 animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-charcoal-700 rounded w-20"></div>
              <div className="h-8 bg-charcoal-700 rounded w-16"></div>
              <div className="h-3 bg-charcoal-700 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-charcoal-700 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = change?.startsWith('+');
  const ChangeIcon = isPositiveChange ? ArrowUp : ArrowDown;

  return (
    <Card className="glass-card border-gold-500/20 hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-100">{value}</p>
            <p className="text-sm text-gray-400">{title}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-sm ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
            <ChangeIcon className="w-3 h-3 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
