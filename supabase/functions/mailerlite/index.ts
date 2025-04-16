import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

console.log('Edge Function starting...')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400'
}

interface SubscribeRequest {
  email: string
  name: string
}

serve(async (req) => {
  console.log('Request received:', req.method)

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        message: `Method ${req.method} not allowed`
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // Get environment variables
    const MAILERLITE_API_KEY = Deno.env.get('MAILERLITE_API_KEY')
    const MAILERLITE_GROUP_ID = Deno.env.get('MAILERLITE_GROUP_ID')

    console.log('Checking environment variables:', {
      hasApiKey: !!MAILERLITE_API_KEY,
      hasGroupId: !!MAILERLITE_GROUP_ID
    })

    if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Server configuration error. Please try again later.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    // Parse request body
    let body
    try {
      body = await req.json()
      console.log('Request body:', body)
    } catch (e) {
      console.error('Failed to parse request body:', e)
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid request format. Please check your input and try again.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    const { email, name } = body

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email is required to join the challenge.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    console.log('Making MailerLite API request...')

    // Call MailerLite API
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        fields: { name },
        groups: [MAILERLITE_GROUP_ID]
      })
    })

    const data = await response.json()
    console.log('MailerLite API response:', {
      status: response.status,
      ok: response.ok,
      data
    })

    if (!response.ok) {
      // Handle specific MailerLite error cases
      if (response.status === 429) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again in a few minutes.'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        })
      }

      if (data.message?.includes('already exists')) {
        return new Response(JSON.stringify({
          success: false,
          message: "You're already signed up! Check your email for challenge materials."
        }), {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        })
      }

      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to subscribe. Please try again later.'
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully subscribed to the challenge'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Error in Edge Function:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Something unexpected happened. Please try again later.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}) 