# -*- coding: utf-8 -*-
# 方向2「教習車より速いのは6台、候補は4台」 ── lowrev-torque の混雑帯を拡大・再掲した図。
# 物差しは ●＝各車が60km/hを流すときの「加速の力」。教習車CB400SFの●の高さを基準線に置く。
# 6台が基準より上 → うち ZX-4R（公道で使えない本命）と旧CBR400R直4（生産終了）を候補外にして、残る4台を比較する。
import os
# 出力先はスクリプト位置からの相対（../assets）。どのworktreeでも正しく出る。
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))

# --- 座標系（拡大：rpm 2000-8000 × 力 0.088-0.172）---
R = 60
RPM0, RPM1 = 2000, 8000
V0, V1 = 0.088, 0.172
PX, PW = 92, 590
PY, PH = 96, 486
VBW, VBH = 900, 700
def X(r): return PX + (r-RPM0)/(RPM1-RPM0)*PW
def Y(v): return PY + (1-(v-V0)/(V1-V0))*PH
def interp(pts, r):
    for i in range(len(pts)-1):
        if pts[i][0] <= r <= pts[i+1][0]:
            (a,b),(c,d) = pts[i],pts[i+1]; return b+(d-b)*(r-a)/(c-a)
    return pts[-1][1] if r>pts[-1][0] else pts[0][1]

GREEN="#5fcf5f"; LIME="#b7d84a"; BLUE="#5a90e8"; PURPLE="#b98ae0"; RED="#e8685f"; GREY="#aeb4c0"
# name, torque_pts, weight, k60, color, width, kind  (kind: base/cand/out)
B=[
 ("CB400SF（教習車・前世代）",[(2000,20),(3000,24),(4000,28),(6000,34),(8000,38)],201,4000,GREY,3.4,"base"),
 ("エリミネーター",       [(2000,26),(3000,32),(4000,35),(5000,36.5),(6000,37),(8000,35)],177,3800,GREEN,5.4,"cand"),
 ("Ninja 400",          [(2000,18),(3000,24),(4000,30),(5000,34),(6000,36),(8000,38)],167,4000,LIME,5.4,"cand"),
 ("CBR400R（並列2気筒）", [(2000,19),(3000,25),(4000,31),(5000,35),(6000,37),(7500,38),(8000,37.6)],192,4200,BLUE,5.4,"cand"),
 ("YZF-R3",             [(2000,14),(3000,19),(4000,23),(5000,26),(6000,28),(8000,30)],169,4700,PURPLE,5.4,"cand"),
 ("ZX-4R",              [(2000,20),(4000,28),(6000,32),(8000,35)],189,6000,RED,2.4,"out"),
 ("CBR400R FOUR",        [(2000,18),(3000,23),(4000,28),(6000,33),(8000,36)],200,4500,RED,2.4,"out"),
]

o=[]
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(VBW,VBH))
o.append('<rect x="0" y="0" width="%d" height="%d" fill="#232733"/>'%(VBW,VBH))
o.append('<text x="%d" y="40" fill="#e6e6e6" font-size="27" font-weight="800">教習車より速いのは6台、普段使いの候補は4台</text>'%PX)
o.append('<text x="%d" y="68" fill="#9aa0aa" font-size="16">●＝各車が60km/hを流すときの力。<tspan fill="#c7ccd6" font-weight="700">教習車の●より上が6台</tspan>、<tspan fill="#e8685f" font-weight="700">赤の2台は候補外</tspan>。</text>'%PX)

base = B[0]
base_v = interp(base[1], base[3])/(base[2]+R)
yb = Y(base_v)
o.append('<rect x="%d" y="%.1f" width="%d" height="%.1f" fill="#aeb4c0" opacity="0.05"/>'%(PX, yb, PW, PY+PH-yb))
o.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#aeb4c0" stroke-width="1.6" stroke-dasharray="7 5" opacity="0.75"/>'%(PX, yb, PX+PW, yb))
o.append('<text x="%d" y="%.1f" fill="#9aa0aa" font-size="16">↓ この線より下は教習車に届かない</text>'%(PX+PW-250, yb+24))

o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.6"/>'%(PX,PY,PX,PY+PH))
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.6"/>'%(PX,PY+PH,PX+PW,PY+PH))
for k in [2,3,4,5,6,7,8]:
    x=X(k*1000)
    o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(x,PY,x,PY+PH))
    o.append('<text x="%.1f" y="%d" fill="#cdd2dd" font-size="16" text-anchor="middle">%d,000</text>'%(x,PY+PH+26,k))
o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="16" text-anchor="middle">エンジン回転数（rpm）　●＝60km/hで流すときの回転</text>'%(PX+PW/2, PY+PH+52))
o.append('<text x="30" y="%d" fill="#cdd2dd" font-size="16" font-weight="600" text-anchor="middle" transform="rotate(-90 30 %d)">加速の力（トルク/重量）→</text>'%(PY+PH//2, PY+PH//2))

for nm,pts,w,k60,c,wd,kind in B:
    seg=[(r,v) for r,v in pts if RPM0<=r<=RPM1]
    p=" ".join("%.1f,%.1f"%(X(r),Y(v/(w+R))) for r,v in seg)
    da=' stroke-dasharray="9 6"' if kind=="base" else (' stroke-dasharray="4 4"' if kind=="out" else '')
    op=' opacity="0.65"' if kind=="out" else ''
    o.append('<polyline fill="none" stroke="%s" stroke-width="%s"%s%s stroke-linejoin="round" points="%s"/>'%(c,wd,da,op,p))
for nm,pts,w,k60,c,wd,kind in B:
    r=6 if kind=="out" else 7.5
    o.append('<circle cx="%.1f" cy="%.1f" r="%s" fill="%s" stroke="#232733" stroke-width="2"/>'%(X(k60),Y(interp(pts,k60)/(w+R)),r,c))

# 凡例：候補4台 → 候補外2台 → 教習車 の順
lx,ly=PX+18,PY+20
o.append('<text x="%d" y="%d" fill="#9aa0aa" font-size="15" font-weight="700">■ 普段使いの候補（4台）</text>'%(lx,ly-6))
ly+=12
for nm,pts,w,k60,c,wd,kind in B:
    if kind!="cand": continue
    o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="5.4"/>'%(lx,ly+6,lx+40,ly+6,c))
    o.append('<text x="%d" y="%d" fill="%s" font-size="18" font-weight="800">%s</text>'%(lx+50,ly+12,c,nm))
    ly+=31
ly+=8
o.append('<text x="%d" y="%d" fill="#e8685f" font-size="15" font-weight="700">■ 上回るが候補外（2台）</text>'%(lx,ly))
ly+=10
for nm,pts,w,k60,c,wd,kind in B:
    if kind!="out": continue
    note = "公道で使えない本命" if nm=="ZX-4R" else "直4・まだ発売前"
    o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.6" stroke-dasharray="4 4"/>'%(lx,ly+6,lx+40,ly+6,c))
    o.append('<text x="%d" y="%d" fill="#e8685f" font-size="16">%s<tspan fill="#9aa0aa" font-size="14">（%s）</tspan></text>'%(lx+50,ly+11,nm,note))
    ly+=27
ly+=8
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3.4" stroke-dasharray="9 6"/>'%(lx,ly+6,lx+40,ly+6,GREY))
o.append('<text x="%d" y="%d" fill="%s" font-size="16" font-weight="700">CB400SF（教習車・前世代＝基準）</text>'%(lx+50,ly+11,GREY))

o.append('</svg>')
open(os.path.join(OUT,"faster-than-cb400sf.svg"),"w").write("\n".join(o))
print("wrote", os.path.join(OUT,"faster-than-cb400sf.svg"))
