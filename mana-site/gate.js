/* Private site: everyone enters the access code once per device (remembered in this browser).
   Note: this is a simple lock for a static site — it keeps casual visitors out, not a determined one. */
(function(){
  var KEY = "site_ok_v1", HASH = "6b5f40c09215713a1fa83ea2de2adcae17e605b8958a2d7379e15b561687ee8f";
  try { if(localStorage.getItem(KEY) === HASH) return; } catch(e){}
  var root = document.documentElement; root.classList.add("locked");
  var css = document.createElement("style");
  css.textContent = "html.locked body>*:not(#gate){display:none!important}" +
    "#gate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:#1B1530;font-family:Almarai,Tahoma,sans-serif;color:#fff;direction:rtl}" +
    "#gate form{width:100%;max-width:340px;display:flex;flex-direction:column;gap:14px;text-align:center}" +
    "#gate .ic{font-size:2.6rem}#gate h1{margin:0;font-size:1.5rem}#gate p{margin:0;opacity:.75;font-weight:700}" +
    "#gate input{font:800 2rem/1 Almarai,Tahoma,sans-serif;letter-spacing:.4em;text-align:center;direction:ltr;padding:12px;border-radius:14px;border:3px solid #fff;background:#fff;color:#1B1530;width:100%}" +
    "#gate button{font:800 1.2rem Almarai,Tahoma,sans-serif;padding:12px;border-radius:14px;border:3px solid #fff;background:#FF3E8A;color:#fff;cursor:pointer}" +
    "#gate .err{color:#FF8FA9;min-height:1.4em;font-weight:800}";
  document.head.appendChild(css);
  async function sha(s){ var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join(""); }
  function build(){
    var g = document.createElement("div"); g.id = "gate";
    g.innerHTML = '<form autocomplete="off"><div class="ic">🔒</div><h1>الموقع خاص</h1><p>اكتب الرمز عشان تدخل</p>' +
      '<input id="gateCode" inputmode="numeric" maxlength="8" aria-label="الرمز" autofocus><button type="submit">ادخل</button><div class="err" role="alert"></div></form>';
    document.body.appendChild(g);
    var f = g.querySelector("form"), inp = g.querySelector("input"), err = g.querySelector(".err");
    inp.focus();
    f.addEventListener("submit", async function(e){
      e.preventDefault();
      var v = inp.value.trim().replace(/[٠-٩]/g, function(d){ return "٠١٢٣٤٥٦٧٨٩".indexOf(d); });
      if(await sha(v) === HASH){ try { localStorage.setItem(KEY, HASH); } catch(e){} g.remove(); root.classList.remove("locked"); }
      else { err.textContent = "الرمز غلط، جرّب مرة ثانية"; inp.select(); }
    });
  }
  if(document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
