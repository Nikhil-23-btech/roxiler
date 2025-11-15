import { useState } from 'react'
import RatingDialog from '../RatingDialog'
import { Button } from '@/components/ui/button'

export default function RatingDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Open Rating Dialog</Button>
        <RatingDialog
          open={open}
          onClose={() => setOpen(false)}
          storeName="Tech Electronics Store"
          currentRating={3}
          onSubmit={(rating) => console.log('Submit rating:', rating)}
        />
      </div>
    </div>
  )
}
