# -*- coding: utf-8 -*-
VMAX=0.28
def X(v): return 150+v/VMAX*760
# name, torque(Nm), weight(kg装備), color, is_car
raw=[
 ("JOG 50",4.2,85,"#9aa0aa",False),
 ("TZR50 2st",6,90,"#9aa0aa",False),
 ("125クラス",11.5,137,"#35c4c4",False),
 ("GSX250R",22,178,"#e0a83a",False),
 ("ZX-25R",23,183,"#e0a83a",False),
 ("Ninja250 / R25",23,167,"#e0a83a",False),
 ("アルファード2.5(2.1t)",235,2110,"#e6e6e6",True),
 ("CBR250RR",25,168,"#e0a83a",False),
 ("YZF-R3(320)",30,169,"#5a9be0",False),
 ("CB400SF 教習",39,201,"#5a9be0",False),
 ("エリミSE カウル",37,177,"#5a9be0",False),
 ("ZX-4R",39,189,"#5a9be0",False),
 ("Ninja400",38,167,"#5a9be0",False),
 ("ZX-6R 636",66,196,"#e0603a",False),
]
RIDER=60
rows=[(n,t/(w+RIDER),c,car) for (n,t,w,c,car) in raw]
rows.sort(key=lambda r:r[1])
alx=X([r[1] for r in rows if r[3]][0])
y0,step=100,31; H=y0+len(rows)*step+96
o=[]
o.append('<svg viewBox="0 0 1010 %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%H)
o.append('<rect x="0" y="0" width="1010" height="%d" fill="#232733"/>'%H)
o.append('<text x="40" y="30" fill="#e6e6e6" font-size="18" font-weight="700">≤60km/hの“低速の力” ── トルク ÷ (車重＋体重60kg) でアルファードと比べる</text>')
o.append('<text x="40" y="50" fill="#9aa0aa" font-size="12">≤60km/hは“<tspan fill="#e6e6e6">トルク(力)</tspan>”が効く。<tspan fill="#e6e6e6" font-weight="600">体重60kgの人が乗った総重量</tspan>で割る（軽い車ほど体重の影響大）。基準＝アルファード。色＝クラス。</text>')
o.append('<rect x="%.1f" y="80" width="%.1f" height="%d" fill="#47d16c" opacity="0.06"/>'%(alx,X(VMAX)-alx,len(rows)*step+12))
o.append('<line x1="%.1f" y1="80" x2="%.1f" y2="%d" stroke="#e6e6e6" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.85"/>'%(alx,alx,y0+len(rows)*step-8))
o.append('<text x="%.1f" y="76" fill="#e6e6e6" font-size="11.5" text-anchor="middle">アルファード基準　→これより右＝この指標で車超え</text>'%(alx+150))
ay=y0+len(rows)*step-2
o.append('<line x1="150" y1="%d" x2="920" y2="%d" stroke="#5a6070" stroke-width="1.2"/>'%(ay,ay))
for v in [0,0.05,0.1,0.15,0.2,0.25]:
    o.append('<line x1="%.1f" y1="80" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(X(v),X(v),ay))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="11" text-anchor="middle">%.2f</text>'%(X(v),ay+16,v))
o.append('<text x="530" y="%d" fill="#9aa0aa" font-size="12" text-anchor="middle">トルク ÷ (車重＋体重60kg)（Nm/kg・大きいほど低速で力強い）</text>'%(ay+34))
for i,(nm,v,col,car) in enumerate(rows):
    y=y0+i*step
    o.append('<text x="142" y="%d" fill="%s" font-size="12" text-anchor="end"%s>%s</text>'%(y+4,'#e6e6e6' if car else '#cfd3da',' font-weight="700"' if car else '',nm))
    if car:
        o.append('<rect x="150" y="%d" width="%.1f" height="19" rx="3" fill="none" stroke="#e6e6e6" stroke-width="2"/>'%(y-10,X(v)-150))
    else:
        o.append('<rect x="150" y="%d" width="%.1f" height="19" rx="3" fill="%s" opacity="0.9"/>'%(y-10,X(v)-150,col))
    o.append('<text x="%.1f" y="%d" fill="%s" font-size="11">%.3f</text>'%(X(v)+6,y+4,'#e6e6e6' if car else col,v))
by=ay+48
o.append('<rect x="40" y="%d" width="930" height="62" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%by)
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="12">60kgを乗せると<tspan fill="#e6e6e6" font-weight="700">軽いバイクほど不利</tspan>。この指標でアルファード超えは<tspan fill="#7fe39a" font-weight="700">CBR250RR(回る250)以上・400以上</tspan>。GSX250R/Ninja250は乗車後アルファード以下。</text>'%(by+20))
o.append('<text x="54" y="%d" fill="#ff9a6a" font-size="11.5">※これは素のエンジントルク/総重量。<tspan font-weight="700">バイクは減速比が車の2〜3倍大きい</tspan>ので、同じ数値でも実際の加速はバイクが遥かに上。“順位”より“桁感”で見る。</text>'%(by+42))
o.append('</svg>')
open("/Users/uminomae/dev/pjdhiro/.claude/worktrees/develop/garage/assets/torque-weight.svg","w").write("\n".join(o))
print("rows:", [(n,round(v,3)) for n,v,c,car in rows])
