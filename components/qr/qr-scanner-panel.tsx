'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseAssetIdFromQrValue } from '@/lib/qr/parse-asset-id';
import { cn } from '@/lib/utils';

type CameraErrorKind = 'denied' | 'unavailable' | null;

export function QrScannerPanel() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(false);

  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState<CameraErrorKind>(null);
  const [decodeHint, setDecodeHint] = useState<string | null>(null);

  const stopStreamOnly = useCallback(() => {
    activeRef.current = false;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setActive(false);
  }, []);

  const finishWithAssetId = useCallback(
    (assetId: string) => {
      activeRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const v = videoRef.current;
      if (v) v.srcObject = null;
      setActive(false);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch {
          /* ignore */
        }
      }
      router.push(`/assets/${encodeURIComponent(assetId)}`);
    },
    [router]
  );

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setDecodeHint(null);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setCameraError('unavailable');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'environment' },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      video.srcObject = stream;
      await video.play();
      activeRef.current = true;
      setActive(true);
    } catch (e: unknown) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const name =
        e && typeof e === 'object' && 'name' in e
          ? String((e as { name: string }).name)
          : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraError('denied');
      } else {
        setCameraError('unavailable');
      }
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    let raf = 0;
    let lastScan = 0;

    const loop = () => {
      if (!activeRef.current) return;

      const video = videoRef.current;
      const now = performance.now();

      if (video && video.readyState >= 2 && now - lastScan > 140) {
        lastScan = now;
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          const maxDim = 720;
          const scale = Math.min(1, maxDim / Math.max(w, h));
          const cw = Math.max(1, Math.floor(w * scale));
          const ch = Math.max(1, Math.floor(h * scale));

          canvas!.width = cw;
          canvas!.height = ch;
          const ctx = canvas!.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, cw, ch);
            const imageData = ctx.getImageData(0, 0, cw, ch);
            const code = jsQR(imageData.data, cw, ch, {
              inversionAttempts: 'attemptBoth',
            });
            if (code?.data) {
              const assetId = parseAssetIdFromQrValue(code.data);
              if (assetId) {
                finishWithAssetId(assetId);
                return;
              }
              setDecodeHint(
                'อ่าน QR ได้แล้ว แต่ข้อมูลไม่ใช่รหัสครุภัณฑ์ที่ระบบรองรับ'
              );
            }
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [active, finishWithAssetId]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleRescan = async () => {
    stopStreamOnly();
    setDecodeHint(null);
    await startCamera();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={cn(
          'relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-2 bg-black/90',
          cameraError ? 'border-destructive/50' : 'border-muted-foreground/20'
        )}
      >
        <video
          ref={videoRef}
          className={cn(
            'h-full w-full object-cover',
            !active && 'hidden'
          )}
          playsInline
          muted
          autoPlay
        />

        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/50 p-6 text-center">
            <Camera className="size-12 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              กดปุ่มด้านล่างเพื่อเปิดกล้องและสแกน QR
            </p>
          </div>
        )}

        {active ? (
          <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
            <div className="absolute -top-1 -left-1 size-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 size-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 size-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 size-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>
        ) : null}
      </div>

      {cameraError === 'denied' ? (
        <div
          className="flex max-w-sm items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์
            แล้วลองใหม่
          </span>
        </div>
      ) : null}

      {cameraError === 'unavailable' ? (
        <div
          className="flex max-w-sm items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-900 dark:text-amber-200"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            ไม่พบกล้องหรืออุปกรณ์ไม่รองรับ ลองใช้คีย์บอร์ดกรอกรหัสด้านแท็บ
            &quot;กรอกรหัส&quot;
          </span>
        </div>
      ) : null}

      {decodeHint && !cameraError ? (
        <p className="max-w-sm text-center text-sm text-amber-700 dark:text-amber-300">
          {decodeHint}
        </p>
      ) : null}

      {active && !cameraError ? (
        <p className="text-center text-xs text-muted-foreground">
          วาง QR ให้อยู่ในกรอบ ระบบจะนำทางอัตโนมัติเมื่ออ่านได้
        </p>
      ) : null}

      <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        {!active ? (
          <Button
            size="lg"
            className="w-full"
            type="button"
            onClick={() => void startCamera()}
          >
            <Camera className="mr-2 size-5" />
            เปิดกล้อง
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:flex-1"
              type="button"
              onClick={stopStreamOnly}
            >
              หยุดกล้อง
            </Button>
            <Button
              size="lg"
              className="w-full sm:flex-1"
              type="button"
              onClick={() => void handleRescan()}
            >
              <RefreshCw className="mr-2 size-5" />
              สแกนใหม่
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
