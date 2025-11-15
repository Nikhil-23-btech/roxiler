import { useState } from 'react'
import RatingStars from '../RatingStars'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RatingStarsExample() {
  const [rating, setRating] = useState(3)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rating Stars Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm mb-2">Small (Display Only)</p>
            <RatingStars rating={4.5} size="sm" />
          </div>
          <div>
            <p className="text-sm mb-2">Medium (Display Only)</p>
            <RatingStars rating={3.8} size="md" />
          </div>
          <div>
            <p className="text-sm mb-2">Large (Display Only)</p>
            <RatingStars rating={5} size="lg" />
          </div>
          <div>
            <p className="text-sm mb-2">Interactive (Click to rate)</p>
            <RatingStars 
              rating={rating} 
              size="lg" 
              interactive 
              onRatingChange={setRating}
            />
            <p className="text-xs text-muted-foreground mt-2">Current rating: {rating}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
