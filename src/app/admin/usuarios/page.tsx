'use client'

import { UserList } from '@/components/admin/users/UserList'

export default function AdminUsuariosPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <UserList />
    </div>
  )
}
