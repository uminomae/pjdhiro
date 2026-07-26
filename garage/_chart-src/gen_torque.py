# -*- coding: utf-8 -*-
import os
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))
X0,RPMMAX,XW=90,14000,790
TOP,PLOTH,VMAX=90,900,0.30
def X(r): return X0+r/RPMMAX*XW
def Y(v): return TOP+(1-v/VMAX)*PLOTH
def rpm_at(px): return (px-X0)/XW*RPMMAX
def interp(pts,r):
    for i in range(len(pts)-1):
        if pts[i][0]<=r<=pts[i+1][0]:
            (a,b),(c,d)=pts[i],pts[i+1]; return b+(d-b)*(r-a)/(c-a)
    return pts[-1][1] if r>pts[-1][0] else pts[0][1]
HS={"KAW":(100,60),"HON":(2,80),"YAM":(215,72),"SUZ":(48,90)}
def col(br,t):
    if br=="MIX": return "hsl(0,0%,58%)"
    L=80 if t<13 else 58 if t<28 else 40 if t<45 else 30; h,s=HS[br]; return "hsl(%d,%d%%,%d%%)"%(h,s,L)
# name,pts,weight,brand,width,dash,k60,(lx,yoff,anchor,text,bold)
B=[
 ("125",[(2000,7),(3000,9),(4000,10.5),(5000,11),(6000,11.3),(8000,11.5),(10000,10.5),(11000,9.5)],137,"MIX",1.4,False,7500,(716,-9,"start","125（各社）",False)),
 ("ZX-25R",[(2000,4),(4000,7),(6000,10),(8000,14),(10000,18),(11500,23),(13000,22.5),(14000,22)],183,"KAW",2.3,False,6800,(884,4,"start","ZX-25R",False)),
 ("CBR250RR",[(2000,8),(3000,11),(4000,14),(6000,17.5),(8000,21),(10000,24),(11000,25),(12500,23),(13500,21)],168,"HON",2.3,False,5600,(858,-5,"start","CBR250RR",False)),
 ("Ninja250",[(2000,9),(3000,12),(4000,15),(6000,18),(8000,21),(10000,23),(11500,22),(12500,20)],166,"KAW",2.3,False,5200,(800,11,"start","Ninja250",False)),
 ("YZF-R25",[(2000,9),(3000,12.2),(4000,15.2),(6000,18.2),(8000,21),(10000,22.8),(11500,21.8),(12500,20)],170,"YAM",2.3,False,5300,(670,-10,"start","YZF-R25",False)),
 ("CBR250R",[(2000,15),(3000,19),(4000,21),(5000,22.5),(6000,23),(7000,23),(8000,22),(9000,20),(9500,18)],161,"HON",2.3,False,4500,(430,-9,"start","CBR250R単",False)),
 ("GSX250R",[(2000,16),(3000,20),(4000,21.5),(5000,22),(6000,22),(6500,22),(7500,21),(8500,19),(10000,17)],178,"SUZ",2.9,False,4300,(662,12,"start","GSX250R★",True)),
 ("YZF-R3",[(2000,14),(3000,19),(4000,23),(5000,26),(6000,28),(8000,30),(9000,30),(10000,29),(11000,27)],169,"YAM",4.2,False,4700,(716,10,"start","YZF-R3",False)),
 ("FOUR",[(2000,18),(3000,23),(4000,28),(6000,33),(8000,36),(9750,38),(11500,37),(13000,34)],200,"HON",4.2,False,4500,(836,2,"start","CBR400R FOUR",False)),
 ("Ninja400",[(2000,18),(3000,24),(4000,30),(5000,34),(6000,36),(8000,38),(10000,37),(11000,35)],167,"KAW",4.2,False,4000,(716,-11,"start","Ninja400",False)),
 ("CBR400R",[(2000,19),(3000,25),(4000,31),(5000,35),(6000,37),(7500,38),(9000,37),(10500,34)],192,"HON",4.2,False,4200,(690,4,"start","CBR400R",False)),
 ("ZX-4R",[(2000,20),(4000,28),(6000,32),(8000,35),(10000,37),(12000,38.5),(13000,39),(14000,38)],189,"KAW",4.2,False,6000,(884,2,"start","ZX-4R",True)),
 ("Elim",[(2000,26),(3000,32),(4000,35),(5000,36.5),(6000,37),(8000,35),(10000,32),(11000,29)],177,"KAW",4.2,False,3800,(250,-11,"start","エリミSE",False)),
 ("ZX-6R",[(2000,45),(3000,55),(4000,60),(6000,64),(8000,67),(11000,70.8),(13000,68),(14000,65)],196,"KAW",5,False,3500,(884,2,"start","ZX-6R(600)",True)),
 ("W650",[(2000,40),(3000,48),(4000,53),(5000,55.5),(5500,56),(6000,55),(7000,52),(7500,47)],199,"KAW",5,False,3200,(300,-9,"start","W650(大型)",False)),
 ("MT07",[(2000,52),(3000,60),(4000,64),(5000,66),(6000,66.5),(6500,67),(8000,64),(8750,61),(10000,54)],184,"YAM",5,False,3200,(372,-9,"start","MT-07(大型)",True)),
 ("CB400SF",[(2000,20),(3000,24),(4000,28),(6000,34),(8000,38),(9500,39),(11000,37)],201,"HON",2.2,True,4000,(556,-11,"start","CB400SF教習",False)),
 ("TZR50",[(3000,1.5),(5000,2.5),(6000,3.5),(7000,5),(8500,6),(9500,5.2),(10500,4)],90,"YAM",1.6,True,8500,(690,4,"start","TZR50",False)),
 ("JOG",[(2000,2.5),(4000,3.5),(6000,4),(7000,3.8),(8000,3)],85,"YAM",1.6,True,6500,(198,-8,"start","JOG",False)),
]
R=60; ALP=235/(2110+R)
from collections import defaultdict
def _cls(w): return "125" if w==1.4 else "50" if w==1.6 else "250" if w in (2.3,2.9) else "600" if w==5 else "400"
_bc=defaultdict(list)
for _b in B: _bc[_cls(_b[4])].append((max(v for r,v in _b[1]),_b[0]))
SHADE={}
for _cl,_l in _bc.items():
    _l.sort(); _m=len(_l)
    for _i,(_mt,_n) in enumerate(_l): SHADE[_n]=54 if _m==1 else int(86-_i/(_m-1)*58)
def col2(n,br):
    if br=="MIX": return "hsl(0,0%,60%)"
    h,s=HS[br]; return "hsl(%d,%d%%,%d%%)"%(h,s,SHADE.get(n,50))
VBH=TOP+PLOTH+95; o=[]
o.append('<svg viewBox="0 0 1140 %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%VBH)
o.append('<rect x="0" y="0" width="1140" height="%d" fill="#232733"/>'%VBH)
o.append('<text x="90" y="32" fill="#e6e6e6" font-size="18" font-weight="700">低速の“加速の力” ── トルク÷(車重+体重60kg) の立ち上がり（模式図）</text>')
o.append('<text x="90" y="52" fill="#9aa0aa" font-size="12"><tspan fill="#c7ccd6">色＝メーカー(濃いほどトルク大)・太さ＝クラス</tspan>。縦＝トルク/(車重+60kg)／横＝rpm。●＝60km/h点。白破線＝アルファード。概形</text>')
kx=90
for br,lb in [("KAW","Kawasaki"),("HON","Honda"),("YAM","Yamaha"),("SUZ","Suzuki"),("CAR","アルファード")]:
    c=col(br,40) if br in HS else "#e6e6e6"
    o.append('<line x1="%d" y1="66" x2="%d" y2="66" stroke="%s" stroke-width="3.5"/><text x="%d" y="70" fill="%s" font-size="15">%s</text>'%(kx,kx+26,c,kx+31,c,lb)); kx+=len(lb)*8+58
x4,x75=X(4000),X(7500)
o.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#4aa3ff" opacity="0.06"/>'%(x4,TOP,x75-x4,PLOTH))
for xx in (x4,x75): o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#4aa3ff" stroke-width="1" stroke-dasharray="5 4" opacity="0.4"/>'%(xx,TOP,xx,TOP+PLOTH))
o.append('<text x="%.1f" y="%d" fill="#8ab4e6" font-size="15" font-weight="600">60km/h(トップ)が来る回転域＝約4,000〜7,500rpm（●）</text>'%(x4+6,TOP+16))
gl=[0.05,0.10,0.15,0.20,0.25,0.30]
o.append('<g stroke="#2c313d" stroke-width="1">%s</g>'%"".join('<line x1="90" y1="%.1f" x2="880" y2="%.1f"/>'%(Y(v),Y(v)) for v in gl))
o.append('<line x1="90" y1="%d" x2="880" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(TOP+PLOTH,TOP+PLOTH))
o.append('<line x1="90" y1="%d" x2="90" y2="%d" stroke="#5a6070" stroke-width="1.5"/>'%(TOP,TOP+PLOTH))
o.append('<g fill="#9aa0aa" font-size="15.6" text-anchor="end"><text x="80" y="%d">0</text>%s</g>'%(TOP+PLOTH+4,"".join('<text x="80" y="%.1f">%.2f</text>'%(Y(v)+4,v) for v in gl)))
o.append('<text x="30" y="%d" fill="#cdd2dd" font-size="16.9" font-weight="600" text-anchor="middle" transform="rotate(-90 30 %d)">加速の力＝トルク/(車重+60kg) [Nm/kg]</text>'%(TOP+PLOTH//2,TOP+PLOTH//2))
o.append('<g fill="#cdd2dd" font-size="16.9" text-anchor="middle">%s</g>'%"".join('<text x="%.1f" y="%d">%dk</text>'%(X(k*1000),TOP+PLOTH+21,k) for k in [2,4,6,8,10,12,14]))
o.append('<text x="485" y="%d" fill="#9aa0aa" font-size="12" text-anchor="middle">エンジン回転数（rpm）　※60km/hに達する回転数は車種で違う（●）</text>'%(TOP+PLOTH+44))
o.append('<line x1="90" y1="%.1f" x2="880" y2="%.1f" stroke="#e6e6e6" stroke-width="2" stroke-dasharray="8 5" opacity="0.85"/>'%(Y(ALP),Y(ALP)))
o.append('<text x="884" y="%.1f" fill="#e6e6e6" font-size="15" font-weight="700">アルファード ≈%.2f</text>'%(Y(ALP)+4,ALP))
for n,pts,w,br,wd,dash,k60,lab in B:
    c=col2(n,br)
    p=" ".join("%.1f,%.1f"%(X(r),Y(v/(w+R))) for r,v in pts)
    da=' stroke-dasharray="6 4"' if dash else ''
    o.append('<polyline fill="none" stroke="%s" stroke-width="%s"%s points="%s"/>'%(c,wd,da,p))
o.append('<g stroke="#232733" stroke-width="1.2">%s</g>'%"".join('<circle cx="%.1f" cy="%.1f" r="4.5" fill="%s"/>'%(X(k60),Y(interp(pts,k60)/(w+R)),col2(n,br)) for n,pts,w,br,wd,dash,k60,lab in B))
ls=""
for n,pts,w,br,wd,dash,k60,lab in B:
    lx,yoff,anc,txt,bold=lab; c=col2(n,br)
    base=Y(interp(pts,rpm_at(lx))/(w+R))+yoff
    ls+='<text x="%d" y="%.1f" fill="%s" text-anchor="%s"%s>%s</text>'%(lx,base,c,anc,' font-weight="700"' if bold else '',txt)
o.append('<g font-size="14.3">%s</g>'%ls)
by=TOP+PLOTH+58
o.append('<rect x="90" y="%d" width="1044" height="30" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%by)
o.append('<text x="104" y="%d" fill="#ff9a6a" font-size="11.5">※減速比未反映。バイクは減速比が車の2〜3倍大きく、実際の車輪トルク/重量はこの図よりさらに上。</text>'%(by+20))
o.append('</svg>')
open(os.path.join(OUT,"lowrev-torque.svg"),"w").write("\n".join(o))
print("OK")
