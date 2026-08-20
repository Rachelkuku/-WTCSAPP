import React from 'react';
import { View } from 'react-native';
import qrcode from 'qrcode-generator';

export function QRView({ value, size = 220 }: { value: string; size?: number }) {
  const matrix: boolean[][] = React.useMemo(() => {
    try {
      const qr = qrcode(0, 'M');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      return Array.from({ length: count }, (_, r) =>
        Array.from({ length: count }, (_, c) => qr.isDark(r, c))
      );
    } catch {
      return [];
    }
  }, [value]);

  if (!matrix.length) return null;
  const cell = size / matrix.length;

  return (
    <View style={{ width: size, height: size }}>
      {matrix.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((dark, c) => (
            <View key={c} style={{ width: cell, height: cell, backgroundColor: dark ? '#1A3A5C' : '#FFFFFF' }} />
          ))}
        </View>
      ))}
    </View>
  );
}
