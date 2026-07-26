# -*- coding: utf-8 -*-
import os
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))
def interp(pts,r):
    for i in range(len(pts)-1):
        if pts[i][0]<=r<=pts[i+1][0]:
            (a,b),(c,d)=pts[i],pts[i+1]; return b+(d-b)*(r-a)/(c-a)
    return pts[-1][1] if r>pts[-1][0] else pts[0][1]
R=60; VMAX=0.16
# name, pts, rpm60, weight, color, width, dash, (label mode)
B=[
 ("エリミSE（最強）",[(2000,26),(3000,32),(4000,35),(5000,36.5),(6000,37),(8000,35)],3800,177,"#47d16c",5,False,"mid"),
 ("Ninja400",[(2000,18),(3000,24),(4000,30),(5000,34),(6000,36),(8000,38)],4000,167,"#4aa3ff",2.6,False,"end"),
 ("ZX-4R",[(2000,20),(4000,28),(6000,32),(8000,35)],6000,189,"#cd7be0",2.6,False,"end"),
 ("CB400SF教習",[(2000,20),(3000,24),(4000,28),(6000,34),(8000,38)],4000,201,"#9aa0aa",2.2,True,"end"),
 ("GSX250R",[(2000,16),(3000,20),(4000,21.5),(5000,22),(6000,22),(8000,20)],4300,178,"#e0a83a",2.6,False,"end"),
 ("ZX-25R（最弱！）",[(2000,4),(4000,7),(6000,10),(8000,14),(10000,18)],6800,183,"#ff5a5a",4.5,False,"end"),
]
SP=[20,30,40,50,60,70,80]
PX0,PX1,PY0,PY1=120,880,100,520
def X(v): return PX0+(v-20)/60*(PX1-PX0)
def Y(val): return PY1-val/VMAX*(PY1-PY0)
o=[]; H=640
o.append('<svg viewBox="0 0 1010 %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%H)
o.append('<rect x="0" y="0" width="1010" height="%d" fill="#232733"/>'%H)
o.append('<text x="40" y="32" fill="#e6e6e6" font-size="18" font-weight="700">一般道での“本当の速さ” ── トップギア巡航の押し出す力 vs 速度（≤80km/h）</text>')
o.append('<text x="40" y="52" fill="#9aa0aa" font-size="12">縦＝roll-onの力＝トルク÷(車重+60kg)／横＝速度。回転数は速度比例で近似（トップギア巡航・概算）。<tspan fill="#e6e6e6">ピークspecでは見えない一般道の実力</tspan>。</text>')
# grid + axes
for val in [0.04,0.08,0.12,0.16]:
    o.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#2c313d" stroke-width="1"/><text x="%d" y="%.1f" fill="#9aa0aa" font-size="16.5" text-anchor="end">%.2f</text>'%(PX0,Y(val),PX1,Y(val),PX0-8,Y(val)+4,val))
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(PX0,PY1,PX1,PY1))
o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(PX0,PY0,PX0,PY1))
for v in SP:
    o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/><text x="%.1f" y="%d" fill="#cdd2dd" font-size="18" text-anchor="middle">%d</text>'%(X(v),PY0,X(v),PY1,X(v),PY1+20,v))
o.append('<text x="%d" y="%d" fill="#9aa0aa" font-size="18" text-anchor="middle">速度 km/h（トップギア巡航・概算）</text>'%((PX0+PX1)//2,PY1+42))
o.append('<text x="30" y="%d" fill="#cdd2dd" font-size="19.5" font-weight="600" text-anchor="middle" transform="rotate(-90 30 %d)">押し出す力 ＝ トルク/(車重+60kg)</text>'%((PY0+PY1)//2,(PY0+PY1)//2))
# curves
for n,pts,r60,w,col,wd,dash,lm in B:
    p=" ".join("%.1f,%.1f"%(X(v),Y(interp(pts,r60*v/60)/(w+R))) for v in SP)
    da=' stroke-dasharray="6 4"' if dash else ''
    o.append('<polyline fill="none" stroke="%s" stroke-width="%s"%s points="%s"/>'%(col,wd,da,p))
# labels
for n,pts,r60,w,col,wd,dash,lm in B:
    if lm=="mid":
        v=45; o.append('<text x="%.1f" y="%.1f" fill="%s" font-size="18" font-weight="700">%s</text>'%(X(v),Y(interp(pts,r60*v/60)/(w+R))-10,col,n))
    else:
        v=80; o.append('<text x="%.1f" y="%.1f" fill="%s" font-size="18" font-weight="%s">%s</text>'%(X(v)+6,Y(interp(pts,r60*v/60)/(w+R))+4,col,'700' if '！' in n else '400',n))
# annotation
by=560
o.append('<rect x="40" y="%d" width="930" height="64" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%by)
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="12.5">ピークは <tspan fill="#ff8a8a" font-weight="700">ZX-25R 45PS / ZX-4R 77PS</tspan>。だが≤80km/hの押し出す力は <tspan fill="#7fe39a" font-weight="700">エリミネーター(48PS)が全域で最強・ZX-25Rが最弱</tspan>。</text>'%(by+22))
o.append('<text x="54" y="%d" fill="#9aa0aa" font-size="11.5">回さない一般道では“回してナンボ”の高回転4気筒がいちばん遅い＝スペックの順位が逆転する。※トップギア巡航の概算・減速比未反映。</text>'%(by+44))
o.append('</svg>')
open(os.path.join(OUT,"lowspeed-pull.svg"),"w").write("\n".join(o))
for n,pts,r60,w,c,wd,d,lm in B:
    print(n.split("（")[0], [round(interp(pts,r60*v/60)/(w+R),3) for v in SP])
