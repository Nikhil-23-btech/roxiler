import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StoreCardProps {
  name: string;
  address: string;
  rating: number;
  userRating?: number;
  onRate: () => void;
}

export default function StoreCard({ name, address, rating, userRating, onRate }: StoreCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader>
        <CardTitle className="text-lg" data-testid="text-store-name">{name}</CardTitle>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{address}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Overall Rating</p>
          <RatingStars rating={rating} size="md" />
        </div>
        {userRating !== undefined && (
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <div className="flex items-center gap-2">
              <RatingStars rating={userRating} size="md" interactive={false} />
              <Badge variant="secondary">
                <Star className="w-3 h-3 mr-1" />
                {userRating}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onRate} 
          className="w-full" 
          variant={userRating ? "outline" : "default"}
          data-testid="button-rate"
        >
          {userRating ? "Update Rating" : "Rate Store"}
        </Button>
      </CardFooter>
    </Card>
  );
}
