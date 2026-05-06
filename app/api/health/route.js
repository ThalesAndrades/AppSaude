import { NextResponse } from 'next/server';
import { pingMongoDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = { mongo: false };
  let ok = true;

  try {
    checks.mongo = await pingMongoDb();
    if (!checks.mongo) ok = false;
  } catch (e) {
    ok = false;
    checks.mongoError = e?.message || 'erro';
  }

  return NextResponse.json(
    {
      ok,
      service: 'mettafit',
      time: new Date().toISOString(),
      checks,
    },
    { status: ok ? 200 : 503 }
  );
}

export async function HEAD() {
  try {
    const ok = await pingMongoDb();
    return new NextResponse(null, { status: ok ? 200 : 503 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
