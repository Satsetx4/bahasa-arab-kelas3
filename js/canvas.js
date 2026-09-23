// Papan tulis digital Maharatul Kitabah dengan layer panduan dan tinta terpisah.
// Goresan disimpan sebagai vektor; hanya 30 goresan terbaru yang dapat di-undo.
const MAX_UNDO_STROKES = 30;
const MAX_POINTS_PER_STROKE = 4096;

class KitabahPad {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.backgroundCanvas = document.getElementById('kitabah-background');
    this.backgroundCtx = this.backgroundCanvas?.getContext('2d');
    this.container = this.canvas.parentElement;
    this.archiveCanvas = document.createElement('canvas');
    this.archiveCanvas.className = 'canvas-layer canvas-archive';
    this.archiveCanvas.setAttribute('aria-hidden', 'true');
    this.container.insertBefore(this.archiveCanvas, this.canvas);
    this.archiveCtx = this.archiveCanvas.getContext('2d');

    this.isDrawing = false;
    this.activePointerId = null;
    this.activeStroke = null;
    this.lastPoint = null;
    this.strokes = [];
    this.currentColor = '#1e293b';
    this.lineWidth = 6;
    this.isEraser = false;
    this.currentTemplateWord = 'دَفْتَرٌ';
    this.showGuideline = true;
    this.showTracing = true;
    this.logicalWidth = 0;
    this.logicalHeight = 360;
    this.pixelRatio = 1;

    this.resizeCanvas();
    this.attachEvents();
    this.observeSize();
    this.renderBackground();
  }

  observeSize() {
    this.handleResize = () => this.resizeCanvas();
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this.handleResize);
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', this.handleResize);
    }
  }

  resizeCanvas() {
    if (!this.container) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || 700));
    const height = Math.max(1, Math.round(rect.height || 360));
    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    if (width === this.logicalWidth && height === this.logicalHeight && pixelRatio === this.pixelRatio) return;

    let archivedDrawing = null;
    if (this.archiveCanvas.width && this.archiveCanvas.height) {
      archivedDrawing = document.createElement('canvas');
      archivedDrawing.width = this.archiveCanvas.width;
      archivedDrawing.height = this.archiveCanvas.height;
      archivedDrawing.getContext('2d').drawImage(this.archiveCanvas, 0, 0);
    }

    this.logicalWidth = width;
    this.logicalHeight = height;
    this.pixelRatio = pixelRatio;
    [this.backgroundCanvas, this.archiveCanvas, this.canvas].forEach(layer => {
      if (!layer) return;
      layer.width = Math.round(width * pixelRatio);
      layer.height = Math.round(height * pixelRatio);
      layer.style.width = '100%';
      layer.style.height = '100%';
      layer.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    });

    if (archivedDrawing) {
      this.archiveCtx.drawImage(archivedDrawing, 0, 0, width, height);
    }
    this.renderBackground();
    this.renderStudentLayer();
  }

  attachEvents() {
    this.canvas.addEventListener('pointerdown', event => this.startDraw(event));
    this.canvas.addEventListener('pointermove', event => this.draw(event));
    this.canvas.addEventListener('pointerup', event => this.endDraw(event));
    this.canvas.addEventListener('pointercancel', event => this.endDraw(event));
    this.canvas.addEventListener('lostpointercapture', event => this.endDraw(event));
  }

  getCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    };
  }

  startDraw(event) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    this.isDrawing = true;
    this.activePointerId = event.pointerId;
    this.activeStroke = {
      color: this.isEraser ? '#ffffff' : this.currentColor,
      width: this.isEraser ? this.lineWidth * 3 : this.lineWidth,
      points: []
    };
    this.lastPoint = this.getCoords(event);
    this.activeStroke.points.push(this.lastPoint);
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture is optional in older browsers; document-level movement is not needed.
    }
    this.drawDot(this.ctx, this.activeStroke, this.lastPoint);
  }

  draw(event) {
    if (!this.isDrawing || event.pointerId !== this.activePointerId) return;
    event.preventDefault();
    const point = this.getCoords(event);
    this.drawSegment(this.ctx, this.activeStroke, this.lastPoint, point);
    this.lastPoint = point;

    if (this.activeStroke.points.length >= MAX_POINTS_PER_STROKE) {
      this.activeStroke.points = this.activeStroke.points.filter((_, index) => index % 2 === 0);
    }
    this.activeStroke.points.push(point);
  }

  endDraw(event) {
    if (!this.isDrawing || (event && event.pointerId !== this.activePointerId)) return;
    this.isDrawing = false;
    this.activePointerId = null;
    if (this.activeStroke?.points.length) {
      this.strokes.push(this.activeStroke);
      if (this.strokes.length > MAX_UNDO_STROKES) {
        const archivedStroke = this.strokes.shift();
        this.renderStroke(this.archiveCtx, archivedStroke);
        this.renderStudentLayer();
      }
    }
    this.activeStroke = null;
    this.lastPoint = null;
  }

  drawDot(context, stroke, point) {
    const x = point.x * this.logicalWidth;
    const y = point.y * this.logicalHeight;
    context.save();
    context.fillStyle = stroke.color;
    context.beginPath();
    context.arc(x, y, stroke.width / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawSegment(context, stroke, from, to) {
    context.save();
    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(from.x * this.logicalWidth, from.y * this.logicalHeight);
    context.lineTo(to.x * this.logicalWidth, to.y * this.logicalHeight);
    context.stroke();
    context.restore();
  }

  renderStroke(context, stroke) {
    if (!stroke?.points?.length) return;
    if (stroke.points.length === 1) {
      this.drawDot(context, stroke, stroke.points[0]);
      return;
    }
    for (let index = 1; index < stroke.points.length; index++) {
      this.drawSegment(context, stroke, stroke.points[index - 1], stroke.points[index]);
    }
  }

  renderStudentLayer() {
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    this.strokes.forEach(stroke => this.renderStroke(this.ctx, stroke));
  }

  renderBackground() {
    if (!this.backgroundCtx) return;
    const context = this.backgroundCtx;
    context.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
    if (this.showGuideline) this.drawGuidelines(context);
    if (this.showTracing && this.currentTemplateWord) this.drawTemplateText(context, this.currentTemplateWord);
  }

  drawGuidelines(context) {
    const centerY = this.logicalHeight * 0.58;
    context.save();
    context.beginPath();
    context.strokeStyle = '#cbd5e1';
    context.lineWidth = 1.5;
    context.moveTo(20, centerY);
    context.lineTo(this.logicalWidth - 20, centerY);
    context.stroke();

    context.beginPath();
    context.strokeStyle = '#e2e8f0';
    context.setLineDash([6, 6]);
    context.lineWidth = 1;
    context.moveTo(20, centerY - 70);
    context.lineTo(this.logicalWidth - 20, centerY - 70);
    context.stroke();
    context.beginPath();
    context.moveTo(20, centerY + 50);
    context.lineTo(this.logicalWidth - 20, centerY + 50);
    context.stroke();
    context.restore();
  }

  drawTemplateText(context, word) {
    const centerY = this.logicalHeight * 0.58;
    const fontSize = Math.min(78, Math.max(40, this.logicalWidth / 5));
    context.save();
    context.direction = 'rtl';
    context.textAlign = 'center';
    context.font = `bold ${fontSize}px "Amiri", serif`;
    context.fillStyle = 'rgba(148, 163, 184, 0.5)';
    context.fillText(word, this.logicalWidth / 2, centerY + 16, Math.max(100, this.logicalWidth - 32));
    context.restore();
  }

  renderTemplate(word) {
    this.currentTemplateWord = word;
    this.renderBackground();
  }

  toggleGuideline() {
    this.showGuideline = !this.showGuideline;
    this.renderBackground();
    return this.showGuideline;
  }

  toggleTracing() {
    this.showTracing = !this.showTracing;
    this.renderBackground();
    return this.showTracing;
  }

  setColor(color) {
    this.currentColor = color;
    this.isEraser = false;
  }

  setSize(size) {
    this.lineWidth = size;
  }

  setEraser(active = true) {
    this.isEraser = active;
  }

  undo() {
    if (this.strokes.length === 0) return false;
    this.strokes.pop();
    this.renderStudentLayer();
    return true;
  }

  clearCanvas() {
    this.strokes = [];
    this.archiveCtx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    this.renderStudentLayer();
    this.renderBackground();
  }

  downloadDrawing() {
    const output = document.createElement('canvas');
    output.width = this.canvas.width;
    output.height = this.canvas.height;
    const context = output.getContext('2d');
    context.drawImage(this.backgroundCanvas, 0, 0);
    context.drawImage(this.archiveCanvas, 0, 0);
    context.drawImage(this.canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'latihan-menulis-arab.png';
    link.href = output.toDataURL('image/png');
    link.click();
  }
}

window.KitabahPad = KitabahPad;
