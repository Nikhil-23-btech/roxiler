import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  storeName: string;
  currentRating?: number;
  onSubmit: (rating: number) => void;
}

export default function RatingDialog({
  open,
  onClose,
  storeName,
  currentRating = 0,
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(currentRating);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{currentRating ? "Update" : "Submit"} Rating</DialogTitle>
          <DialogDescription>
            Rate your experience at {storeName}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <p className="text-sm mb-4 text-center">Click on the stars to rate (1-5)</p>
          <div className="flex justify-center">
            <RatingStars rating={rating} size="lg" interactive onRatingChange={setRating} />
          </div>
          {rating > 0 && (
            <p className="text-center mt-4 text-lg font-semibold" data-testid="text-selected-rating">
              Your rating: {rating} {rating === 1 ? "star" : "stars"}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            data-testid="button-submit"
          >
            {currentRating ? "Update" : "Submit"} Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
