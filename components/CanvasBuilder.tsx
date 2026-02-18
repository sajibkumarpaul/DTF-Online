
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  DTF_PRICE_PER_METER, 
  INCH_TO_METER, 
  APPAREL_DATA, 
  MAX_PRINT_WIDTH_INCH, 
  MAX_PRINT_HEIGHT_INCH,
  APPAREL_COLORS,
  APPAREL_SIZES
} from '../constants';
import { 
  Upload, 
  Trash2, 
  AlertCircle, 
  ShoppingCart, 
  ArrowLeft, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignEndVertical,
  AlignCenterVertical,
  RotateCcw,
  RotateCw,
  Link as LinkIcon,
  Link2Off,
  AlertTriangle,
  RotateCw as RotateIcon,
  Type as TypeIcon,
  Bold,
  Italic,
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CartItem } from '../types';

declare const fabric: any;

interface CanvasBuilderProps {
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
}

interface HistoryState {
  front: string[];
  back: string[];
}

interface HistoryIndex {
  front: number;
  back: number;
}

interface CanvasLayer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  active: boolean;
  ref: any;
}

const FONT_CATEGORIES = [
  {
    label: 'Modern Sans',
    fonts: [
      { name: 'Inter', value: 'Inter, sans-serif' },
      { name: 'Montserrat', value: 'Montserrat' },
      { name: 'Poppins', value: 'Poppins' },
      { name: 'Space Grotesk', value: 'Space Grotesk' },
      { name: 'Titillium Web', value: 'Titillium Web' },
      { name: 'Comfortaa', value: 'Comfortaa' }
    ]
  },
  {
    label: 'Streetwear & Heavy',
    fonts: [
      { name: 'Bebas Neue', value: 'Bebas Neue' },
      { name: 'Anton', value: 'Anton' },
      { name: 'Alfa Slab One', value: 'Alfa Slab One' },
      { name: 'Russo One', value: 'Russo One' },
      { name: 'Oswald', value: 'Oswald' }
    ]
  },
  {
    label: 'Retro & Display',
    fonts: [
      { name: 'Bangers', value: 'Bangers' },
      { name: 'Luckiest Guy', value: 'Luckiest Guy' },
      { name: 'Press Start 2P', value: 'Press Start 2P' },
      { name: 'Righteous', value: 'Righteous' },
      { name: 'Special Elite', value: 'Special Elite' },
      { name: 'Monoton', value: 'Monoton' },
      { name: 'Creepster', value: 'Creepster' }
    ]
  },
  {
    label: 'Script & Cursive',
    fonts: [
      { name: 'Pacifico', value: 'Pacifico' },
      { name: 'Dancing Script', value: 'Dancing Script' },
      { name: 'Satisfy', value: 'Satisfy' },
      { name: 'Lobster', value: 'Lobster' }
    ]
  },
  {
    label: 'Serif & Elegant',
    fonts: [
      { name: 'Playfair Display', value: 'Playfair Display' },
      { name: 'Cinzel', value: 'Cinzel' },
      { name: 'Abril Fatface', value: 'Abril Fatface' },
      { name: 'Patua One', value: 'Patua One' }
    ]
  },
  {
    label: 'Utility',
    fonts: [
      { name: 'Roboto Mono', value: 'Roboto Mono, monospace' }
    ]
  }
];

const CanvasBuilder: React.FC<CanvasBuilderProps> = ({ onBack, onAddToCart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const isInternalChange = useRef<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [frontJSON, setFrontJSON] = useState<string | null>(null);
  const [backJSON, setBackJSON] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryState>({ front: [], back: [] });
  const [historyIndex, setHistoryIndex] = useState<HistoryIndex>({ front: -1, back: -1 });

  const [selectedProduct, setSelectedProduct] = useState(APPAREL_DATA[0]);
  const [selectedColor, setSelectedColor] = useState(APPAREL_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('L');
  const [onlyPrint, setOnlyPrint] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  
  const [focusedField, setFocusedField] = useState<'width' | 'height' | 'rotation' | 'text' | null>(null);
  const focusedFieldRef = useRef<'width' | 'height' | 'rotation' | 'text' | null>(null);

  const [printStats, setPrintStats] = useState({
    frontWidth: 0,
    frontHeight: 0,
    backWidth: 0,
    backHeight: 0
  });

  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [inputW, setInputW] = useState<string>('0');
  const [inputH, setInputH] = useState<string>('0');
  const [inputR, setInputR] = useState<string>('0');
  const [inputText, setInputText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>(FONT_CATEGORIES[0].fonts[0].value);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState('#000000');

  const DPI = 15; 
  const BOUNDARY_WIDTH = MAX_PRINT_WIDTH_INCH * DPI;
  const BOUNDARY_HEIGHT = MAX_PRINT_HEIGHT_INCH * DPI;
  const CANVAS_WIDTH = 220;
  const CANVAS_HEIGHT = 280;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const showVerticalLine = useRef(false);
  const showHorizontalLine = useRef(false);
  const lastAngleWasZero = useRef(false);
  const lastXWasCentered = useRef(false);
  const lastYWasCentered = useRef(false);

  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { focusedFieldRef.current = focusedField; }, [focusedField]);

  const updateLayers = useCallback((canvas: any) => {
    if (!canvas) return;
    const objects = canvas.getObjects().filter((o: any) => o.name !== 'boundary');
    const activeObject = canvas.getActiveObject();
    
    const newLayers: CanvasLayer[] = objects.map((obj: any, index: number) => ({
      id: obj.id || `layer-${index}-${Date.now()}`,
      name: obj.customName || (obj.type === 'i-text' ? `Text: ${obj.text.substring(0, 10)}...` : `Image ${index + 1}`),
      type: obj.type,
      visible: obj.visible,
      locked: obj.lockMovementX || false,
      active: activeObject === obj,
      ref: obj
    })).reverse();
    
    setLayers(newLayers);
  }, []);

  const playBeep = useCallback((freq = 880) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio feedback failed:", e);
    }
  }, []);

  const updateStats = useCallback((canvas: any) => {
    if (!canvas) return;
    const objects = canvas.getObjects().filter((o: any) => o.name !== 'boundary');
    
    if (objects.length === 0) {
      setPrintStats(prev => ({ ...prev, [`${activeTabRef.current}Width`]: 0, [`${activeTabRef.current}Height`]: 0 }));
    } else {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      objects.forEach((obj: any) => {
        const b = obj.getBoundingRect();
        minX = Math.min(minX, b.left);
        minY = Math.min(minY, b.top);
        maxX = Math.max(maxX, b.left + b.width);
        maxY = Math.max(maxY, b.top + b.height);
      });
      setPrintStats(prev => ({
        ...prev,
        [`${activeTabRef.current}Width`]: parseFloat(((maxX - minX) / DPI).toFixed(2)),
        [`${activeTabRef.current}Height`]: parseFloat(((maxY - minY) / DPI).toFixed(2))
      }));
    }

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const w = activeObject.getScaledWidth();
      const h = activeObject.getScaledHeight();
      const r = activeObject.angle || 0;
      setSelectedType(activeObject.type);
      
      if (focusedFieldRef.current !== 'width') setInputW((w / DPI).toFixed(2));
      if (focusedFieldRef.current !== 'height') setInputH((h / DPI).toFixed(2));
      if (focusedFieldRef.current !== 'rotation') setInputR(Math.round(r).toString());

      if (activeObject.type === 'i-text') {
        setInputText(activeObject.text);
        setFontSize(Math.round(activeObject.fontSize * (activeObject.scaleX || 1)));
        setFontFamily(activeObject.fontFamily);
        setIsBold(activeObject.fontWeight === 'bold');
        setIsItalic(activeObject.fontStyle === 'italic');
        setTextColor(activeObject.fill);
      }
    } else {
      setSelectedType(null);
    }
    updateLayers(canvas);
  }, [DPI, updateLayers]);

  const saveToHistory = useCallback(() => {
    if (!fabricRef.current || isInternalChange.current) return;
    const json = JSON.stringify(fabricRef.current.toJSON(['name', 'customName', 'selectable', 'evented', 'id']));
    const currentTab = activeTabRef.current;
    
    setHistory(prev => {
      const currentStack = prev[currentTab];
      const currentIndex = historyIndex[currentTab];
      const newStack = currentStack.slice(0, currentIndex + 1);
      if (newStack.length > 0 && newStack[newStack.length - 1] === json) return prev;
      return { ...prev, [currentTab]: [...newStack, json] };
    });
    setHistoryIndex(prev => ({ ...prev, [currentTab]: prev[currentTab] + 1 }));
  }, [historyIndex]);

  const handlersRef = useRef({ updateStats, saveToHistory, playBeep, updateLayers });
  useEffect(() => {
    handlersRef.current = { updateStats, saveToHistory, playBeep, updateLayers };
  }, [updateStats, saveToHistory, playBeep, updateLayers]);

  const drawAlignmentLines = (ctx: CanvasRenderingContext2D) => {
    if (!showVerticalLine.current && !showHorizontalLine.current) return;

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#6366f1';

    const centerX = CANVAS_WIDTH / 2;
    const centerY = 10 + (BOUNDARY_HEIGHT / 2);

    if (showVerticalLine.current) {
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX, 10 + BOUNDARY_HEIGHT);
      ctx.stroke();
    }

    if (showHorizontalLine.current) {
      ctx.beginPath();
      ctx.moveTo((CANVAS_WIDTH - BOUNDARY_WIDTH) / 2, centerY);
      ctx.lineTo((CANVAS_WIDTH + BOUNDARY_WIDTH) / 2, centerY);
      ctx.stroke();
    }

    ctx.restore();
  };

  const setupBoundary = (canvas: any) => {
    let boundary = canvas.getObjects().find((o: any) => o.name === 'boundary');
    if (!boundary) {
      boundary = new fabric.Rect({
        left: (CANVAS_WIDTH - BOUNDARY_WIDTH) / 2,
        top: 10, width: BOUNDARY_WIDTH, height: BOUNDARY_HEIGHT,
        fill: 'transparent', stroke: '#6366f1', strokeWidth: 1,
        strokeDashArray: [5, 2], selectable: false, evented: false, name: 'boundary', opacity: 0.5
      });
      canvas.add(boundary);
    }
    boundary.bringToFront();
    canvas.requestRenderAll();
  };

  const clampObject = (obj: any, canvas: any) => {
    const boundary = canvas.getObjects().find((o: any) => o.name === 'boundary');
    if (!boundary || !obj) return;
    obj.setCoords();
    const bound = boundary.getBoundingRect();
    const objBound = obj.getBoundingRect();
    
    let offsetLeft = 0;
    let offsetTop = 0;

    if (objBound.left < bound.left) {
      offsetLeft = bound.left - objBound.left;
    } else if (objBound.left + objBound.width > bound.left + bound.width) {
      offsetLeft = (bound.left + bound.width) - (objBound.left + objBound.width);
    }

    if (objBound.top < bound.top) {
      offsetTop = bound.top - objBound.top;
    } else if (objBound.top + objBound.height > bound.top + bound.height) {
      offsetTop = (bound.top + bound.height) - (objBound.top + objBound.height);
    }

    if (offsetLeft !== 0 || offsetTop !== 0) {
      const currentPos = obj.getCenterPoint();
      obj.setPositionByOrigin(
        new fabric.Point(currentPos.x + offsetLeft, currentPos.y + offsetTop),
        'center',
        'center'
      );
      obj.setCoords();
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      imageSmoothingEnabled: true,
      enableRetinaScaling: true
    });

    fabricRef.current = canvas;
    setupBoundary(canvas);
    
    const initialJSON = JSON.stringify(canvas.toJSON(['name', 'customName', 'selectable', 'evented', 'id']));
    setHistory({ front: [initialJSON], back: [initialJSON] });
    setHistoryIndex({ front: 0, back: 0 });

    canvas.on({
      'object:moving': (e: any) => {
        const obj = e.target;
        const centerX = CANVAS_WIDTH / 2;
        const centerY = 10 + (BOUNDARY_HEIGHT / 2);
        const threshold = 6;
        const currentPos = obj.getCenterPoint();
        
        if (Math.abs(currentPos.x - centerX) < threshold) {
          obj.setPositionByOrigin(new fabric.Point(centerX, currentPos.y), 'center', 'center');
          if (!lastXWasCentered.current) {
            handlersRef.current.playBeep(660);
            lastXWasCentered.current = true;
          }
          showVerticalLine.current = true;
        } else {
          showVerticalLine.current = false;
          lastXWasCentered.current = false;
        }

        if (Math.abs(currentPos.y - centerY) < threshold) {
          obj.setPositionByOrigin(new fabric.Point(obj.getCenterPoint().x, centerY), 'center', 'center');
          if (!lastYWasCentered.current) {
            handlersRef.current.playBeep(660);
            lastYWasCentered.current = true;
          }
          showHorizontalLine.current = true;
        } else {
          showHorizontalLine.current = false;
          lastYWasCentered.current = false;
        }

        obj.setCoords();
        clampObject(obj, canvas);
        handlersRef.current.updateStats(canvas);
      },
      'object:rotating': (e: any) => {
        const obj = e.target;
        const angle = obj.angle % 360;
        const snapThreshold = 3;

        if (Math.abs(angle) < snapThreshold || Math.abs(angle - 360) < snapThreshold) {
          if (!lastAngleWasZero.current) {
            obj.set('angle', 0);
            handlersRef.current.playBeep(880);
            obj.set('borderColor', '#10b981');
            setTimeout(() => obj.set('borderColor', '#6366f1'), 300);
            lastAngleWasZero.current = true;
          }
        } else {
          lastAngleWasZero.current = false;
        }
        handlersRef.current.updateStats(canvas);
      },
      'object:scaling': (e: any) => { clampObject(e.target, canvas); handlersRef.current.updateStats(canvas); },
      'selection:created': () => { setHasSelection(true); handlersRef.current.updateStats(canvas); },
      'selection:updated': () => { setHasSelection(true); handlersRef.current.updateStats(canvas); },
      'selection:cleared': () => { 
        setHasSelection(false); 
        setSelectedType(null);
        setInputW('0'); 
        setInputH('0'); 
        setInputR('0');
        setShowWarning(false);
        showVerticalLine.current = false;
        showHorizontalLine.current = false;
        handlersRef.current.updateLayers(canvas);
      },
      'object:modified': () => { 
        showVerticalLine.current = false;
        showHorizontalLine.current = false;
        handlersRef.current.updateStats(canvas); 
        handlersRef.current.saveToHistory(); 
      },
      'after:render': () => {
        const ctx = canvas.getContext();
        drawAlignmentLines(ctx);
      },
      'drag:end': () => {
        showVerticalLine.current = false;
        showHorizontalLine.current = false;
        canvas.requestRenderAll();
      },
      'object:added': () => { handlersRef.current.updateStats(canvas); handlersRef.current.saveToHistory(); },
      'object:removed': () => { handlersRef.current.updateStats(canvas); handlersRef.current.saveToHistory(); }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    setIsLoading(true);
    const canvas = fabricRef.current;
    const targetJSON = activeTab === 'front' ? frontJSON : backJSON;
    isInternalChange.current = true;
    
    canvas.discardActiveObject();
    canvas.getObjects().forEach((o: any) => {
      if (o.name !== 'boundary') canvas.remove(o);
    });

    if (targetJSON) {
      canvas.loadFromJSON(targetJSON, () => {
        setupBoundary(canvas); 
        canvas.requestRenderAll();
        updateStats(canvas);
        setIsLoading(false);
        isInternalChange.current = false;
      });
    } else {
      setupBoundary(canvas);
      updateStats(canvas);
      setIsLoading(false);
      isInternalChange.current = false;
    }
  }, [activeTab, updateStats]); 

  const switchTab = (tab: 'front' | 'back') => {
    if (tab === activeTab) return;
    const currentJSON = JSON.stringify(fabricRef.current.toJSON(['name', 'customName', 'selectable', 'evented', 'id']));
    if (activeTab === 'front') setFrontJSON(currentJSON); else setBackJSON(currentJSON);
    setActiveTab(tab);
  };

  const undo = () => {
    const idx = historyIndex[activeTab];
    if (idx <= 0) return;
    isInternalChange.current = true;
    fabricRef.current.loadFromJSON(history[activeTab][idx - 1], () => {
      setupBoundary(fabricRef.current);
      fabricRef.current.requestRenderAll();
      updateStats(fabricRef.current);
      setHistoryIndex(prev => ({ ...prev, [activeTab]: idx - 1 }));
      isInternalChange.current = false;
    });
  };

  const redo = () => {
    const idx = historyIndex[activeTab];
    const stack = history[activeTab];
    if (idx >= stack.length - 1) return;
    isInternalChange.current = true;
    fabricRef.current.loadFromJSON(stack[idx + 1], () => {
      setupBoundary(fabricRef.current);
      fabricRef.current.requestRenderAll();
      updateStats(fabricRef.current);
      setHistoryIndex(prev => ({ ...prev, [activeTab]: idx + 1 }));
      isInternalChange.current = false;
    });
  };

  const handleManualResize = (dimension: 'width' | 'height' | 'rotation', valStr: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    
    if (dimension === 'width') setInputW(valStr);
    else if (dimension === 'height') setInputH(valStr);
    else setInputR(valStr);

    if (!activeObject || valStr === '' || valStr === '.' || (valStr === '0' && dimension !== 'rotation')) return;

    const value = parseFloat(valStr);
    if (isNaN(value)) return;

    if (dimension === 'rotation') {
      const angle = value % 360;
      activeObject.set('angle', angle);
      activeObject.setCoords();
      canvas.requestRenderAll();
      updateStats(canvas);
      return;
    }

    if (value <= 0) return;
    if (dimension === 'width' && value > MAX_PRINT_WIDTH_INCH) { setShowWarning(true); return; }
    if (dimension === 'height' && value > MAX_PRINT_HEIGHT_INCH) { setShowWarning(true); return; }
    
    setShowWarning(false);
    const targetPx = value * DPI;
    const currentW = activeObject.getScaledWidth();
    const currentH = activeObject.getScaledHeight();

    if (currentW === 0 || currentH === 0) return;

    if (dimension === 'width') {
      const scaleFactor = targetPx / currentW;
      activeObject.set('scaleX', activeObject.scaleX * scaleFactor);
      if (isLocked) {
        activeObject.set('scaleY', activeObject.scaleY * scaleFactor);
        const newH = (activeObject.getScaledHeight() / DPI).toFixed(2);
        setInputH(newH);
      }
    } else {
      const scaleFactor = targetPx / currentH;
      activeObject.set('scaleY', activeObject.scaleY * scaleFactor);
      if (isLocked) {
        activeObject.set('scaleX', activeObject.scaleX * scaleFactor);
        const newW = (activeObject.getScaledWidth() / DPI).toFixed(2);
        setInputW(newW);
      }
    }

    activeObject.setCoords();
    clampObject(activeObject, canvas);
    canvas.requestRenderAll();
    updateStats(canvas);
  };

  const handleTextUpdate = (type: 'content' | 'size' | 'family' | 'bold' | 'italic' | 'color', value: any) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'i-text') return;

    switch (type) {
      case 'content': 
        setInputText(value);
        activeObject.set('text', value); 
        break;
      case 'size':
        const numSize = parseInt(value);
        if (!isNaN(numSize)) {
          setFontSize(numSize);
          activeObject.set('fontSize', numSize);
          activeObject.set({ scaleX: 1, scaleY: 1 });
        }
        break;
      case 'family':
        setFontFamily(value);
        activeObject.set('fontFamily', value);
        break;
      case 'bold':
        setIsBold(value);
        activeObject.set('fontWeight', value ? 'bold' : 'normal');
        break;
      case 'italic':
        setIsItalic(value);
        activeObject.set('fontStyle', value ? 'italic' : 'normal');
        break;
      case 'color':
        setTextColor(value);
        activeObject.set('fill', value);
        break;
    }

    activeObject.setCoords();
    clampObject(activeObject, canvas);
    canvas.requestRenderAll();
    updateStats(canvas);
    saveToHistory();
  };

  const handleAddText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new fabric.IText('Your Text', {
      id: `text-${Date.now()}`,
      left: CANVAS_WIDTH / 2,
      top: 10 + (BOUNDARY_HEIGHT / 2),
      fontFamily: 'Inter',
      fontSize: 20,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      cornerColor: '#6366f1',
      cornerSize: 5,
      transparentCorners: false,
      borderColor: '#6366f1',
      padding: 4
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.setCoords();
    clampObject(text, canvas);
    canvas.requestRenderAll();
    updateStats(canvas);
  };

  const alignObject = (alignment: string) => {
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();
    const boundary = canvas.getObjects().find((o: any) => o.name === 'boundary');
    if (!activeObject || !boundary) return;

    activeObject.setCoords();
    const bRect = boundary.getBoundingRect();
    const oRect = activeObject.getBoundingRect();
    const centerX = bRect.left + bRect.width / 2;
    const centerY = bRect.top + bRect.height / 2;

    switch (alignment) {
      case 'left':
        activeObject.setPositionByOrigin(new fabric.Point(bRect.left, oRect.top + oRect.height / 2), 'left', 'center');
        break;
      case 'centerH':
        activeObject.setPositionByOrigin(new fabric.Point(centerX, activeObject.getCenterPoint().y), 'center', 'center');
        break;
      case 'right':
        activeObject.setPositionByOrigin(new fabric.Point(bRect.left + bRect.width, oRect.top + oRect.height / 2), 'right', 'center');
        break;
      case 'top':
        activeObject.setPositionByOrigin(new fabric.Point(oRect.left + oRect.width / 2, bRect.top), 'center', 'top');
        break;
      case 'centerV':
        activeObject.setPositionByOrigin(new fabric.Point(activeObject.getCenterPoint().x, centerY), 'center', 'center');
        break;
      case 'bottom':
        activeObject.setPositionByOrigin(new fabric.Point(oRect.left + oRect.width / 2, bRect.top + bRect.height), 'center', 'bottom');
        break;
    }
    
    activeObject.setCoords();
    canvas.requestRenderAll();
    updateStats(canvas);
    saveToHistory();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target?.result as string, (img: any) => {
        const canvas = fabricRef.current;
        img.set({ 
          id: `img-${Date.now()}`,
          originX: 'center', 
          originY: 'center', 
          cornerColor: '#6366f1', 
          cornerSize: 5, 
          transparentCorners: false, 
          borderColor: '#6366f1', 
          padding: 2 
        });
        const scale = Math.min(80 / img.width, (BOUNDARY_WIDTH * 0.6) / img.width);
        img.scale(scale);
        img.set({ left: CANVAS_WIDTH / 2, top: CANVAS_HEIGHT / 2 });
        img.setCoords();
        canvas.add(img);
        canvas.setActiveObject(img);
        img.bringToFront();
        setupBoundary(canvas);
        updateStats(canvas);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const reorderLayer = (layer: CanvasLayer, action: 'front' | 'back' | 'forward' | 'backward') => {
    const canvas = fabricRef.current;
    if (!canvas || !layer.ref) return;
    switch(action) {
      case 'front': layer.ref.bringToFront(); break;
      case 'back': layer.ref.sendToBack(); break;
      case 'forward': layer.ref.bringForward(); break;
      case 'backward': layer.ref.sendBackwards(); break;
    }
    setupBoundary(canvas);
    canvas.requestRenderAll();
    updateLayers(canvas);
    saveToHistory();
  };

  const toggleLayerProperty = (layer: CanvasLayer, prop: 'visible' | 'locked') => {
    const canvas = fabricRef.current;
    if (!canvas || !layer.ref) return;
    if (prop === 'visible') {
      layer.ref.set('visible', !layer.ref.visible);
    } else {
      const isLocked = !layer.ref.lockMovementX;
      layer.ref.set({
        lockMovementX: isLocked,
        lockMovementY: isLocked,
        lockScalingX: isLocked,
        lockScalingY: isLocked,
        lockRotation: isLocked,
        hasControls: !isLocked,
        selectable: !isLocked
      });
      if (isLocked) canvas.discardActiveObject();
    }
    canvas.requestRenderAll();
    updateLayers(canvas);
  };

  const renameLayer = (layer: CanvasLayer, newName: string) => {
    if (!layer.ref) return;
    layer.ref.set('customName', newName);
    updateLayers(fabricRef.current);
    saveToHistory();
  };

  const frontCost = (printStats.frontHeight / INCH_TO_METER) * DTF_PRICE_PER_METER;
  const backCost = (printStats.backHeight / INCH_TO_METER) * DTF_PRICE_PER_METER;
  const grandTotal = ((onlyPrint ? 0 : selectedProduct.basePrice) + frontCost + backCost) * quantity;

  const handleAddToCartClick = () => {
    const currentJSON = JSON.stringify(fabricRef.current.toJSON(['name', 'customName', 'selectable', 'evented', 'id']));
    const otherJSON = activeTab === 'front' ? backJSON : frontJSON;
    
    onAddToCart({ 
      id: Math.random().toString(36).substr(2, 9), 
      productName: onlyPrint ? 'DTF Roll Print' : `${selectedProduct.type} T-Shirt`, 
      quantity, 
      unitPrice: grandTotal / quantity,
      total: grandTotal, 
      color: onlyPrint ? undefined : selectedColor.name, 
      size: onlyPrint ? undefined : selectedSize,
      isOnlyPrint: onlyPrint,
      frontCanvas: activeTab === 'front' ? currentJSON : (otherJSON || undefined),
      backCanvas: activeTab === 'back' ? currentJSON : (otherJSON || undefined),
      stats: {
        frontW: printStats.frontWidth,
        frontH: printStats.frontHeight,
        backW: printStats.backWidth,
        backH: printStats.backHeight
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500"><ArrowLeft className="w-4 h-4" /></button>
          <h1 className="text-lg font-black text-slate-900 leading-none">Design Tool</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg mr-2">
             <button onClick={undo} disabled={historyIndex[activeTab] <= 0} className="p-1.5 hover:bg-white rounded shadow-sm disabled:opacity-30 transition-all text-slate-600" title="Undo"><RotateCcw className="w-3.5 h-3.5" /></button>
             <button onClick={redo} disabled={historyIndex[activeTab] >= history[activeTab].length - 1} className="p-1.5 hover:bg-white rounded shadow-sm disabled:opacity-30 transition-all text-slate-600" title="Redo"><RotateCw className="w-3.5 h-3.5" /></button>
          </div>
          <div className="text-indigo-600 font-black text-[8px] uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded border border-indigo-100/50">
            {MAX_PRINT_WIDTH_INCH}"x{MAX_PRINT_HEIGHT_INCH}" Area
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1 w-full flex flex-col items-center gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 relative">
              <div className="flex bg-slate-50 border-b border-slate-100 p-0.5 gap-0.5">
                <button onClick={() => switchTab('front')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded transition-all ${activeTab === 'front' ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-400'}`}>Front</button>
                <button onClick={() => switchTab('back')} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded transition-all ${activeTab === 'back' ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-400'}`}>Back</button>
              </div>
              
              <div className="relative bg-slate-200 flex justify-center items-center min-h-[340px] overflow-hidden">
                {isLoading && <div className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center font-black text-indigo-600 text-[8px] uppercase">Loading...</div>}
                <div className="relative w-full h-[320px] flex items-center justify-center">
                    <div className="absolute inset-0 z-0 transition-colors duration-500" style={{ backgroundColor: onlyPrint ? '#e2e8f0' : selectedColor.hex }} />
                    <div className="relative z-20"><canvas ref={canvasRef} /></div>
                </div>
              </div>

              <div className="p-3 flex flex-col gap-2 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg font-black text-[9px] cursor-pointer hover:bg-slate-800 transition active:scale-95">
                    <Upload className="w-3 h-3" /> ART
                    <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileUpload} />
                  </label>
                  <button 
                    onClick={handleAddText}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg font-black text-[9px] hover:bg-indigo-700 transition active:scale-95"
                  >
                    <TypeIcon className="w-3 h-3" /> TEXT
                  </button>
                  <button disabled={!hasSelection} onClick={() => { fabricRef.current.remove(fabricRef.current.getActiveObject()); updateStats(fabricRef.current); }} className={`px-3 py-2 rounded-lg transition active:scale-95 ${hasSelection ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-50 text-slate-300'}`}><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-6 gap-0.5 bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                  <button disabled={!hasSelection} onClick={() => alignObject('left')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
                  <button disabled={!hasSelection} onClick={() => alignObject('centerH')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Center Horizontal"><AlignCenter className="w-3.5 h-3.5" /></button>
                  <button disabled={!hasSelection} onClick={() => alignObject('right')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
                  <button disabled={!hasSelection} onClick={() => alignObject('top')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Top"><AlignStartVertical className="w-3.5 h-3.5" /></button>
                  <button disabled={!hasSelection} onClick={() => alignObject('centerV')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Center Vertical"><AlignCenterVertical className="w-3.5 h-3.5" /></button>
                  <button disabled={!hasSelection} onClick={() => alignObject('bottom')} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded shadow-xs flex justify-center" title="Align Bottom"><AlignEndVertical className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[220px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 p-2 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <LayersIcon className="w-2.5 h-2.5" /> Layers
                </span>
                <span className="text-[8px] font-black text-indigo-600">{layers.length} items</span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px] p-1.5 space-y-1.5">
                {layers.length === 0 ? (
                  <div className="py-10 text-center">
                    <LayersIcon className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                    <p className="text-[8px] font-bold text-slate-300 uppercase">No Layers Yet</p>
                  </div>
                ) : (
                  layers.map((layer) => (
                    <div 
                      key={layer.id} 
                      onClick={() => { fabricRef.current.setActiveObject(layer.ref); fabricRef.current.requestRenderAll(); updateStats(fabricRef.current); }}
                      className={`group p-2 rounded-lg border transition-all cursor-pointer ${layer.active ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <input 
                          type="text" 
                          value={layer.name} 
                          onChange={(e) => renameLayer(layer, e.target.value)}
                          className="bg-transparent border-none text-[9px] font-black text-slate-700 outline-none w-[100px] focus:text-indigo-600"
                        />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); toggleLayerProperty(layer, 'visible'); }} className={`p-1 rounded ${layer.visible ? 'text-slate-400 hover:text-indigo-600' : 'text-red-400 bg-red-50'}`}>
                            {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); toggleLayerProperty(layer, 'locked'); }} className={`p-1 rounded ${!layer.locked ? 'text-slate-400 hover:text-indigo-600' : 'text-amber-500 bg-amber-50'}`}>
                            {!layer.locked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{layer.type.replace('i-text', 'Text')}</span>
                        <div className="flex items-center gap-0.5">
                          <button onClick={(e) => { e.stopPropagation(); reorderLayer(layer, 'forward'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="Move Forward"><ChevronUp className="w-3 h-3" /></button>
                          <button onClick={(e) => { e.stopPropagation(); reorderLayer(layer, 'backward'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="Move Backward"><ChevronDown className="w-3 h-3" /></button>
                          <button onClick={(e) => { e.stopPropagation(); reorderLayer(layer, 'front'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="Bring to Front"><ArrowUp className="w-3 h-3" /></button>
                          <button onClick={(e) => { e.stopPropagation(); reorderLayer(layer, 'back'); }} className="p-0.5 text-slate-400 hover:text-indigo-600" title="Send to Back"><ArrowDown className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg flex flex-col w-full gap-2 transition-all shadow-inner">
            <div className="flex justify-between items-center text-white text-[8px] font-bold">
              <div className="flex items-center gap-1.5 uppercase tracking-widest text-indigo-300">
                <AlertCircle className="w-3 h-3" /> Transform Controls
              </div>
              {showWarning && (
                <div className="flex items-center gap-1 text-red-400 animate-pulse font-black">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  SIZE EXCEEDS LIMIT
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center justify-center py-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 uppercase tracking-tighter text-[7px] font-black">W:</span>
                <input 
                  type="text" 
                  value={inputW} 
                  disabled={!hasSelection}
                  placeholder="0.00"
                  onFocus={() => setFocusedField('width')}
                  onBlur={() => { setFocusedField(null); updateStats(fabricRef.current); }}
                  onChange={(e) => handleManualResize('width', e.target.value)}
                  className={`w-14 bg-slate-800 border border-transparent rounded px-2 py-1 text-center text-white text-[10px] font-black focus:ring-1 focus:ring-indigo-500 disabled:opacity-30 transition-all ${showWarning && parseFloat(inputW) > MAX_PRINT_WIDTH_INCH ? 'border-red-500 text-red-400 bg-red-900/10' : ''}`}
                />
              </div>

              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`p-1.5 rounded-lg transition-all border ${isLocked ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                title={isLocked ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
              >
                {isLocked ? <LinkIcon className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 uppercase tracking-tighter text-[7px] font-black">H:</span>
                <input 
                  type="text" 
                  value={inputH} 
                  disabled={!hasSelection}
                  placeholder="0.00"
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => { setFocusedField(null); updateStats(fabricRef.current); }}
                  onChange={(e) => handleManualResize('height', e.target.value)}
                  className={`w-14 bg-slate-800 border border-transparent rounded px-2 py-1 text-center text-white text-[10px] font-black focus:ring-1 focus:ring-indigo-500 disabled:opacity-30 transition-all ${showWarning && parseFloat(inputH) > MAX_PRINT_HEIGHT_INCH ? 'border-red-500 text-red-400 bg-red-900/10' : ''}`}
                />
              </div>

              <div className="w-px h-4 bg-slate-700 mx-1"></div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 uppercase tracking-tighter text-[7px] font-black flex items-center gap-1">
                  <RotateIcon className="w-2 h-2" /> R:
                </span>
                <input 
                  type="text" 
                  value={inputR} 
                  disabled={!hasSelection}
                  placeholder="0"
                  onFocus={() => setFocusedField('rotation')}
                  onBlur={() => { setFocusedField(null); updateStats(fabricRef.current); }}
                  onChange={(e) => handleManualResize('rotation', e.target.value)}
                  className="w-12 bg-slate-800 border border-transparent rounded px-2 py-1 text-center text-white text-[10px] font-black focus:ring-1 focus:ring-indigo-500 disabled:opacity-30 transition-all"
                />
              </div>
            </div>

            {selectedType === 'i-text' && (
              <div className="mt-2 pt-2 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center mb-2 text-indigo-300 text-[8px] font-black uppercase tracking-widest">
                  <span>Text Style</span>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text"
                    value={inputText}
                    onFocus={() => setFocusedField('text')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => handleTextUpdate('content', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-white text-[10px] font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Enter text..."
                  />
                  <div className="flex gap-2 items-center">
                    <select 
                      value={fontFamily}
                      onChange={(e) => handleTextUpdate('family', e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-[10px] font-black focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                      style={{ fontFamily }}
                    >
                      {FONT_CATEGORIES.map(cat => (
                        <optgroup key={cat.label} label={cat.label} className="bg-slate-900 text-indigo-400 font-bold text-[8px] uppercase tracking-tighter">
                          {cat.fonts.map(f => (
                            <option key={f.value} value={f.value} style={{ fontFamily: f.value }} className="bg-slate-800 text-white font-normal text-sm lowercase">
                              {f.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <input 
                      type="number"
                      value={fontSize}
                      onChange={(e) => handleTextUpdate('size', e.target.value)}
                      className="w-12 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-[10px] font-black text-center focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleTextUpdate('bold', !isBold)}
                        className={`p-1.5 rounded transition-all border ${isBold ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                      >
                        <Bold className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleTextUpdate('italic', !isItalic)}
                        className={`p-1.5 rounded transition-all border ${isItalic ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                      >
                        <Italic className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {APPAREL_COLORS.map(color => (
                      <button 
                        key={color.name} 
                        onClick={() => handleTextUpdate('color', color.hex)}
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${textColor === color.hex ? 'ring-1 ring-white ring-offset-1 ring-offset-slate-900 scale-110' : 'border-slate-700 hover:scale-110'}`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                    <div className="w-px h-3.5 bg-slate-700 mx-0.5" />
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => handleTextUpdate('color', e.target.value)}
                      className="w-3.5 h-3.5 rounded-full bg-transparent border-none p-0 cursor-pointer overflow-hidden ring-1 ring-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-[240px] w-full flex flex-col gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 space-y-3">
            <div>
              <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Mode</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-50 p-0.5 rounded">
                <button onClick={() => setOnlyPrint(false)} className={`py-1.5 text-[7px] rounded font-black uppercase ${!onlyPrint ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'}`}>T-Shirt</button>
                <button onClick={() => setOnlyPrint(true)} className={`py-1.5 text-[7px] rounded font-black uppercase ${onlyPrint ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'}`}>Roll</button>
              </div>
            </div>

            {!onlyPrint && (
              <div className="space-y-3">
                <div>
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Apparel</label>
                  <div className="space-y-0.5">
                    {APPAREL_DATA.slice(0, 3).map(p => (
                      <button key={p.id} onClick={() => setSelectedProduct(p)} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md border transition-all ${selectedProduct.id === p.id ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-50 hover:border-slate-200'}`}>
                        <div className="text-left leading-tight"><p className="font-black text-[8px] uppercase">{p.type}</p><p className="text-[6px] font-bold text-slate-400">{p.gsm} GSM</p></div>
                        <span className="font-black text-[8px] text-slate-500">৳{p.basePrice}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Color & Size</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {APPAREL_COLORS.map(color => (
                      <button key={color.name} onClick={() => setSelectedColor(color)} className={`w-4 h-4 rounded-full border transition-all ${selectedColor.name === color.name ? 'ring-2 ring-indigo-600 ring-offset-1' : 'border-slate-200 hover:scale-110'}`} style={{ backgroundColor: color.hex }} title={color.name} />
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {APPAREL_SIZES.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`py-1 rounded font-black text-[7px] border transition-colors ${selectedSize === size ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-50 text-slate-400 hover:bg-slate-50'}`}>{size}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Quantity</label>
              <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 w-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm font-black text-slate-600 text-[10px]">-</button>
                <span className="flex-grow text-center font-black text-[10px] text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm font-black text-slate-600 text-[10px]">+</button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-4 rounded-xl shadow-md text-white">
            <div className="space-y-1 font-bold text-[8px]">
              <div className="flex justify-between opacity-80"><span>Apparel</span><span>৳{onlyPrint ? 0 : selectedProduct.basePrice}</span></div>
              <div className="flex justify-between opacity-80"><span>Print</span><span>৳{(frontCost + backCost).toFixed(2)}</span></div>
              <div className="h-px bg-white/10 my-1.5"></div>
              <div className="flex justify-between items-end">
                <div><p className="text-[6px] font-black uppercase text-indigo-200">Total BDT</p><p className="text-xl font-black tracking-tighter">৳{Math.round(grandTotal).toLocaleString()}</p></div>
              </div>
              <button onClick={handleAddToCartClick} className="w-full py-2 bg-white text-indigo-600 rounded-lg font-black text-[9px] hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5 mt-2 shadow-sm active:scale-95"><ShoppingCart className="w-3 h-3" /> ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasBuilder;
