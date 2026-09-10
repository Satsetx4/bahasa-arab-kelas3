// Papan Tulis Digital Maharatul Kitabah (Keterampilan Menulis Arab)
// Mendukung Touch Screen (HP/Tablet) & Mouse (Laptop/PC)
// Dilengkapi garis panduan Khat Naskh dan fitur tracing huruf/kata

class KitabahPad {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.isDrawing = false;
    this.currentColor = '#1e293b';
    this.lineWidth = 6;
    this.isEraser = false;
    this.currentTemplateWord = 'دَفْتَرٌ';
    this.showGuideline = true;
    this.history = [];
    this.historyStep = -1;

    this.initCanvasSize();
    this.attachEvents();
    this.renderTemplate(this.currentTemplateWord);
  }

  initCanvasSize() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Set actual resolution
    this.canvas.width = rect.width || 700;
    this.canvas.height = 360;
    this.clearCanvas();
  }

  attachEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.endDraw());
    this.canvas.addEventListener('mouseleave', () => this.endDraw());

    // Touch events for tablets & smartphones
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent('mouseup', {});
      this.canvas.dispatchEvent(mouseEvent);
    }, { passive: false });

    window.addEventListener('resize', () => {
      // Re-init with preserved drawing if needed
    });
  }

  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  startDraw(e) {
    this.isDrawing = true;
    const coords = this.getCoords(e);
    this.lastX = coords.x;
    this.lastY = coords.y;

    this.ctx.beginPath();
    this.ctx.moveTo(coords.x, coords.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    const coords = this.getCoords(e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(coords.x, coords.y);

    if (this.isEraser) {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = this.lineWidth * 3;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.lineWidth;
    }

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  endDraw() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.saveState();
  }

  saveState() {
    this.historyStep++;
    if (this.historyStep < this.history.length) {
      this.history.length = this.historyStep;
    }
    this.history.push(this.canvas.toDataURL());
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      const canvasPic = new Image();
      canvasPic.src = this.history[this.historyStep];
      canvasPic.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(canvasPic, 0, 0);
      };
    } else if (this.historyStep === 0) {
      this.clearCanvas();
      this.historyStep = -1;
    }
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

  clearCanvas() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGuidelines();
    if (this.currentTemplateWord && this.showGuideline) {
      this.drawTemplateText(this.currentTemplateWord);
    }
  }

  drawGuidelines() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerY = h * 0.58;

    this.ctx.save();
    // Garis dasar (Baseline khat)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.5;
    this.ctx.moveTo(20, centerY);
    this.ctx.lineTo(w - 20, centerY);
    this.ctx.stroke();

    // Garis batas atas
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.setLineDash([6, 6]);
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(20, centerY - 70);
    this.ctx.lineTo(w - 20, centerY - 70);
    this.ctx.stroke();

    // Garis batas bawah (ekor huruf ro, ya, mim)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.setLineDash([6, 6]);
    this.ctx.moveTo(20, centerY + 50);
    this.ctx.lineTo(w - 20, centerY + 50);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawTemplateText(word) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerY = h * 0.58;

    this.ctx.save();
    this.ctx.direction = 'rtl';
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold 78px "Amiri", serif';
    this.ctx.fillStyle = 'rgba(203, 213, 225, 0.45)'; // Abu-abu pudar untuk ditiru (tracing)
    this.ctx.fillText(word, w / 2, centerY + 16);
    this.ctx.restore();
  }

  renderTemplate(word) {
    this.currentTemplateWord = word;
    this.clearCanvas();
  }

  toggleGuideline() {
    this.showGuideline = !this.showGuideline;
    this.clearCanvas();
  }

  downloadDrawing() {
    const link = document.createElement('a');
    link.download = `latihan-menulis-${this.currentTemplateWord}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}

// Inisialisasi saat DOM siap
window.KitabahPad = KitabahPad;
