# -*- coding: utf-8 -*-
R=60
AT=235/(2110+R); AP=182/(2110+R)  # アルファード基準 トルク/重量, パワー/重量
# name, torqueNm, PS, weight, brandcolor
raw=[
 ("JOG 50",4.2,4.5,85,"#40b8d0"),
 ("125クラス",11.5,15,137,"#9aa0aa"),
 ("GSX250R",22,24,178,"#e85b82"),
 ("Ninja250",23,37,166,"#6cc04e"),
 ("CBR250RR",25,42,168,"#5a90e8"),
 ("ZX-25R",23,45,183,"#6cc04e"),
 ("エリミSE",37,48,177,"#6cc04e"),
 ("Ninja400",38,48,167,"#6cc04e"),
 ("CB400SF 教習",39,56,201,"#5a90e8"),
 ("ZX-4R",39,77,189,"#6cc04e"),
 ("ZX-6R 636",66,130,196,"#e0603a"),
]
rows=[]
for n,t,ps,w,c in raw:
    tr=(t/(w+R))/AT; pr=(ps/(w+R))/AP; rows.append((n,tr,pr,c))
rows.sort(key=lambda r:r[2])
VMAX=6.5
def X(v): return 200+v/VMAX*700
one=X(1.0)
y0,step=100,40; H=y0+len(rows)*step+96
o=[]
o.append('<svg viewBox="0 0 1000 %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%H)
o.append('<rect x="0" y="0" width="1000" height="%d" fill="#232733"/>'%H)
o.append('<text x="40" y="30" fill="#e6e6e6" font-size="18" font-weight="700">アルファード基準の倍率 ── 低速の力(トルク/重量) と 総合の伸び(パワー/重量)</text>')
o.append('<text x="40" y="50" fill="#9aa0aa" font-size="12">体重60kg乗車込み。アルファード＝1.0。<tspan fill="#f0883a" font-weight="700">■低速トルク比</tspan>＝≤60km/hの押し出す力／<tspan fill="#4a9be8" font-weight="700">■総合パワー比</tspan>＝伸び・速さ。</text>')
o.append('<line x1="%.1f" y1="80" x2="%.1f" y2="%d" stroke="#e6e6e6" stroke-width="1.5" stroke-dasharray="6 4"/>'%(one,one,y0+len(rows)*step-6))
o.append('<text x="%.1f" y="76" fill="#e6e6e6" font-size="11.5" text-anchor="middle">アルファード=1.0</text>'%one)
ay=y0+len(rows)*step-2
o.append('<line x1="200" y1="%d" x2="910" y2="%d" stroke="#5a6070" stroke-width="1.2"/>'%(ay,ay))
for v in [0,1,2,3,4,5,6]:
    o.append('<line x1="%.1f" y1="80" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(X(v),X(v),ay))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="11" text-anchor="middle">%d×</text>'%(X(v),ay+16,v))
o.append('<text x="555" y="%d" fill="#9aa0aa" font-size="12" text-anchor="middle">アルファードの何倍か（×）</text>'%(ay+34))
for i,(nm,tr,pr,col) in enumerate(rows):
    y=y0+i*step
    o.append('<text x="192" y="%d" fill="%s" font-size="12" text-anchor="end" font-weight="600">%s</text>'%(y+2,col,nm))
    o.append('<rect x="200" y="%d" width="%.1f" height="12" rx="2" fill="#f0883a"/>'%(y-13,X(tr)-200))
    o.append('<text x="%.1f" y="%d" fill="#f0883a" font-size="10">%.2f×</text>'%(X(tr)+5,y-4,tr))
    o.append('<rect x="200" y="%d" width="%.1f" height="12" rx="2" fill="#4a9be8"/>'%(y+2,X(pr)-200))
    o.append('<text x="%.1f" y="%d" fill="#4a9be8" font-size="10">%.2f×</text>'%(X(pr)+5,y+11,pr))
by=ay+48
o.append('<rect x="40" y="%d" width="920" height="62" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%by)
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="12"><tspan fill="#f0883a" font-weight="700">低速の力</tspan>では250はアルファードと互角〜やや下（ZX-25R/GSX250Rは車以下＝しょぼしょぼ）。だが<tspan fill="#4a9be8" font-weight="700">総合の伸び</tspan>は250でも車の約2倍。</text>'%(by+20))
o.append('<text x="54" y="%d" fill="#cfd3da" font-size="12"><tspan fill="#e6e6e6" font-weight="700">ZX-25Rは低速0.88×(車以下)なのに総合2.2×</tspan>＝「回せば速いが低速はしょぼしょぼ」が数字で出る。※減速比未反映でバイクは実際さらに上。</text>'%(by+42))
o.append('</svg>')
open("/Users/uminomae/dev/pjdhiro/.claude/worktrees/develop/garage/assets/weight-ratio.svg","w").write("\n".join(o))
print("AT=%.3f AP=%.3f"%(AT,AP))
for n,tr,pr,c in rows: print(n, round(tr,2), round(pr,2))
