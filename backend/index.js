const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Register user
app.post('/register', async (req, res) => {
  const { full_name, email, phone, date_of_birth, nationality } = req.body
  const verification_code = uuidv4()

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, email, phone, date_of_birth, nationality }])
    .select()

  if (error) return res.status(400).json({ error: error.message })

  await supabase.from('verifications')
    .insert([{ user_id: data[0].id, verification_code }])

  res.json({ 
    message: 'Registration successful',
    verification_link: `https://identium.onrender.com/verify.html?code=${verification_code}`
  })
})

// Verify identity
app.get('/verify/:code', async (req, res) => {
  const { code } = req.params

  const { data, error } = await supabase
    .from('verifications')
    .select('*, users(*)')
    .eq('verification_code', code)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Identity not found' })

  res.json({
    verified: true,
    name: data.users.full_name,
    nationality: data.users.nationality,
    status: data.status
  })
})
// Lookup user by email
app.get('/lookup', async (req, res) => {
  const { email } = req.query

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) return res.status(404).json({ error: 'Identity not found' })

  const { data: verification } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  res.json({ user, verification })
})
app.listen(process.env.PORT, () => {
  console.log(`IDentium backend running on port ${process.env.PORT}`)
})