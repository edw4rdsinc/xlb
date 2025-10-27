const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://exzeayeoosiabwhgyquq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4emVheWVvb3NpYWJ3aGd5cXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3NDcwOSwiZXhwIjoyMDY5NTUwNzA5fQ.Qgwxa5JxhvV05CZhPeG-Ag7FpJiRO3hLaIJxN6k8708'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  console.log('Creating user with service role key...\n')

  // Create user
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'sedwards@xlbenefits.com',
    password: 'xlbenefit5!',
    email_confirm: true  // Auto-confirm email
  })

  if (error) {
    console.error('❌ User creation failed:')
    console.error('Error:', error.message)
    console.error('Status:', error.status)
    console.error('Code:', error.code)
  } else {
    console.log('✅ User created successfully!')
    console.log('Email:', data.user.email)
    console.log('ID:', data.user.id)
    console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No')
  }
}

createUser()
