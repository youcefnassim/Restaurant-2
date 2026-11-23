import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import {
  X,
  Camera,
  RotateCcw,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight,
  Download,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import '@google/model-viewer';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface FoodARViewerModalProps {
  product: Product;
  onClose: () => void;
  currency: string;
  language: 'fr' | 'ar' | 'en';
}

export const FoodARViewerModal: React.FC<FoodARViewerModalProps> = ({
  product,
  onClose,
  currency,
  language,
}) => {
  const { addItem } = useCart();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState<'camera_table' | '3d_studio' | 'webxr'>('camera_table');

  // Camera stream state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  // AR Dish positioning on the table
  const [position, setPosition] = useState({ x: 0, y: 30 }); // offset in px
  const [scale, setScale] = useState(1); // 1 = 100% real size (approx 28 cm)
  const [rotation, setRotation] = useState(0); // degrees
  const [tilt, setTilt] = useState(15); // perspective tilt

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);

  const realDiameter = product.dish_diameter_cm || 28;

  // Localized texts
  const t = {
    title: language === 'ar' ? 'عرض الطبق على طاولتك بالواقع المعزز' : 'Visualiser sur votre table en Réalité Augmentée',
    subtitle: language === 'ar' ? 'شاهد حجم ومظهر الطبق الحقيقي على طاولتك قبل الطلب' : 'Découvrez la taille réelle et l’aspect du plat directement sur votre table avant de commander.',
    tabCamera: language === 'ar' ? 'كاميرا حية على الطاولة' : 'Caméra Table en Direct',
    tab3D: language === 'ar' ? 'استوديو 3D ثلاثي الأبعاد' : 'Studio 3D 360°',
    tabWebXR: language === 'ar' ? 'تقنية WebXR الذكية' : 'Réalité Augmentée WebXR',
    realScale: language === 'ar' ? `الحجم الفعلي: قطر ${realDiameter} سم (1:1)` : `Échelle réelle 1:1 : ~${realDiameter} cm de diamètre`,
    dragTip: language === 'ar' ? 'اسحب بإصبعك لتحريك الطبق على الطاولة • دوّر لرؤية كل الزوايا' : 'Glissez le plat sur votre table • Ajustez la rotation et l’échelle',
    capturePhoto: language === 'ar' ? 'التقاط صورة للطبق على طاولتي' : 'Prendre une photo sur ma table',
    orderNow: language === 'ar' ? 'طلب هذا الطبق الآن' : 'Commander ce plat',
    resetPos: language === 'ar' ? 'إعادة ضبط الموضع' : 'Centrer le plat',
    camPermError: language === 'ar' ? 'تعذر تشغيل الكاميرا. يمكنك استخدام استوديو 3D للمشاهدة.' : 'Impossible d\'accéder à la caméra. Le Studio 3D 360° reste disponible.',
    permissionPrompt: language === 'ar' ? 'يرجى السماح بالوصول للكاميرا لتوجيهها نحو طاولتك' : 'Veuillez autoriser l’accès à la caméra pour voir le plat sur votre table.',
  };

  // Start camera for Live Table AR
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam non supportée sur ce navigateur');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Back camera on phones
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(t.camPermError);
      setActiveTab('3d_studio');
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'camera_table') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Handle Touch/Mouse Drag on Table
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y,
    });
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Capture table photo with dish
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video background
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw dish overlay
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = product.image_url;
    img.onload = () => {
      const dishWidth = 360 * scale;
      const dishHeight = 240 * scale;
      const posX = canvas.width / 2 - dishWidth / 2 + position.x;
      const posY = canvas.height / 2 - dishHeight / 2 + position.y;

      // Draw shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(posX + dishWidth / 2, posY + dishHeight - 15, dishWidth * 0.45, 25 * scale, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.filter = 'blur(12px)';
      ctx.fill();
      ctx.restore();

      // Draw dish
      ctx.save();
      ctx.translate(posX + dishWidth / 2, posY + dishHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -dishWidth / 2, -dishHeight / 2, dishWidth, dishHeight);
      ctx.restore();

      // Brand watermark
      ctx.fillStyle = 'rgba(231, 111, 53, 0.9)';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`MENUORA AR • ${product.name}`, 30, canvas.height - 30);

      const capturedUrl = canvas.toDataURL('image/png');
      setPhotoCaptured(capturedUrl);
    };
  };

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  const resetTransform = () => {
    setPosition({ x: 0, y: 30 });
    setScale(1);
    setRotation(0);
    setTilt(15);
  };

  // Fallback 3D model (using Google's official public sample or default)
  const model3dUrl =
    product.model_3d_url ||
    'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between">
      {/* Top Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary bg-primary/20 px-2 py-0.5 rounded-md">
                Réalité Augmentée 3D
              </span>
              <span className="text-xs text-gray-300 font-semibold hidden sm:inline">
                {t.realScale}
              </span>
            </div>
            <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight truncate">
              {product.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="px-4 py-2 flex justify-center z-20">
        <div className="bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 inline-flex gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('camera_table')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'camera_table'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t.tabCamera}</span>
          </button>

          <button
            onClick={() => setActiveTab('3d_studio')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === '3d_studio'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.tab3D}</span>
          </button>

          <button
            onClick={() => setActiveTab('webxr')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'webxr'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.tabWebXR}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {/* MODE 1: LIVE TABLE CAMERA AR */}
        {activeTab === 'camera_table' && (
          <div
            ref={stageRef}
            className="relative w-full h-full flex items-center justify-center select-none touch-none"
            onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMoveDrag(e.clientX, e.clientY)}
            onMouseUp={handleEndDrag}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 1) {
                handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleEndDrag}
          >
            {/* Live Camera Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />

            {/* Target Reticle / Table Grid Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-72 h-44 rounded-full border-2 border-dashed border-primary" />
            </div>

            {/* Simulated 3D Gourmet Dish Container on Table */}
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              className="relative z-10 transition-transform duration-75 ease-out select-none"
            >
              {/* Realistic Contact Shadow on Table Surface */}
              <div
                style={{
                  width: '320px',
                  height: '60px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 45%, transparent 75%)',
                  transform: `translateY(165px) scaleY(${0.4 + tilt * 0.02})`,
                  filter: 'blur(10px)',
                }}
                className="absolute inset-x-0 mx-auto pointer-events-none"
              />

              {/* The Realistic Culinary Plate */}
              <div className="relative w-72 sm:w-80 rounded-full p-2 bg-gradient-to-b from-white/90 to-gray-200 shadow-2xl border-4 border-white/60">
                <div className="relative rounded-full overflow-hidden aspect-square border-2 border-gray-300 shadow-inner">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover pointer-events-none scale-105"
                  />
                  {/* Glass / ceramic highlight overlay for real lighting effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                </div>

                {/* 1:1 Scale Badge Pill */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-secondary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1 whitespace-nowrap">
                  <Maximize2 className="w-3 h-3 text-primary" />
                  <span>~{realDiameter} cm (Échelle 1:1)</span>
                </div>
              </div>
            </div>

            {/* Instruction tooltip */}
            <div className="absolute top-4 inset-x-4 max-w-sm mx-auto bg-black/60 backdrop-blur-md text-white text-xs text-center py-2 px-3 rounded-full border border-white/10 pointer-events-none z-10">
              {t.dragTip}
            </div>

            {/* Floating Camera Floating Action Controls */}
            <div className="absolute bottom-28 inset-x-4 flex justify-between items-center max-w-md mx-auto z-20 pointer-events-auto">
              <button
                onClick={resetTransform}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 border border-white/10 transition"
                title={t.resetPos}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Shutter photo button */}
              <button
                onClick={handleCapturePhoto}
                className="w-16 h-16 rounded-full bg-white text-secondary flex items-center justify-center shadow-2xl ring-4 ring-primary/40 active:scale-95 transition"
                title={t.capturePhoto}
              >
                <Camera className="w-7 h-7 text-primary" />
              </button>

              {/* Scale / Zoom toggle */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 border border-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 border border-white/10"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation Slider */}
            <div className="absolute bottom-20 inset-x-8 max-w-xs mx-auto z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-[10px] text-gray-300 font-bold shrink-0">Rotation</span>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-white/20 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-primary font-mono font-bold shrink-0">
                {rotation}°
              </span>
            </div>
          </div>
        )}

        {/* MODE 2: 3D 360° STUDIO VIEWER */}
        {activeTab === '3d_studio' && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-lg h-[460px] bg-gradient-to-b from-gray-900 to-black rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
              <div className="absolute top-4 left-4 text-left z-10">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Studio Virtuel 360°
                </span>
                <span className="text-xs text-gray-400">
                  Faites tourner avec la souris ou au doigt
                </span>
              </div>

              {/* Interactive 3D Model with Model Viewer */}
              {React.createElement('model-viewer', {
                src: model3dUrl,
                alt: product.name,
                'auto-rotate': true,
                'camera-controls': true,
                'shadow-intensity': '2',
                exposure: '1',
                'environment-image': 'neutral',
                style: { width: '100%', height: '100%' },
              })}

              <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-xs text-gray-400 bg-black/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                <span>Diamètre assiette : ~{realDiameter} cm</span>
                <span className="text-primary font-bold">{product.price} {currency}</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: NATIVE WEBXR / QUICK LOOK */}
        {activeTab === 'webxr' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-white">
                Réalité Augmentée Haute Définition
              </h4>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Sur smartphone compatible (Android ARCore ou iPhone iOS Quick Look), ce mode ouvre directement le moteur de Réalité Augmentée pour projeter le plat en 3D avec détection automatique de la surface de votre table.
              </p>
            </div>

            <div className="w-full">
              {React.createElement(
                'model-viewer',
                {
                  src: model3dUrl,
                  ar: true,
                  'ar-modes': 'webxr scene-viewer quick-look',
                  'camera-controls': true,
                  alt: product.name,
                  style: { width: '100%', height: '220px', borderRadius: '24px' },
                },
                React.createElement(
                  'button',
                  {
                    slot: 'ar-button',
                    className:
                      'w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2',
                  },
                  React.createElement(Camera, { className: 'w-5 h-5' }),
                  React.createElement('span', null, "Lancer l'AR sur smartphone")
                )
              )}
            </div>

            <p className="text-[11px] text-gray-400">
              Si votre téléphone ne supporte pas WebXR, utilisez l'onglet « Caméra Table en Direct » pour voir le plat sur votre table immédiatement.
            </p>
          </div>
        )}
      </div>

      {/* Captured Photo Preview Modal */}
      {photoCaptured && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 max-w-sm w-full text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="font-extrabold text-xs text-secondary">Votre plat sur votre table !</span>
              <button onClick={() => setPhotoCaptured(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <img src={photoCaptured} alt="Captured on table" className="w-full rounded-2xl shadow-md" />

            <div className="flex gap-2">
              <a
                href={photoCaptured}
                download={`menuora-${product.name}-sur-ma-table.png`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white font-bold py-2.5 rounded-xl text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la photo</span>
              </a>
              <button
                onClick={() => setPhotoCaptured(null)}
                className="px-4 py-2.5 bg-gray-100 font-bold text-xs rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Order & Close Action Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-20 flex items-center justify-between gap-4">
        <div className="text-left text-white" dir="ltr">
          <div className="text-xs text-gray-400">{product.name}</div>
          <div className="text-lg font-black text-primary">
            {product.price.toLocaleString('fr-FR')} {currency}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-primary/30 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.orderNow}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
