# -*- coding: utf-8 -*-
# 50m×25m 低速練習パッドのドリル配置図（ペットボトル＝目印）
S=7.6  # px/m
PADW,PADH=int(50*S),int(25*S)  # 380x190
o=[]
W,H=1000,860
o.append('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">'%(W,H))
o.append('<rect width="%d" height="%d" fill="#232733"/>'%(W,H))
o.append('<text x="24" y="34" fill="#e6e6e6" font-size="19" font-weight="700">近場でできる低速練習プラン ── 50m×25m の舗装パッド</text>')
o.append('<text x="24" y="56" fill="#9aa0aa" font-size="12.5"><tspan fill="#ffb27a" font-weight="700">●</tspan> ペットボトル（水を少量＝重り・柔らかい目印）／外周 <tspan fill="#8ab4e6" font-weight="700">5m</tspan> は転倒時の緩衝帯として空ける／<tspan fill="#7fe39a">破線＝走行ライン</tspan>／速度は低速限定・明るく乾いた路面で</text>')

panels=[(24,86),(514,86),(24,470),(514,470)]
titles=["① 8の字（リーンアウト）＋定常円（リーンイン）","② スラローム（左右の体重移動を刷り込む）",
        "③ フルロックUターン（リーンアウト・左右）","④ 発進→フルブレーキ（丁寧さ）"]
notes=["まず上体を起こし正確に→1本だけ一定速度で回れば定常円＝ハングオフ練習",
       "コーンの左右を交互に。左右同数・体を振るリズムを体に入れる",
       "切れ角一杯・首を出口へ・リアブレーキ引きずり。左右とも",
       "じわっと開け→目印でフルブレーキ停止。開け戻しの丁寧さ"]

def X(px,xm): return px+xm*S
def Y(py,ym): return py+ym*S

def frame(px,py,ti,no):
    o.append('<text x="%d" y="%d" fill="#cdd2dd" font-size="14.5" font-weight="700">%s</text>'%(px,py-30,ti))
    o.append('<rect x="%d" y="%d" width="%d" height="%d" rx="4" fill="#1b1f27" stroke="#3a4050"/>'%(px,py,PADW,PADH))
    o.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#3a4050" stroke-dasharray="4 4"/>'%(X(px,5),Y(py,5),40*S,15*S))
    o.append('<text x="%.1f" y="%d" fill="#6f7686" font-size="10" text-anchor="middle">緩衝帯5m</text>'%(X(px,5)+18,py+13))
    o.append('<text x="%.1f" y="%d" fill="#9aa0aa" font-size="10.5" text-anchor="middle">← 50m →</text>'%(px+PADW/2,py+PADH+15))
    o.append('<text x="%d" y="%.1f" fill="#9aa0aa" font-size="10.5" text-anchor="middle" transform="rotate(-90 %d %.1f)">25m</text>'%(px-11,py+PADH/2,px-11,py+PADH/2))
    o.append('<text x="%d" y="%d" fill="#8ab4e6" font-size="11">%s</text>'%(px,py+PADH+34,no))

def bottle(px,py,xm,ym):
    x,y=X(px,xm),Y(py,ym)
    o.append('<rect x="%.1f" y="%.1f" width="2.6" height="4" fill="#ffb27a"/><circle cx="%.1f" cy="%.1f" r="4.6" fill="#ffb27a" stroke="#232733" stroke-width="0.8"/>'%(x-1.3,y-8,x,y))

# Panel 1: 8の字
px,py=panels[0]; frame(px,py,titles[0],notes[0])
for cx in (16,34):
    o.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#7fe39a" stroke-width="1.6" stroke-dasharray="6 4"/>'%(X(px,cx),Y(py,12.5),6.5*S))
for cx in (16,34): bottle(px,py,cx,12.5)
o.append('<text x="%.1f" y="%.1f" fill="#7fe39a" font-size="10.5" text-anchor="middle">定常円</text>'%(X(px,16),Y(py,12.5)+3))

# Panel 2: slalom
px,py=panels[1]; frame(px,py,titles[1],notes[1])
xs=[10,18,26,34,42]
for cx in xs: bottle(px,py,cx,12.5)
pts=[(6,12.5),(10,8.5),(14,12.5),(18,16.5),(22,12.5),(26,8.5),(30,12.5),(34,16.5),(38,12.5),(42,8.5),(46,12.5)]
o.append('<polyline fill="none" stroke="#7fe39a" stroke-width="1.8" stroke-dasharray="6 4" points="%s"/>'%(" ".join("%.1f,%.1f"%(X(px,a),Y(py,b)) for a,b in pts)))

# Panel 3: full-lock U-turn (stadium)
px,py=panels[2]; frame(px,py,titles[2],notes[2])
for cx in (15,35): bottle(px,py,cx,12.5)
rr=3.5*S
a1=(X(px,15),Y(py,9)); a2=(X(px,35),Y(py,9)); a3=(X(px,35),Y(py,16)); a4=(X(px,15),Y(py,16))
o.append('<path d="M %.1f %.1f L %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f L %.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f Z" fill="none" stroke="#7fe39a" stroke-width="1.8" stroke-dasharray="6 4"/>'%(a1[0],a1[1],a2[0],a2[1],rr,rr,a3[0],a3[1],a4[0],a4[1],rr,rr,a1[0],a1[1]))

# Panel 4: accel -> brake
px,py=panels[3]; frame(px,py,titles[3],notes[3])
o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#6f7686" stroke-width="2"/>'%(X(px,9),Y(py,8),X(px,9),Y(py,17)))
o.append('<text x="%.1f" y="%.1f" fill="#9aa0aa" font-size="10.5" text-anchor="middle">発進</text>'%(X(px,9),Y(py,7)))
o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#7fe39a" stroke-width="2.4" stroke-dasharray="7 4"/>'%(X(px,10),Y(py,12.5),X(px,38),Y(py,12.5)))
ax,ay=X(px,40),Y(py,12.5)
o.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#7fe39a"/>'%(ax-6,ay-5,ax,ay,ax-6,ay+5))
bottle(px,py,42,12.5)
o.append('<text x="%.1f" y="%.1f" fill="#9aa0aa" font-size="10.5" text-anchor="middle">停止</text>'%(X(px,42),Y(py,7)))

# footer: bottle count / gear
o.append('<rect x="24" y="812" width="952" height="34" rx="5" fill="#1b1f27" stroke="#3a4050"/>')
o.append('<text x="38" y="833" fill="#cfd3da" font-size="12">必要なペットボトル＝<tspan fill="#ffb27a" font-weight="700">5〜6本</tspan>（ドリルは一度に一つ・使い回す）。装備＝ヘルメット/グローブ/プロテクター/ブーツ。1本30〜45分×数本で休憩を挟む。膝の接地は狙わない。</text>')
o.append('</svg>')
open("/Users/uminomae/dev/pjdhiro/.claude/worktrees/develop/garage/assets/practice-pad.svg","w").write("\n".join(o))
print("OK")
