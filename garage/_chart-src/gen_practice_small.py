# -*- coding: utf-8 -*-
# 30m×20m 最小練習パッド（民家が最も遠い区画）のドリル配置図
S=8.6  # px/m
PADW,PADH=int(30*S),int(20*S)  # ~258x172
o=[]
W,H=1000,470
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(W,H))
o.append('<rect width="%d" height="%d" fill="#232733"/>'%(W,H))
o.append('<text x="24" y="34" fill="#e6e6e6" font-size="19" font-weight="700">最小プラン ── 30m×20m（民家が最も遠い区画）</text>')
o.append('<text x="24" y="56" fill="#9aa0aa" font-size="12.5">狭いぶん<tspan fill="#ff9a6a" font-weight="700">低速厳守</tspan>。<tspan fill="#7fe39a" font-weight="700">小さい円ほど低速で深く倒せる</tspan>（バンク角＝速度²÷半径）＝リーンインを安全に刻める。スラローム・直線ブレーキ・高速は不可</text>')

panels=[(40,110),(390,110),(720,110)]
titles=["① 定常円でリーンイン（中核・必須）","② 8の字（リーンアウト土台）","③ フルロックUターン（左右）"]
notes=["直径8〜10mを一定速度で。尻をずらし内膝を開く","2本を小さく回る。上体を起こして正確に","切れ角一杯・首を出口へ・リアブレーキ"]

def X(px,xm): return px+xm*S
def Y(py,ym): return py+ym*S
def frame(px,py,ti,no):
    o.append('<text x="%d" y="%d" fill="#cdd2dd" font-size="13.5" font-weight="700">%s</text>'%(px,py-26,ti))
    o.append('<rect x="%d" y="%d" width="%d" height="%d" rx="4" fill="#1b1f27" stroke="#3a4050"/>'%(px,py,PADW,PADH))
    o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#3a4050" stroke-dasharray="4 4"/>'%(X(px,3),Y(py,3),24*S,14*S))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="10" text-anchor="middle">← 30m →</text>'%(px+PADW/2,py+PADH+15))
    o.append('<text x="%d" y="%.1f" fill="#9aa0aa" font-size="10" text-anchor="middle" transform="rotate(-90 %d %.1f)">20m</text>'%(px-10,py+PADH/2,px-10,py+PADH/2))
    o.append('<text x="%d" y="%d" fill="#8ab4e6" font-size="10.5">%s</text>'%(px,py+PADH+33,no))
def bottle(px,py,xm,ym):
    x,y=X(px,xm),Y(py,ym)
    o.append('<rect x="%.1f" y="%.1f" width="2.6" height="4" fill="#ffb27a"/><circle cx="%.1f" cy="%.1f" r="4.6" fill="#ffb27a" stroke="#232733" stroke-width="0.8"/>'%(x-1.3,y-8,x,y))

# 1: constant circle
px,py=panels[0]; frame(px,py,titles[0],notes[0])
o.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#7fe39a" stroke-width="1.8" stroke-dasharray="6 4"/>'%(X(px,15),Y(py,10),4.5*S))
bottle(px,py,15,10)
o.append('<text x="%.1f" y="%.1f" fill="#7fe39a" font-size="10" text-anchor="middle">定常円</text>'%(X(px,15),Y(py,10)+16))
# 2: figure-8
px,py=panels[1]; frame(px,py,titles[1],notes[1])
for cx in (10,20):
    o.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#7fe39a" stroke-width="1.6" stroke-dasharray="6 4"/>'%(X(px,cx),Y(py,10),4.3*S))
    bottle(px,py,cx,10)
# 3: U-turn stadium
px,py=panels[2]; frame(px,py,titles[2],notes[2])
for cx in (10,20): bottle(px,py,cx,10)
rr=3.0*S
a1=(X(px,10),Y(py,7)); a2=(X(px,20),Y(py,7)); a3=(X(px,20),Y(py,13)); a4=(X(px,10),Y(py,13))
o.append('<path d="M %.1f %.1f L %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f L %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f Z" fill="none" stroke="#7fe39a" stroke-width="1.8" stroke-dasharray="6 4"/>'%(a1[0],a1[1],a2[0],a2[1],rr,rr,a3[0],a3[1],a4[0],a4[1],rr,rr,a1[0],a1[1]))

o.append('<rect x="24" y="424" width="952" height="32" rx="5" fill="#1b1f27" stroke="#3a4050"/>')
o.append('<text x="38" y="444" fill="#cfd3da" font-size="12"><tspan fill="#ffb27a" font-weight="700">●</tspan> ペットボトル3〜4本。外周3mは緩衝帯（狭いぶん<tspan fill="#ff9a6a" font-weight="700">速度を落として</tspan>補う）。膝接地は狙わない。許可した私有/自治体区画・乾いた明るい路面で。</text>')
o.append('</svg>')
open("/Users/uminomae/dev/pjdhiro/.claude/worktrees/develop/garage/assets/practice-pad-30x20.svg","w").write("\n".join(o))
print("OK")
