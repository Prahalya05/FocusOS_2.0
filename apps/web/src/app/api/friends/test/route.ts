import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY
    const isConfigured = resendApiKey && resendApiKey !== 're_placeholder_key_for_build'

    return NextResponse.json({ 
      status: isConfigured ? 'Email API configured' : 'Email API not configured',
      hasApiKey: isConfigured,
      message: isConfigured 
        ? 'Email functionality is ready and configured.' 
        : 'Email functionality is not configured. Create a .env.local file with your RESEND_API_KEY to start sending emails.'
    })

  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
