import { useState } from 'react'
import AddUserDialog from '../AddUserDialog'
import { Button } from '@/components/ui/button'

export default function AddUserDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Open Add User Dialog</Button>
        <AddUserDialog
          open={open}
          onClose={() => setOpen(false)}
          onAdd={(user) => console.log('Add user:', user)}
        />
      </div>
    </div>
  )
}
