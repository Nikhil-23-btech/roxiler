import DataTable from '../DataTable'
import { Badge } from '@/components/ui/badge'

export default function DataTableExample() {
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (value: string) => (
      <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )},
    { key: 'address', label: 'Address' },
  ]

  const data = [
    { name: 'John Doe Smith Anderson', email: 'john@example.com', role: 'admin', address: '123 Main St, New York' },
    { name: 'Jane Marie Thompson Wilson', email: 'jane@example.com', role: 'user', address: '456 Oak Ave, Boston' },
    { name: 'Bob Johnson Williams Brown', email: 'bob@example.com', role: 'user', address: '789 Pine Rd, Chicago' },
  ]

  const filterOptions = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Data Table Example</h2>
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search users..."
          filterOptions={filterOptions}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>
    </div>
  )
}
