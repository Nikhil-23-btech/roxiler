import { useState } from 'react'
import AddStoreDialog from '../AddStoreDialog'
import { Button } from '@/components/ui/button'

export default function AddStoreDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Open Add Store Dialog</Button>
        <AddStoreDialog
          open={open}
          onClose={() => setOpen(false)}
          onAdd={(store) => console.log('Add store:', store)}
        />
      </div>
    </div>
  )
}
