import { useState } from 'react'
import ChangePasswordDialog from '../ChangePasswordDialog'
import { Button } from '@/components/ui/button'

export default function ChangePasswordDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Open Change Password Dialog</Button>
        <ChangePasswordDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(current, newPass) => console.log('Change password:', { current, newPass })}
        />
      </div>
    </div>
  )
}
