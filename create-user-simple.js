const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://exzeayeoosiabwhgyquq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4emVheWVvb3NpYWJ3aGd5cXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3NDcwOSwiZXhwIjoyMDY5NTUwNzA5fQ.Qgwxa5JxhvV05CZhPeG-Ag7FpJiRO3hLaIJxN6k8708'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function deleteAndCreateUser() {
  console.log('Deleting old user...\n')

  // Delete the old user first
  const { data: users } = await supabase.auth.admin.listUsers()
  const oldUser = users.users.find(u => u.email === 'sedwards@xlbenefits.com')

  if (oldUser) {
    await supabase.auth.admin.deleteUser(oldUser.id)
    console.log('✅ Old user deleted\n')
  }

  console.log('Creating new user with simple password...\n')

  // Create user with simple password (no special characters)
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'sedwards@xlbenefits.com',
    password: 'xlbenefits123',  // Simple password without special chars
    email_confirm: true
  })

  if (error) {
    console.error('❌ User creation failed:')
    console.error('Error:', error.message)
  } else {
    console.log('✅ User created successfully!')
    console.log('Email:', data.user.email)
    console.log('Password: xlbenefits123')
    console.log('ID:', data.user.id)
    console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No')
  }
}

deleteAndCreateUser()
