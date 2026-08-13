<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resellers — Scan it. Know what it's worth.</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#0A0E12;
    --surface:#12171D;
    --surface-2:#1A2027;
    --surface-3:#212832;
    --stroke:#242B33;
    --stroke-soft:#1C232B;
    --text:#F4F6F8;
    --text-dim:#8993A1;
    --text-faint:#586170;
    --mint:#2EE6A6;
    --mint-dim:#173B2E;
    --gold:#F0B429;
    --gold-dim:#3A2E12;
    --coral:#FF6859;
  }

  *{ box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color: transparent; }

  html,body{
    height:100%;
    background:var(--ink);
    background-image:
      radial-gradient(circle at 15% 8%, rgba(46,230,166,0.07), transparent 40%),
      radial-gradient(circle at 85% 92%, rgba(240,180,41,0.06), transparent 45%);
    font-family:'Space Grotesk', system-ui, sans-serif;
    color:var(--text);
    display:flex;
    align-items:center;
    justify-content:center;
    overflow:hidden;
  }

  .mono{ font-family:'Space Mono', ui-monospace, monospace; }

  .stage{
    width:100vw; height:100vh;
    display:flex; align-items:center; justify-content:center;
  }
  .phone{
    position:relative;
    width:100vw; height:100vh;
    border-radius:0;
    background:var(--ink);
    overflow:hidden;
  }
  @media (min-width:560px){
    .phone{
      width:390px; height:844px;
      border-radius:56px;
      border:10px solid #050708;
      box-shadow:
        0 40px 90px -20px rgba(0,0,0,0.7),
        0 0 0 1px rgba(255,255,255,0.04);
    }
  }

  .screen{
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    overflow-y:auto;
    overflow-x:hidden;
    scrollbar-width:none;
  }
  .screen::-webkit-scrollbar{ display:none; }

  .statusbar{
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 28px 6px;
    font-size:14px; font-weight:600; letter-spacing:0.2px;
    flex-shrink:0;
  }
  .island{
    position:absolute; top:12px; left:50%; transform:translateX(-50%);
    width:110px; height:30px; background:#000; border-radius:20px;
    display:none;
    z-index:20;
  }
  @media (min-width:560px){ .island{ display:block; } }

  .app-header{
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 22px 10px;
    flex-shrink:0;
  }
  .brand{ display:flex; align-items:center; gap:10px; }
  .brand-mark{
    width:34px; height:34px; border-radius:10px;
    background:linear-gradient(135deg, var(--mint), var(--gold));
    display:flex; align-items:center; justify-content:center;
    position:relative;
    box-shadow:0 4px 14px rgba(46,230,166,0.25);
  }
  .brand-mark svg{ width:18px; height:18px; }
  .brand-name{ font-size:18px; font-weight:700; letter-spacing:-0.3px; }
  .brand-name span{ color:var(--mint); }
  .icon-btn{
    width:36px; height:36px; border-radius:11px;
    background:var(--surface-2); border:1px solid var(--stroke);
    display:flex; align-items:center; justify-content:center;
    color:var(--text-dim);
  }

  .content{ padding:6px 20px 130px; flex:1; }

  .scan-card{
    position:relative;
    height:250px;
    border-radius:26px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)),
      var(--surface);
    border:1px solid var(--stroke);
    overflow:hidden;
    display:flex; align-items:center; justify-content:center;
    margin-top:8px;
    cursor:pointer;
  }
  .scan-frame{
    position:relative;
    width:190px; height:130px;
  }
  .corner{
    position:absolute; width:26px; height:26px;
    border-color:var(--mint); border-style:solid; border-width:0;
  }
  .corner.tl{ top:0; left:0; border-top-width:3px; border-left-width:3px; border-radius:8px 0 0 0; }
  .corner.tr{ top:0; right:0; border-top-width:3px; border-right-width:3px; border-radius:0 8px 0 0; }
  .corner.bl{ bottom:0; left:0; border-bottom-width:3px; border-left-width:3px; border-radius:0 0 0 8px; }
  .corner.br{ bottom:0; right:0; border-bottom-width:3px; border-right-width:3px; border-radius:0 0 8px 0; }
  .scan-line{
    position:absolute; left:4%; width:92%; height:2px;
    background:linear-gradient(90deg, transparent, var(--mint), transparent);
    box-shadow:0 0 12px 1px rgba(46,230,166,0.7);
    top:6px;
    animation: sweep 2.2s ease-in-out infinite;
  }
  @keyframes sweep{
    0%,100%{ top:4px; opacity:.9;}
    50%{ top:122px; opacity:.5;}
  }
  .scan-caption{
    position:absolute; bottom:16px; left:0; right:0;
    text-align:center; font-size:12.5px; color:var(--text-dim);
    letter-spacing:0.2px;
  }
  .shutter-hint{
    position:absolute; top:14px; right:16px;
    font-size:10.5px; font-weight:600; letter-spacing:0.6px; text-transform:uppercase;
    color:var(--gold); background:rgba(240,180,41,0.1);
    border:1px solid rgba(240,180,41,0.3);
    padding:4px 9px; border-radius:20px;
    z-index:5;
  }

  #scannerContainer{
    position:absolute; inset:0; z-index:1;
  }
  #scannerContainer video, #scannerContainer canvas{
    position:absolute; top:0; left:0;
    width:100% !important; height:100% !important;
    object-fit:cover;
  }
  .cam-tint{
    position:absolute; inset:0; z-index:2;
    background:linear-gradient(180deg, rgba(10,14,18,0.35), rgba(10,14,18,0.1) 40%, rgba(10,14,18,0.45));
    display:none;
  }
  .scan-card.camera-active .cam-tint{ display:block; }
  .scan-card.camera-active .scan-frame{ z-index:3; }
  .scan-card.camera-active .scan-caption,
  .scan-card.camera-active .shutter-hint{ z-index:6; }

  .manual-fallback{
    position:absolute; left:16px; right:16px; bottom:16px; z-index:8;
    display:none; gap:8px;
    background:rgba(18,23,29,0.92);
    border:1px solid var(--stroke); border-radius:14px;
    padding:10px;
    backdrop-filter:blur(6px);
  }
  .manual-fallback.show{ display:flex; }
  .manual-fallback input{
    flex:1; min-width:0;
    background:var(--surface-2); border:1px solid var(--stroke);
    border-radius:10px; padding:9px 11px;
    color:var(--text); font-family:'Space Mono', monospace; font-size:13px;
  }
  .manual-fallback input::placeholder{ color:var(--text-faint); }
  .manual-fallback button{
    border:none; border-radius:10px; padding:0 14px;
    background:var(--mint); color:#062017; font-weight:700; font-size:12.5px;
    font-family:'Space Grotesk', sans-serif;
  }
  .cam-permission-note{
    position:absolute; left:16px; right:16px; top:44px; z-index:6;
    font-size:11px; color:var(--text-dim); text-align:center;
    display:none;
  }
  .cam-permission-note.show{ display:block; }

  .analyzing{
    position:absolute; inset:0;
    background:var(--surface);
    display:none;
    flex-direction:column; align-items:center; justify-content:center;
    gap:16px;
    border-radius:26px;
  }
  .analyzing.show{ display:flex; }
  .ring{
    width:44px; height:44px; border-radius:50%;
    border:3px solid var(--stroke);
    border-top-color:var(--mint);
    animation:spin 0.8s linear infinite;
  }
  @keyframes spin{ to{ transform:rotate(360deg); } }
  .analyzing-text{ font-size:13px; color:var(--text-dim); }

  #result{
    opacity:0; transform:translateY(14px);
    pointer-events:none;
    transition:opacity 0.5s ease, transform 0.5s ease;
  }
  #result.visible{ opacity:1; transform:translateY(0); pointer-events:auto; }

  .section-label{
    font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase;
    color:var(--text-faint); margin:26px 2px 10px;
  }

  .product-card{
    display:flex; align-items:center; gap:13px;
    background:var(--surface); border:1px solid var(--stroke);
    border-radius:18px; padding:13px 14px;
  }
  .product-thumb{
    width:54px; height:54px; border-radius:13px; flex-shrink:0;
    background:linear-gradient(160deg, #232A33, #171C22);
    display:flex; align-items:center; justify-content:center;
    color:var(--text-faint);
  }
  .product-info{ flex:1; min-width:0; }
  .product-name{ font-size:14.5px; font-weight:600; line-height:1.25; }
  .product-meta{ font-size:12px; color:var(--text-dim); margin-top:3px; }
  .badge-found{
    flex-shrink:0; font-size:10px; font-weight:700; color:var(--mint);
    background:var(--mint-dim); padding:5px 9px; border-radius:20px;
    letter-spacing:0.3px;
  }

  .ticket{
    margin-top:14px;
    background:var(--surface);
    border:1px solid var(--stroke);
    border-radius:22px;
    overflow:hidden;
  }
  .ticket-barcode{
    height:26px;
    background-repeat:repeat-x;
    background-image: repeating-linear-gradient(90deg,
      var(--surface-3) 0px, var(--surface-3) 2px,
      transparent 2px, transparent 4px,
      var(--surface-3) 4px, var(--surface-3) 5px,
      transparent 5px, transparent 8px,
      var(--surface-3) 8px, var(--surface-3) 11px,
      transparent 11px, transparent 13px);
    opacity:0.8;
  }
  .ticket-body{ padding:18px 18px 20px; position:relative; }

  .confidence-row{
    display:flex; align-items:center; gap:6px;
    font-size:11.5px; color:var(--mint); font-weight:600;
    margin-bottom:16px;
  }
  .dot{ width:6px; height:6px; border-radius:50%; background:var(--mint); }

  .price-grid{
    display:grid; grid-template-columns:1fr 1fr 1fr;
    text-align:center;
    padding-bottom:16px;
  }
  .price-grid .col{ display:flex; flex-direction:column; gap:5px; }
  .price-grid .col:not(:last-child){ border-right:1px solid var(--stroke-soft); }
  .price-label{ font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--text-faint); font-weight:700; }
  .price-value{ font-size:21px; font-weight:700; letter-spacing:-0.5px; }
  .price-value.min{ color:var(--coral); }
  .price-value.avg{ color:var(--text); }
  .price-value.max{ color:var(--gold); }

  .gauge-wrap{ padding-top:4px; }
  .gauge-track{
    position:relative;
    height:8px; border-radius:10px;
    background:linear-gradient(90deg, var(--coral), var(--gold) 45%, var(--mint) 100%);
    opacity:0.85;
  }
  .gauge-marker{
    position:absolute; top:50%;
    width:16px; height:16px; border-radius:50%;
    background:var(--text);
    border:3px solid var(--ink);
    box-shadow:0 0 0 2px var(--text), 0 2px 8px rgba(0,0,0,0.5);
    transform:translate(-50%,-50%) scale(0);
    transition:left 0.9s cubic-bezier(.2,.9,.25,1.3), transform 0.5s ease 0.5s;
  }
  .gauge-marker.show{ transform:translate(-50%,-50%) scale(1); }
  .gauge-caption{
    position:absolute; top:16px; white-space:nowrap;
    transform:translateX(-50%);
    font-size:10.5px; font-weight:700; color:var(--text);
    opacity:0; transition:opacity 0.4s ease 0.9s;
  }
  .gauge-caption.show{ opacity:1; }
  .refs-count{
    margin-top:34px; font-size:11.5px; color:var(--text-dim); text-align:center;
  }

  .opportunity{
    display:inline-flex; align-items:center; gap:6px;
    margin-top:16px;
    font-size:12px; font-weight:700;
    background:var(--gold-dim); color:var(--gold);
    border:1px solid rgba(240,180,41,0.35);
    padding:7px 12px; border-radius:20px;
  }

  .advice-card{
    margin-top:14px;
    background:var(--surface); border:1px solid var(--stroke);
    border-radius:20px; padding:18px;
  }
  .advice-head{ display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .advice-avatar{
    width:30px; height:30px; border-radius:10px;
    background:linear-gradient(135deg, var(--mint), #17997A);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .advice-title{ font-size:13px; font-weight:700; }
  .advice-text{
    font-size:13.5px; line-height:1.55; color:#D3D8DE;
  }
  .advice-text b{ color:var(--text); font-weight:700; }

  .suggested-row{
    margin-top:16px;
    display:flex; align-items:center; justify-content:space-between;
    background:var(--surface-2); border:1px solid var(--stroke);
    border-radius:14px; padding:12px 15px;
  }
  .suggested-label{ font-size:11px; color:var(--text-dim); font-weight:600; }
  .suggested-value{ font-size:22px; font-weight:700; color:var(--mint); }
  .margin-note{ font-size:11px; color:var(--text-faint); margin-top:2px; }

  .cta-bar{
    position:absolute; left:0; right:0; bottom:0;
    padding:14px 20px calc(22px + env(safe-area-inset-bottom));
    background:linear-gradient(180deg, rgba(10,14,18,0), var(--ink) 30%);
    opacity:0; transform:translateY(10px);
    transition:opacity 0.5s ease, transform 0.5s ease;
    pointer-events:none;
  }
  .cta-bar.visible{ opacity:1; transform:translateY(0); pointer-events:auto; }
  .cta-btn{
    width:100%; border:none; border-radius:16px;
    padding:16px; font-family:'Space Grotesk', sans-serif;
    font-size:15px; font-weight:700; letter-spacing:0.2px;
    background:linear-gradient(135deg, var(--mint), #1FCB93);
    color:#062017;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow:0 10px 24px -6px rgba(46,230,166,0.45);
  }
  .home-indicator{
    position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
    width:130px; height:4px; border-radius:4px; background:rgba(255,255,255,0.35);
  }

  @media (prefers-reduced-motion: reduce){
    .scan-line, .ring{ animation:none !important; }
    *{ transition-duration:0.01ms !important; }
  }
</style>
</head>
<body>

<div class="stage">
  <div class="phone">
    <div class="island"></div>
    <div class="screen" id="screen">

      <div class="statusbar">
        <span>9:41</span>
        <span class="mono" style="font-size:11px;">●●●●</span>
      </div>

      <div class="app-header">
        <div class="brand">
          <div class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="2.4" height="12" fill="#062017"/>
              <rect x="6" y="6" width="1.2" height="12" fill="#062017"/>
              <rect x="9" y="6" width="3" height="12" fill="#062017"/>
              <rect x="14" y="6" width="1.2" height="12" fill="#062017"/>
              <rect x="17" y="6" width="2.4" height="12" fill="#062017"/>
              <rect x="21" y="6" width="1.2" height="12" fill="#062017"/>
            </svg>
          </div>
          <div class="brand-name">Re<span>sellers</span></div>
        </div>
        <div class="icon-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
      </div>

      <div class="content">

        <div style="margin:10px 2px 14px;">
          <div class="price-label" style="margin-bottom:6px;">Store cost (optional)</div>
          <input id="costInput" class="mono" type="text" inputmode="decimal" placeholder="e.g. 12.99"
            style="width:100%;background:var(--surface);border:1px solid var(--stroke);border-radius:12px;color:var(--text);padding:11px 13px;font-size:14px;">
        </div>

        <div class="scan-card" id="scanCard" onclick="startScanner()">
          <div id="scannerContainer"></div>
          <div class="cam-tint"></div>

          <div class="shutter-hint" id="shutterHint">Tap to scan</div>
          <div class="cam-permission-note" id="camNote">Camera live — point at the barcode</div>

          <div class="scan-frame">
            <div class="corner tl"></div><div class="corner tr"></div>
            <div class="corner bl"></div><div class="corner br"></div>
            <div class="scan-line"></div>
          </div>
          <div class="scan-caption">Point at the barcode on the tag</div>

          <div class="manual-fallback" id="manualFallback" onclick="event.stopPropagation()">
            <input id="manualInput" class="mono" type="text" inputmode="numeric" placeholder="Enter the barcode…">
            <button onclick="submitManual()">Search</button>
          </div>

          <div class="analyzing" id="analyzing">
            <div class="ring"></div>
            <div class="analyzing-text">Checking eBay sales…</div>
          </div>
        </div>

        <div id="result">

          <div class="section-label">Product identified</div>
          <div class="product-card">
            <div class="product-thumb">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/>
              </svg>
            </div>
            <div class="product-info">
              <div class="product-name" id="productName">—</div>
              <div class="product-meta">Scanned code <span class="mono" id="scannedCode">—</span></div>
            </div>
            <div class="badge-found">✓ Read</div>
          </div>

          <div class="section-label">eBay price range</div>
          <div class="ticket">
            <div class="ticket-barcode"></div>
            <div class="ticket-body">
              <div class="confidence-row"><span class="dot"></span> <span id="confidenceText">Checking…</span></div>
              <div style="font-size:10.5px;color:var(--text-faint);margin:-10px 0 14px;line-height:1.5;" id="sourceNote">
                Prices come from eBay's live Browse API (active listings).
              </div>

              <div class="price-grid">
                <div class="col">
                  <div class="price-label">Low</div>
                  <div class="price-value min mono" id="valMin">$0</div>
                </div>
                <div class="col">
                  <div class="price-label">Average</div>
                  <div class="price-value avg mono" id="valAvg">$0</div>
                </div>
                <div class="col">
                  <div class="price-label">High</div>
                  <div class="price-value max mono" id="valMax">$0</div>
                </div>
              </div>

              <div class="gauge-wrap">
                <div class="gauge-track">
                  <div class="gauge-marker" id="gaugeMarker"></div>
                  <div class="gauge-caption" id="gaugeCaption">Suggested $0</div>
                </div>
                <div class="refs-count" id="refsCount">— references analyzed</div>
              </div>

              <div class="opportunity" id="opportunityPill">— </div>
            </div>
          </div>

          <div class="section-label">Recommendation</div>
          <div class="advice-card">
            <div class="advice-head">
              <div class="advice-avatar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#062017" stroke-width="2.4">
                  <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>
                </svg>
              </div>
              <div class="advice-title">Resellers Insight</div>
            </div>
            <div class="advice-text" id="adviceText">—</div>
            <div class="suggested-row">
              <div>
                <div class="suggested-label">SUGGESTED PRICE</div>
                <div class="margin-note">Estimated profit after fees & shipping</div>
              </div>
              <div style="text-align:right;">
                <div class="suggested-value mono" id="suggestedValue">$0</div>
                <div class="margin-note" id="marginNote">—</div>
              </div>
            </div>
          </div>

        </div>

        <div id="notFound" style="display:none;text-align:center;padding:30px 10px;color:var(--text-dim);font-size:13.5px;">
          No eBay price references found for this product.
        </div>

      </div>

    </div>

    <div class="cta-bar" id="ctaBar">
      <button class="cta-btn" id="ctaBtn">
        <span id="ctaLabel">List on eBay</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#062017" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </button>
    </div>

    <div class="home-indicator"></div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js"></script>
<script>
  let scanned = false;
  let quaggaRunning = false;
  let fallbackTimer = null;

  function countUp(el, target, prefix, duration){
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function startScanner(){
    if(scanned || quaggaRunning) return;
    const hint = document.getElementById('shutterHint');
    hint.textContent = 'Requesting camera…';

    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      showManualFallback('This browser can\'t access the camera here.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        initQuagga();
      })
      .catch(() => {
        showManualFallback('Couldn\'t access the camera. Type the code instead:');
      });
  }

  function initQuagga(){
    if(typeof Quagga === 'undefined'){
      showManualFallback('Couldn\'t load the scanner. Type the code instead:');
      return;
    }

    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: document.querySelector('#scannerContainer'),
        constraints: { facingMode: 'environment', width: 640, height: 480 }
      },
      locator: { patchSize: 'medium', halfSample: true },
      numOfWorkers: 2,
      frequency: 8,
      decoder: { readers: ['ean_reader','ean_8_reader','upc_reader','upc_e_reader','code_128_reader'] },
      locate: true
    }, function(err){
      if(err){
        showManualFallback('Couldn\'t start the scanner. Type the code instead:');
        return;
      }
      Quagga.start();
      quaggaRunning = true;
      document.getElementById('scanCard').classList.add('camera-active');
      document.getElementById('shutterHint').style.display = 'none';
      document.getElementById('camNote').classList.add('show');

      fallbackTimer = setTimeout(() => {
        if(!scanned) showManualFallback('Not detecting? Type the code instead:');
      }, 10000);
    });

    Quagga.onDetected(handleDetected);
  }

  function handleDetected(result){
    if(scanned) return;
    const code = result && result.codeResult ? result.codeResult.code : null;
    if(!code) return;
    scanned = true;
    clearTimeout(fallbackTimer);
    if(quaggaRunning){ Quagga.stop(); quaggaRunning = false; }
    proceedWithCode(code);
  }

  function showManualFallback(message){
    if(scanned) return;
    clearTimeout(fallbackTimer);
    document.getElementById('shutterHint').style.display = 'none';
    document.getElementById('camNote').classList.remove('show');
    const fb = document.getElementById('manualFallback');
    fb.classList.add('show');
    document.getElementById('manualInput').placeholder = message;
    document.getElementById('manualInput').focus();
  }

  function submitManual(){
    const val = document.getElementById('manualInput').value.trim();
    if(!val || scanned) return;
    scanned = true;
    clearTimeout(fallbackTimer);
    if(quaggaRunning){ Quagga.stop(); quaggaRunning = false; }
    document.getElementById('manualFallback').classList.remove('show');
    proceedWithCode(val);
  }

  const BACKEND_URL = 'https://reseller-backend-9exp.onrender.com';

  const OPPORTUNITY_LABELS = {
    especial: '🌟 Special opportunity',
    buena: '✅ Good opportunity',
    normal: '🙂 Normal opportunity',
    no_recomendado: '⚠️ Not recommended',
    sin_costo: 'ℹ️ Add store cost for a full recommendation'
  };

  function proceedWithCode(code){
    document.getElementById('camNote').classList.remove('show');
    document.getElementById('scannedCode').textContent = code;
    document.getElementById('analyzing').classList.add('show');
    document.getElementById('notFound').style.display = 'none';
    document.getElementById('result').classList.remove('visible');
    document.getElementById('ctaBar').classList.remove('visible');

    const costRaw = document.getElementById('costInput').value.trim();
    const costPrice = costRaw ? Number(costRaw) : undefined;

    fetch(BACKEND_URL + '/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: code, costPrice })
    })
      .then(res => res.json())
      .then(data => {
        document.getElementById('analyzing').classList.remove('show');
        document.getElementById('scannerContainer').style.display = 'none';

        if (!data.found) {
          document.getElementById('notFound').style.display = 'block';
          document.getElementById('screen').scrollTo({ top: 60, behavior: 'smooth' });
          return;
        }

        renderResult(data);
      })
      .catch(err => {
        document.getElementById('analyzing').classList.remove('show');
        document.getElementById('scannerContainer').style.display = 'none';
        document.getElementById('notFound').textContent = 'Could not reach the backend. Please try again.';
        document.getElementById('notFound').style.display = 'block';
      });
  }

  function renderResult(data){
    const min = data.min, avg = data.avg, max = data.max, median = data.median, suggested = data.suggested;

    document.getElementById('productName').textContent =
      (data.product && data.product.title) || data.query || 'Product';

    document.getElementById('confidenceText').textContent =
      data.confidence === 'alta'
        ? `High confidence — ${data.referenceCount} confirmed sales`
        : `Estimated from ${data.referenceCount} active listings`;

    document.getElementById('sourceNote').textContent =
      data.dataSource === 'sold_confirmed'
        ? 'Prices come from confirmed eBay sales.'
        : "Prices come from eBay's live Browse API (active listings, not confirmed sales).";

    countUp(document.getElementById('valMin'), min, '$', 700);
    countUp(document.getElementById('valAvg'), avg, '$', 900);
    countUp(document.getElementById('valMax'), max, '$', 1100);

    const range = Math.max(max - min, 0.01);
    const markerPos = Math.min(100, Math.max(0, ((suggested - min) / range) * 100));

    document.getElementById('gaugeCaption').textContent = `Suggested $${suggested}`;
    document.getElementById('refsCount').textContent = `${data.referenceCount} references analyzed`;

    document.getElementById('opportunityPill').textContent =
      OPPORTUNITY_LABELS[data.opportunity] || data.opportunity;

    document.getElementById('adviceText').innerHTML =
      `Most references cluster around the median of <b>$${median}</b>. We suggest listing at <b>$${suggested}</b>: it balances the bulk of the market (avg $${avg}) without giving away margin.`;

    document.getElementById('suggestedValue').textContent = `$${suggested}`;
    document.getElementById('marginNote').textContent =
      data.estimatedMargin != null ? `≈ $${data.estimatedMargin} margin` : 'Add store cost to see margin';

    document.getElementById('ctaLabel').textContent = `List on eBay for $${suggested}`;

    document.getElementById('result').classList.add('visible');
    document.getElementById('ctaBar').classList.add('visible');

    const marker = document.getElementById('gaugeMarker');
    const caption = document.getElementById('gaugeCaption');
    marker.style.left = markerPos + '%';
    caption.style.left = markerPos + '%';

    requestAnimationFrame(() => {
      marker.classList.add('show');
      caption.classList.add('show');
    });

    document.getElementById('screen').scrollTo({ top: 60, behavior: 'smooth' });
  }
</script>

</body>
</html>
