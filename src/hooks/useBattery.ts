import { useState, useEffect } from 'react';

export interface BatteryState {
  level: number; // 0 to 100
  isCharging: boolean;
  isSupported: boolean;
}

export function useBattery(): BatteryState {
  const [battery, setBattery] = useState<BatteryState>({
    level: 85,
    isCharging: false,
    isSupported: false,
  });

  useEffect(() => {
    let mounted = true;
    const nav = navigator as any;

    if (nav.getBattery) {
      nav.getBattery().then((batt: any) => {
        if (!mounted) return;
        const update = () => {
          setBattery({
            level: Math.round(batt.level * 100),
            isCharging: batt.charging,
            isSupported: true,
          });
        };
        update();

        batt.addEventListener('levelchange', update);
        batt.addEventListener('chargingchange', update);

        return () => {
          batt.removeEventListener('levelchange', update);
          batt.removeEventListener('chargingchange', update);
        };
      }).catch(() => {
        // Not supported or permission restricted
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return battery;
}
