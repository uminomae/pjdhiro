# -*- coding: utf-8 -*-
# 図B「60km/hから加速するときの本当の力（3速・4速）」
# 駆動力 F = エンジントルク × 総減速比(一次×二次×ギア) ÷ タイヤ半径。体感 = F ÷ (車重+60kg)。
# トルクは Ninja400 / YZF-R3 は実測（Motorcycle.com・Dynojet・後輪）。
# 他車は「実測2台の正規化形状 × 公式最大トルク × 0.92（駆動損失）」による推定。
# 正本: garage/data-drivetrain.md
import os, math
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))
LBFT=1.3558

N400={3400:17.6,3900:18.6,4400:20.5,4900:22.4,5400:21.6,5900:22.2,6400:22.8,6900:21.9,
      7400:23.5,7900:24.2,8400:24.9,8900:24.6,9400:24.3,9900:23.9,10400:23.3}
R3  ={3400:13.3,3900:14.2,4400:14.8,4900:15.0,5400:15.2,5900:15.5,6400:15.9,6900:16.5,
      7400:17.0,7900:17.5,8400:18.0,8900:18.6,9400:18.9,9900:18.6,10400:18.3}
def interp(d,r):
    ks=sorted(d)
    if r<=ks[0]: return d[ks[0]]
    if r>=ks[-1]: return d[ks[-1]]
    for a,b in zip(ks,ks[1:]):
        if a<=r<=b: return d[a]+(d[b]-d[a])*(r-a)/(b-a)
def norm(d,npk,tpk): return [(r/npk,d[r]/tpk) for r in sorted(d)]
A=norm(N400,8200,25.0); Bn=norm(R3,9200,18.9)
def val(pts,x):
    if x<=pts[0][0]: return pts[0][1]
    if x>=pts[-1][0]: return pts[-1][1]
    for (a,b),(c,d) in zip(pts,pts[1:]):
        if a<=x<=c: return b+(d-b)*(x-a)/(c-a)
def shape_at(x): return (val(A,x)+val(Bn,x))/2

G={"KAW":[2.928,2.055,1.619,1.333,1.153,1.037],"CBR":[3.285,2.105,1.600,1.300,1.150,1.043],
   "SF":[3.307,2.294,1.750,1.421,1.240,1.130],"R3":[2.500,1.823,1.347,1.086,0.920,0.800],
   "GSX":[2.416,1.529,1.181,1.043,0.909,0.807]}
KAW="#5fcf5f"; HON="#5a90e8"; YAM="#b98ae0"; SUZ="#e0a83a"; RED="#e8685f"; GREY="#aeb4c0"
# name, primary, final, gearset, tire, Tmax, n_T, weight, measured, color
B=[
 ("Ninja 400",       2.218,2.928,"KAW",(150,60,17),37, 8000,167,N400,KAW),
 ("エリミネーター400",  2.218,3.071,"KAW",(150,80,16),37, 8000,176,None,KAW),
 ("CB400SF（教習車）",  2.171,2.933,"SF", (160,60,17),38, 9500,194,None,GREY),
 ("ZX-4R",           2.029,3.428,"KAW",(160,60,17),39,13000,190,None,RED),
 ("YZF-R3",          3.043,3.071,"R3", (140,70,17),30, 9000,169,R3,YAM),
 ("ZX-25R",          2.900,3.571,"KAW",(150,60,17),21,13000,183,None,KAW),
 ("CBR400R",         2.029,3.000,"CBR",(160,60,17),38, 7500,192,None,HON),
 ("GSX250R",         3.238,3.285,"GSX",(140,70,17),22, 6500,181,None,SUZ),
]
rows=[]
for nm,p,f,gk,(w,a,rim),Tm,nT,wt,meas,col in B:
    D=(rim*25.4+2*w*a/100)/1000.0; r=D/2; circ=math.pi*D; g=G[gk]
    res=[]
    for gi in (2,3):
        tot=p*f*g[gi]; rpm=1000/circ*tot
        T=interp(meas,rpm)*LBFT if meas else shape_at(rpm/nT)*(Tm*0.92)
        res.append((T*tot/r)/(wt+60))
    rows.append((nm,res[0],res[1],col,meas is not None))
rows.sort(key=lambda x:-x[1])

VBW=1000; PX=260; PW=560; TOP=140; STEP=58; VBH=TOP+len(rows)*STEP+120
VM=5.0
def X(v): return PX+v/VM*PW
o=[]
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(VBW,VBH))
o.append('<rect x="0" y="0" width="%d" height="%d" fill="#232733"/>'%(VBW,VBH))
o.append('<text x="40" y="42" fill="#e6e6e6" font-size="26" font-weight="800">60km/hから加速するときの、本当の力</text>')
o.append('<text x="40" y="70" fill="#9aa0aa" font-size="16">巡航の6速ではなく、実際に加速に使う<tspan fill="#e6e6e6" font-weight="700">3速</tspan>と<tspan fill="#9aa0aa">4速</tspan>で計算。駆動力＝トルク×総減速比÷タイヤ半径。</text>')
o.append('<text x="40" y="94" fill="#9aa0aa" font-size="16">それを（車重＋体重60kg）で割った値。<tspan fill="#7fe39a" font-weight="700">●＝実測トルク</tspan>／<tspan fill="#9aa0aa">無印＝推定トルク</tspan>。</text>')
o.append('<text x="40" y="118" fill="#e0a83a" font-size="15">差は小さい。上位4台は4.4〜3.8の範囲に収まる。</text>')
ay=TOP+len(rows)*STEP+6
for v in [0,1,2,3,4,5]:
    o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(X(v),TOP-10,X(v),ay))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="15" text-anchor="middle">%d</text>'%(X(v),ay+24,v))
o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#5a6070" stroke-width="1.4"/>'%(X(0),ay,X(VM),ay))
o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="16" text-anchor="middle">加速の力（駆動力 ÷ 総重量）N/kg</text>'%(PX+PW/2,ay+50))
for i,(nm,v3,v4,col,meas) in enumerate(rows):
    y=TOP+i*STEP
    o.append('<text x="%d" y="%d" fill="%s" font-size="18" font-weight="700" text-anchor="end">%s</text>'%(PX-16,y+24,col,nm))
    o.append('<rect x="%.1f" y="%d" width="%.1f" height="18" rx="3" fill="%s" opacity="0.9"/>'%(X(0),y+4,X(v3)-X(0),col))
    o.append('<rect x="%.1f" y="%d" width="%.1f" height="12" rx="3" fill="%s" opacity="0.35"/>'%(X(0),y+25,X(v4)-X(0),col))
    o.append('<text x="%.1f" y="%d" fill="%s" font-size="18" font-weight="800">%.2f</text>'%(X(v3)+10,y+19,col,v3))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="14">%.2f（4速）</text>'%(X(v4)+10,y+36,v4))
    if meas: o.append('<circle cx="%d" cy="%d" r="6" fill="#7fe39a"/>'%(PX-6,y+18))
by=ay+66
o.append('<rect x="40" y="%d" width="%d" height="52" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%(by,VBW-80))
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="15">実測トルクがあるのはNinja400とYZF-R3のみ。他はこの2台の曲線の形を、各車の公式最大トルクに合わせて当てはめた推定。</text>'%(by+21))
o.append('<text x="54" y="%d" fill="#ff9a6a" font-size="14">※直4（CB400SF・ZX-4R）は並列2気筒の形を当てているため甘めに出る。細かい順位の差は断定できない。</text>'%(by+42))
o.append('</svg>')
open(os.path.join(OUT,"thrust-3rd-gear.svg"),"w").write("\n".join(o))
for nm,v3,v4,c,m in rows: print("%-18s 3速 %.2f  4速 %.2f  %s"%(nm,v3,v4,"実測" if m else "推定"))
