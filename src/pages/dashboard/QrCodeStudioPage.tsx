import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import {
  QrCode as QrIcon,
  Download,
  Printer,
  Table,
  CheckCircle2,
  ExternalLink,
  Plus,
  Palette,
  Sparkles,
  Share2,
} from 'lucide-react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

export const QrCodeStudioPage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const existingQrs = dataService.getQrCodes(activeRestaurant.id);
  const theme = dataService.getTheme(activeRestaurant.id);

  const [selectedTable, setSelectedTable] = useState<number | 'general'>('general');
  const [qrColor, setQrColor] = useState(theme.primary_color || '#E76F35');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [tableCountInput, setTableCountInput] = useState(activeRestaurant.table_count.toString());

  const canvasRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Compute public menu URL
  const baseUrl = window.location.origin;
  const menuUrl =
    selectedTable === 'general'
      ? `${baseUrl}/menu/${activeRestaurant.slug}`
      : `${baseUrl}/menu/${activeRestaurant.slug}?table=${selectedTable}`;

  // Download high-resolution PNG
  const handleDownloadPng = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `menuora-qr-${activeRestaurant.slug}-${selectedTable === 'general' ? 'global' : `table-${selectedTable}`}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(svgBlob);
    link.download = `menuora-qr-${activeRestaurant.slug}-${selectedTable === 'general' ? 'global' : `table-${selectedTable}`}.svg`;
    link.click();
  };

  // Print Tent Card / Table Sticker
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Printable Area (Visible only when printing) */}
      <div className="hidden print:block print-area p-8 max-w-sm mx-auto text-center border-2 border-dashed border-gray-400 rounded-3xl">
        <div className="text-center space-y-4">
          <div className="font-extrabold text-2xl uppercase tracking-tight text-secondary">
            {activeRestaurant.name}
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {selectedTable === 'general' ? 'Menu Digital Interactif' : `Bienvenue à la Table N° ${selectedTable}`}
          </div>

          <div className="py-4 flex justify-center">
            <QRCodeCanvas
              value={menuUrl}
              size={240}
              level="H"
              fgColor={qrColor}
              imageSettings={
                includeLogo
                  ? {
                      src: activeRestaurant.logo_url,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>

          <div className="font-bold text-lg text-primary">
            Scannez-moi pour découvrir notre menu
          </div>
          <p className="text-xs text-gray-500">
            Visez le QR Code avec l'appareil photo de votre smartphone • Sans téléchargement
          </p>
          <div className="pt-2 text-[10px] text-gray-400 font-mono">
            Powered by MENUORA.dz
          </div>
        </div>
      </div>

      {/* Screen Interface (Hidden when printing) */}
      <div className="no-print space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-secondary">Studio QR Code & Supports de table</h2>
            <p className="text-xs text-text-muted">
              Générez, personnalisez et imprimez vos QR Codes pour chaque table de votre restaurant.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition self-start"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>Imprimer le chevalet de table</span>
          </button>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Table Selector */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Table className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-secondary">Destination du QR Code</h3>
                    <p className="text-[11px] text-text-muted">Choisissez si le QR code est général ou dédié à une table précise.</p>
                  </div>
                </div>
              </div>

              {/* Table Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTable('general')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedTable === 'general'
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-bg text-secondary border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  QR Général (Entrée / Comptoir)
                </button>

                {Array.from({ length: Math.min(24, activeRestaurant.table_count || 15) }, (_, i) => i + 1).map(
                  (tableNum) => (
                    <button
                      key={tableNum}
                      type="button"
                      onClick={() => setSelectedTable(tableNum)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                        selectedTable === tableNum
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'bg-bg text-secondary border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Table {tableNum}
                    </button>
                  )
                )}
              </div>

              <div className="pt-2 text-xs text-text-muted flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>
                  Lorsqu'un client scannera le QR de la <strong>Table {selectedTable === 'general' ? 'Générale' : selectedTable}</strong>, son numéro de table sera automatiquement pré-rempli dans sa commande WhatsApp.
                </span>
              </div>
            </div>

            {/* Customization Options */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-secondary">Style visuel du QR Code</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Couleur du QR Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-secondary">
                    <input
                      type="checkbox"
                      checked={includeLogo}
                      onChange={(e) => setIncludeLogo(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span>Intégrer le logo du restaurant au centre</span>
                  </label>
                  <p className="text-[11px] text-text-muted mt-1 ml-6">
                    Affiche une vignette haute définition de votre logo au milieu du QR Code.
                  </p>
                </div>
              </div>
            </div>

            {/* Permanent Link Info */}
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-3xl space-y-2">
              <span className="text-xs font-extrabold text-primary uppercase tracking-wider block">
                URL Permanente et Sécurisée
              </span>
              <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-primary/20 text-xs font-mono text-secondary">
                <span className="truncate">{menuUrl}</span>
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:text-primary transition shrink-0"
                  title="Ouvrir dans un nouvel onglet"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                </a>
              </div>
              <p className="text-[11px] text-text-muted">
                Cette URL reste identique pour toujours. Même si vous remaniez toute votre carte, les QR Codes déjà imprimés continueront de fonctionner parfaitement.
              </p>
            </div>
          </div>

          {/* Right Preview & Export Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Tent Card Preview */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md text-center space-y-5">
              <span className="text-[11px] font-extrabold text-text-muted uppercase tracking-wider block">
                Modèle Chevalet de Table
              </span>

              {/* Tent Card Stand Box */}
              <div
                ref={canvasRef}
                className="bg-bg p-6 rounded-3xl border-2 border-dashed border-gray-200 inline-block shadow-inner mx-auto max-w-[280px] w-full"
              >
                <div className="font-extrabold text-base text-secondary truncate">
                  {activeRestaurant.name}
                </div>
                <div className="text-[11px] font-bold text-primary mb-3">
                  {selectedTable === 'general' ? 'Menu Digital' : `Table N° ${selectedTable}`}
                </div>

                {/* Live Canvas for PNG export */}
                <div className="flex justify-center my-2 bg-white p-3 rounded-2xl shadow-sm">
                  <QRCodeCanvas
                    id="qr-code-canvas"
                    value={menuUrl}
                    size={190}
                    level="H"
                    fgColor={qrColor}
                    imageSettings={
                      includeLogo
                        ? {
                            src: activeRestaurant.logo_url,
                            x: undefined,
                            y: undefined,
                            height: 38,
                            width: 38,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                {/* Hidden SVG element for vector download */}
                <div className="hidden">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={menuUrl}
                    size={500}
                    level="H"
                    fgColor={qrColor}
                  />
                </div>

                <div className="font-black text-xs text-secondary mt-3">
                  Scannez-moi pour découvrir notre menu
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  Appareil photo smartphone • Instantané
                </div>
              </div>

              {/* Download CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadPng}
                  className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-3 rounded-xl shadow-sm shadow-primary/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>PNG Haute Résolution</span>
                </button>

                <button
                  onClick={handleDownloadSvg}
                  className="flex items-center justify-center gap-1.5 bg-secondary hover:bg-gray-800 text-white text-xs font-bold py-3 px-3 rounded-xl shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Vectoriel SVG</span>
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-secondary text-xs font-bold py-2.5 rounded-xl transition"
              >
                <Printer className="w-4 h-4 text-primary" />
                <span>Imprimer ce modèle de table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

