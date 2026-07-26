# -*- coding: utf-8 -*-
# 図A「トップギアでは、トルクの山に届かない」
# 捏造ゼロ。公式諸元（最大トルクの発生回転数）＋公式ギア比＋タイヤ表記のみから計算する。
#   速度[km/h] = 回転数 ÷ 総減速比 × 円周[m] × 60 / 1000
# データの正本は garage/data-drivetrain.md（出典URL付き）。
import os, math
OUT = os.environ.get("OUT_DIR") or os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "assets"))

# name, primary, final, top, (tire_w, aspect%, rim_inch), Tmax_rpm, weight, color, note
KAW="#5fcf5f"; HON="#5a90e8"; YAM="#b98ae0"; SUZ="#e0a83a"; RED="#e8685f"
B=[
 ("Ninja 400",       2.218,2.928,1.037,(150,60,17), 8000,167,KAW,""),
 ("エリミネーター400", 2.218,3.071,1.037,(150,80,16), 8000,176,KAW,""),
 ("CBR400R",         2.029,3.000,1.043,(160,60,17), 7500,192,HON,""),
 ("YZF-R3",          3.043,3.071,0.800,(140,70,17), 9000,169,YAM,""),
 ("Ninja ZX-25R",    2.900,3.571,1.037,(150,60,17),13000,183,KAW,""),
 ("CB400SF（教習車の世代）",2.171,2.933,1.130,(160,60,17),9500,194,"#aeb4c0",""),
 ("GSX250R",         3.238,3.285,0.807,(140,70,17), 6500,181,SUZ,"唯一、常用域に山がある"),
 ("Ninja ZX-4R",     2.029,3.428,1.037,(160,60,17),13000,190,RED,"公道では絶対に届かない"),
]
def speed_at(rpm, p,f,t, tire):
    w,a,rim = tire
    D = (rim*25.4 + 2*w*a/100)/1000.0
    return rpm/(p*f*t) * math.pi*D * 60/1000.0

rows=[]
for nm,p,f,t,tire,nT,wt,c,note in B:
    rows.append((nm, speed_at(nT,p,f,t,tire), c, note))
rows.sort(key=lambda r:r[1])

VBW=980; PX=250; PW=600; TOP=118; STEP=52; VBH=TOP+len(rows)*STEP+108
VMAXKMH=230
def X(v): return PX + v/VMAXKMH*PW

o=[]
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(VBW,VBH))
o.append('<rect x="0" y="0" width="%d" height="%d" fill="#232733"/>'%(VBW,VBH))
o.append('<text x="40" y="42" fill="#e6e6e6" font-size="26" font-weight="800">トップギアでは、トルクの山に届かない</text>')
o.append('<text x="40" y="70" fill="#9aa0aa" font-size="16">バーの右端＝<tspan fill="#e6e6e6" font-weight="700">最大トルクが出る速度</tspan>（6速）。公式諸元の発生回転数と公式ギア比から計算した実数値。</text>')
o.append('<text x="40" y="92" fill="#9aa0aa" font-size="16">オレンジの帯＝一般道で実際に使う速度。<tspan fill="#f0883a" font-weight="700">どの車も、山は帯のはるか右にある。</tspan></text>')

# 一般道帯（〜60km/h）
o.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#f0883a" opacity="0.13"/>'%(X(0),TOP-8,X(60)-X(0),len(rows)*STEP+6))
o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#f0883a" stroke-width="2" stroke-dasharray="6 4"/>'%(X(60),TOP-8,X(60),TOP+len(rows)*STEP-2))
o.append('<text x="%.1f" y="%d" fill="#f0883a" font-size="15" font-weight="700" text-anchor="middle">60km/h</text>'%(X(60),TOP-16))

# 目盛
ay=TOP+len(rows)*STEP+4
for v in range(0,VMAXKMH+1,50):
    o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2c313d" stroke-width="1"/>'%(X(v),TOP-8,X(v),ay))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="15" text-anchor="middle">%d</text>'%(X(v),ay+24,v))
o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#5a6070" stroke-width="1.4"/>'%(X(0),ay,X(VMAXKMH),ay))
o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="16" text-anchor="middle">最大トルクが出る速度（トップギア・km/h）</text>'%(PX+PW/2,ay+50))

for i,(nm,v,c,note) in enumerate(rows):
    y=TOP+i*STEP
    o.append('<text x="%d" y="%d" fill="%s" font-size="18" font-weight="700" text-anchor="end">%s</text>'%(PX-16,y+22,c,nm))
    o.append('<rect x="%.1f" y="%d" width="%.1f" height="22" rx="4" fill="%s" opacity="0.85"/>'%(X(0),y+4,X(v)-X(0),c))
    o.append('<text x="%.1f" y="%d" fill="%s" font-size="18" font-weight="800">%d km/h</text>'%(X(v)+10,y+22,c,round(v)))
    if note:
        o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="14">%s</text>'%(X(v)+120,y+22,note))

by=ay+66
o.append('<rect x="40" y="%d" width="%d" height="30" rx="6" fill="#1b1f27" stroke="#3a4050"/>'%(by,VBW-80))
o.append('<text x="54" y="%d" fill="#9aa0aa" font-size="14">計算＝公式の一次×二次×6速減速比とタイヤ表記の外径から算出。推定値は含まない。出典は data-drivetrain.md。</text>'%(by+20))
o.append('</svg>')
open(os.path.join(OUT,"torque-peak-speed.svg"),"w").write("\n".join(o))
for nm,v,c,note in rows: print("%-24s %5.0f km/h"%(nm,v))
