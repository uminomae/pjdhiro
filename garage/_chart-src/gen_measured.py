# -*- coding: utf-8 -*-
# 図C「実測で分かっていること／分かっていないこと」
# 実測ダイノ(Dynojet 250i)のピーク値のみ。曲線は描かない（曲線の実データが無いため）。
# 横軸＝トルクのピークが出る回転数、縦軸＝そのトルク値。カタログ(クランク)を白抜きで併記。
# 出典・換算は garage/data-drivetrain.md
import os
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))

# label, 実測トルクN·m, 実測rpm, カタログN·m(なければNone), カタログrpm, color, kind
KAW="#5fcf5f"; RED="#e8685f"; GREY="#aeb4c0"; ORG="#f0883a"
M=[
 ("Ninja 400",          33.9, 8000, 37, 8000, KAW, "same"),
 ("Z400（同エンジン）",    34.1, 8250, 37, 8000, KAW, "same"),
 ("ZX-25R",             20.8,12700, 21,13000, KAW, "same"),
 ("ZX-4RR（米国仕様）",    35.0,11300, None,None, RED, "ref"),
 ("エリミネーターSE（451cc）",39.4, 7510, None,None, ORG, "ref"),
 ("KTM RC390（参考）",    33.1, 6900, None,None, GREY, "ref"),
]
VBW,VBH=980,650
PX,PW,PY,PH=110,760,120,400
RMIN,RMAX=6000,14000
TMIN,TMAX=18,42
def X(r): return PX+(r-RMIN)/(RMAX-RMIN)*PW
def Y(t): return PY+(1-(t-TMIN)/(TMAX-TMIN))*PH

o=[]
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(VBW,VBH))
o.append('<rect x="0" y="0" width="%d" height="%d" fill="#232733"/>'%(VBW,VBH))
o.append('<text x="40" y="42" fill="#e6e6e6" font-size="26" font-weight="800">実測で分かっているのは、この点だけ</text>')
o.append('<text x="40" y="70" fill="#9aa0aa" font-size="16">シャシダイ実測（Dynojet 250i）のピーク値。<tspan fill="#e6e6e6" font-weight="700">●＝後輪の実測</tspan>／<tspan fill="#e6e6e6" font-weight="700">○＝カタログ（クランク）</tspan>。曲線は引けない。</text>')
o.append('<text x="40" y="94" fill="#9aa0aa" font-size="15"><tspan fill="#e8685f" font-weight="700">赤・橙・灰＝仕様が違う参考値</tspan>（米国仕様／451cc／他社）。国内仕様の値ではない。</text>')

# grid
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(PX,PY,PX,PY+PH))
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(PX,PY+PH,PX+PW,PY+PH))
for t in range(20,43,5):
    o.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#2c313d" stroke-width="1"/>'%(PX,Y(t),PX+PW,Y(t)))
    o.append('<text x="%d" y="%.1f" fill="#9aa0aa" font-size="15" text-anchor="end">%d</text>'%(PX-10,Y(t)+5,t))
for r in range(6000,14001,2000):
    o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(X(r),PY,X(r),PY+PH))
    o.append('<text x="%.1f" y="%d" fill="#cdd2dd" font-size="15" text-anchor="middle">%s</text>'%(X(r),PY+PH+26,"{:,}".format(r)))
o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="16" text-anchor="middle">最大トルクが出る回転数（rpm）</text>'%(PX+PW/2,PY+PH+52))
o.append('<text x="34" y="%d" fill="#cdd2dd" font-size="16" font-weight="600" text-anchor="middle" transform="rotate(-90 34 %d)">最大トルク（N·m）</text>'%(PY+PH//2,PY+PH//2))

# 一般道で使う回転域（60km/h＝3,240〜5,587rpm）は左端の外
o.append('<text x="%d" y="%d" fill="#f0883a" font-size="15" font-weight="700">← 一般道の60km/hは3,200〜5,600rpm。この図の左端より外側で、実測点は1つも無い</text>'%(PX+6,PY+PH-14))

for nm,tm,rm,ct,cr,col,kind in M:
    # カタログ（白抜き）と実測（塗り）を線で結ぶ
    if ct is not None:
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.6" stroke-dasharray="4 3" opacity="0.7"/>'%(X(cr),Y(ct),X(rm),Y(tm),col))
        o.append('<circle cx="%.1f" cy="%.1f" r="7" fill="none" stroke="%s" stroke-width="2.4"/>'%(X(cr),Y(ct),col))
    o.append('<circle cx="%.1f" cy="%.1f" r="8" fill="%s" stroke="#232733" stroke-width="2"/>'%(X(rm),Y(tm),col))
    dy = -16 if nm.startswith(("Z400","ZX-4RR")) else 24
    o.append('<text x="%.1f" y="%.1f" fill="%s" font-size="17" font-weight="700" text-anchor="middle">%s</text>'%(X(rm),Y(tm)+dy,col,nm))

by=PY+PH+72
o.append('<rect x="40" y="%d" width="%d" height="52" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%(by,VBW-80))
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="15">Ninja400とZ400はカタログ37N·mに対し実測33.9／34.1N·m＝<tspan fill="#7fe39a" font-weight="700">後輪までの損失は約8%%</tspan>。実測カーブは各誌とも「フラット」と記述。</text>'%(by+21))
o.append('<text x="54" y="%d" fill="#9aa0aa" font-size="14">※国内仕様の実測が存在するのはNinja400とZX-25Rのみ。ZX-4Rは米国仕様(56hp)、エリミは451ccの値しか無く、国内仕様の証拠にはならない。</text>'%(by+42))
o.append('</svg>')
open(os.path.join(OUT,"measured-peaks.svg"),"w").write("\n".join(o))
print("wrote measured-peaks.svg")
