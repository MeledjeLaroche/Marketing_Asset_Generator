import { useState } from "react";
import { generateBaseProduct, generateMarketingAsset, AspectRatio, Resolution } from "./lib/ai";
import { Loader2, Download, Package, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function MainApp() {
  const [productDesc, setProductDesc] = useState("");
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [loadingBase, setLoadingBase] = useState(false);

  const [supportType, setSupportType] = useState("Panneau d'affichage urbain");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  
  const [assetImage, setAssetImage] = useState<string | null>(null);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supports = [
    "Panneau d'affichage urbain",
    "Post Instagram stylisé",
    "Couverture de Magazine",
    "Abribus lumineux",
    "Bannière Publicitaire Web"
  ];

  const aspectRatios: AspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9"];
  const resolutions: Resolution[] = ["512px", "1K", "2K", "4K"];

  const handleGenerateBase = async () => {
    if (!productDesc) return;
    setLoadingBase(true);
    setError(null);
    try {
      const b64 = await generateBaseProduct(productDesc);
      setBaseImage(`data:image/png;base64,${b64}`);
      setAssetImage(null); // Reset asset on new product calculation
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de la création du produit.");
    } finally {
      setLoadingBase(false);
    }
  };

  const handleGenerateAsset = async () => {
    if (!baseImage) return;
    setLoadingAsset(true);
    setError(null);
    try {
      const cleanB64 = baseImage.split(',')[1];
      const b64 = await generateMarketingAsset(cleanB64, supportType, resolution, aspectRatio);
      setAssetImage(`data:image/png;base64,${b64}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de la génération du support.");
    } finally {
      setLoadingAsset(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 flex flex-col lg:flex-row gap-6">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">NB</div>
          <h1 className="text-xl font-bold tracking-tight">Nano-Banana <span className="text-indigo-400">Studio</span></h1>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Produit à générer</label>
            <textarea 
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Décrivez votre produit..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-500"
            />
          </div>
          
          <button 
            disabled={loadingBase || productDesc.trim() === ""}
            onClick={handleGenerateBase}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/20 transition-all mt-2 flex items-center justify-center gap-2"
          >
            {loadingBase ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer le produit de base"}
          </button>

          {error && (
            <div className="mt-2 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}
        </div>

        <AnimatePresence>
          {baseImage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Produit de référence</label>
              <img src={baseImage} alt="Base Product" className="w-full h-auto aspect-square object-contain bg-slate-950 rounded-xl border border-slate-800" />
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Main Canvas (Bento Grid) */}
      <main className="flex-1 grid grid-cols-12 auto-rows-max lg:auto-rows-[minmax(120px,auto)] gap-4">
        
        {/* Configurations Box */}
        <div className={`col-span-12 xl:col-span-5 lg:row-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 transition-opacity duration-300 ${!baseImage ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Configuration</span>
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Type de Support</label>
               <select 
                 value={supportType}
                 onChange={(e) => setSupportType(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
               >
                 {supports.map(s => (
                   <option key={s} value={s}>{s}</option>
                 ))}
               </select>
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Format (Ratio)</label>
               <select 
                 value={aspectRatio}
                 onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
               >
                 {aspectRatios.map(r => (
                   <option key={r} value={r}>{r} {r === '1:1'? '(Carré)' : r === '16:9'? '(Paysage)' : r === '9:16'? '(Portrait)' : ''}</option>
                 ))}
               </select>
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Résolution</label>
               <div className="grid grid-cols-4 gap-2">
                 {resolutions.map(r => (
                   <button 
                     key={r}
                     onClick={() => setResolution(r)}
                     className={`p-2 rounded-lg text-xs font-bold transition-all ${resolution === r ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                   >
                     {r}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <button 
            disabled={loadingAsset || !baseImage}
            onClick={handleGenerateAsset}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-900/20 transition-all mt-auto flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAsset ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ImageIcon className="w-4 h-4" /> Générer le Support</>}
          </button>
        </div>

        {/* Featured Viewer / Preview */}
        <div className="col-span-12 xl:col-span-7 lg:row-span-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl group flex flex-col min-h-[400px]">
          <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Aperçu ({supportType})</span>
          </div>
          
          <div className="w-full h-full flex flex-col items-center justify-center p-6 lg:p-12 bg-slate-950/50">
             {loadingAsset && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-30">
                 <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
                 <div className="font-bold text-indigo-400 uppercase tracking-widest text-sm">Génération en cours...</div>
               </div>
             )}
             
             {!assetImage && !loadingAsset && (
               <div className="text-slate-600 font-bold uppercase tracking-widest text-center">
                 <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                 Résultat visuel<br/>
                 <span className="text-xs font-normal opacity-70">L'image finale apparaîtra ici</span>
               </div>
             )}

             {assetImage && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="relative w-full h-full flex items-center justify-center"
               >
                 <img src={assetImage} alt="Generated Asset" className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl border border-slate-700/50" />
                 <div className="absolute bottom-[-1rem] left-0 right-0 z-20 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-sm font-light italic text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-slate-700">"Image générée avec Nano-Banana"</p>
                 </div>
               </motion.div>
             )}
          </div>
        </div>

        {/* Stats / Download Box */}
        <div className={`col-span-12 xl:col-span-5 lg:row-span-2 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-white transition-opacity ${!assetImage ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Statut</p>
            <p className="text-2xl font-bold mt-1">{assetImage ? "Prêt à exporter" : "En attente"}</p>
          </div>
          <div className="space-y-2 mt-6 mb-6 lg:m-0">
            <div className="flex justify-between text-xs">
              <span>Cohérence</span>
              <span>{assetImage ? "98%" : "0%"}</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: assetImage ? '98%' : '0%' }}></div>
            </div>
          </div>
          <a 
            href={assetImage || "#"}
            download={assetImage ? "marketing-asset.png" : undefined}
            className={`w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-2 transition-all ${!assetImage ? 'opacity-80' : 'hover:bg-indigo-50 shadow-lg cursor-pointer'}`}
          >
            <Download className="w-4 h-4" />
            Télécharger le support
          </a>
        </div>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <MainApp />
  );
}
