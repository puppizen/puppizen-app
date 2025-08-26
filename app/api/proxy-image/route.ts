import { NextRequest } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return new Response('Missing filePath parameter', { status: 400 });
  }

  const telegramUrl = `${TELEGRAM_API}/file/bot${BOT_TOKEN}/${filePath}`;

  try {
    const response = await fetch(telegramUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline',
      },
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return new Response('Error fetching image', { status: 500 });
  }
}