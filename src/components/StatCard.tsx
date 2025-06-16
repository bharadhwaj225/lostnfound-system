import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  className?: string;
}

const StatCard = ({ title, value, icon, className = "" }: StatCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h4 className="text-2xl sm:text-3xl font-bold">{value}</h4>
          </div>
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
