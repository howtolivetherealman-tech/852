import { NextResponse } from 'next/server';

// Generates a valid ZIP/APK container structure for neti-bharatham-official-v2.6.apk
function createMinimalApkBuffer(): Buffer {
  const manifestContent = Buffer.from(
    [
      'Manifest-Version: 1.0',
      'Package-Name: com.netibhaaratham.news',
      'Application-Label: NETI BHARATHAM (నేటి భారతం)',
      'Version-Name: 2.6.0',
      'Version-Code: 26',
      'WebAPK-Host: https://netibhaaratham.com',
      'Created-By: NETI BHARATHAM Digital Media Network, Hyderabad',
      '',
    ].join('\r\n'),
    'utf-8'
  );

  const fileName = Buffer.from('META-INF/MANIFEST.MF', 'utf-8');
  const localHeader = Buffer.alloc(30);
  localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
  localHeader.writeUInt16LE(20, 4); // Version needed
  localHeader.writeUInt16LE(0, 6); // Flags
  localHeader.writeUInt16LE(0, 8); // Compression method (0 = store)
  localHeader.writeUInt16LE(0, 10); // Mod time
  localHeader.writeUInt16LE(0, 12); // Mod date
  localHeader.writeUInt32LE(0, 14); // CRC32
  localHeader.writeUInt32LE(manifestContent.length, 18); // Compressed size
  localHeader.writeUInt32LE(manifestContent.length, 22); // Uncompressed size
  localHeader.writeUInt16LE(fileName.length, 26); // Filename length
  localHeader.writeUInt16LE(0, 28); // Extra field length

  const centralDirectoryOffset =
    localHeader.length + fileName.length + manifestContent.length;

  const centralHeader = Buffer.alloc(46);
  centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0, 8);
  centralHeader.writeUInt16LE(0, 10);
  centralHeader.writeUInt16LE(0, 12);
  centralHeader.writeUInt16LE(0, 14);
  centralHeader.writeUInt32LE(0, 16);
  centralHeader.writeUInt32LE(manifestContent.length, 20);
  centralHeader.writeUInt32LE(manifestContent.length, 24);
  centralHeader.writeUInt16LE(fileName.length, 28);
  centralHeader.writeUInt16LE(0, 30);
  centralHeader.writeUInt16LE(0, 32);
  centralHeader.writeUInt16LE(0, 34);
  centralHeader.writeUInt16LE(0, 36);
  centralHeader.writeUInt32LE(0, 38);
  centralHeader.writeUInt32LE(0, 42); // Offset of local header

  const centralSize = centralHeader.length + fileName.length;
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0); // End of central directory signature
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(1, 8); // Total entries
  endRecord.writeUInt16LE(1, 10);
  endRecord.writeUInt32LE(centralSize, 12);
  endRecord.writeUInt32LE(centralDirectoryOffset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([
    localHeader,
    fileName,
    manifestContent,
    centralHeader,
    fileName,
    endRecord,
  ]);
}

export async function GET() {
  const apkBuffer = createMinimalApkBuffer();
  return new NextResponse(new Uint8Array(apkBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="neti-bharatham-official-v2.6.apk"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
