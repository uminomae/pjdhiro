# -*- coding: utf-8 -*-
def X(t): return 120+t*7.9
def Y(s): return 460-s*4
red=[(0,44),(9,78),(13,50),(18,42),(30,78),(34,50),(39,42),(51,78),(55,50),(60,42),(72,78),(76,50),(81,42),(93,78),(98,62)]
grn=[(0,54),(20,56),(40,55),(60,55),(80,56),(100,55)]
flow=[(0,55),(25,54),(50,56),(75,55),(100,55)]
o=[]
o.append('<svg viewBox="0 0 1010 560" xmlns="http://www.w3.org/2000/svg" font-family="\'Hiragino Sans\',\'Noto Sans JP\',sans-serif">')
o.append('<rect x="0" y="0" width="1010" height="560" fill="#232733"/>')
o.append('<text x="40" y="32" fill="#e6e6e6" font-size="18" font-weight="700">高回転型を“使う”と、暴走運転になる ── 一般道での速度の動き（概念図）</text>')
o.append('<text x="40" y="52" fill="#9aa0aa" font-size="12">高回転を維持して性能を使う＝加速と減速の繰り返し＝<tspan fill="#ff8a8a">前を煽り・後ろに嫌がらせブレーキ</tspan>。つまり<tspan fill="#ff8a8a" font-weight="700">その性能は“暴走族のような走り”でしか発揮できない</tspan>。</text>')
# axes
o.append('<line x1="120" y1="460" x2="920" y2="460" stroke="#5a6070" stroke-width="1.5"/>')
o.append('<line x1="120" y1="90" x2="120" y2="460" stroke="#5a6070" stroke-width="1.5"/>')
o.append('<text x="520" y="486" fill="#9aa0aa" font-size="12" text-anchor="middle">時間 →</text>')
o.append('<text x="34" y="275" fill="#cdd2dd" font-size="13" font-weight="600" text-anchor="middle" transform="rotate(-90 34 275)">速度 km/h</text>')
# 制限速度 line
o.append('<line x1="120" y1="%d" x2="920" y2="%d" stroke="#e0a83a" stroke-width="1.2" stroke-dasharray="6 4"/>'%(Y(60),Y(60)))
o.append('<text x="126" y="%d" fill="#e0a83a" font-size="11">制限速度 60</text>'%(Y(60)-5))
# flow band
o.append('<polyline fill="none" stroke="#8a90a0" stroke-width="10" opacity="0.25" points="%s"/>'%(" ".join("%.0f,%.0f"%(X(t),Y(s)) for t,s in flow)))
o.append('<text x="770" y="%d" fill="#c0c6d0" font-size="11">周りの車の流れ（一定）</text>'%(Y(55)+22))
# red (high-rev "using it")
o.append('<polyline fill="none" stroke="#ff5a5a" stroke-width="2.6" points="%s"/>'%(" ".join("%.0f,%.0f"%(X(t),Y(s)) for t,s in red)))
o.append('<text x="150" y="%d" fill="#ff5a5a" font-size="12" font-weight="700">高回転型を“使う”走り</text>'%(Y(78)-8))
# green (low-rev)
o.append('<polyline fill="none" stroke="#47d16c" stroke-width="3.2" points="%s"/>'%(" ".join("%.0f,%.0f"%(X(t),Y(s)) for t,s in grn)))
o.append('<text x="300" y="%d" fill="#47d16c" font-size="12" font-weight="700">低回転トルク型（流れに乗ったまま力あり）</text>'%(Y(55)+40))
# annotations 煽り / 嫌がらせブレーキ
o.append('<text x="%.0f" y="%d" fill="#ff8a8a" font-size="11.5" font-weight="700" text-anchor="middle">↑煽り（前車に迫る）</text>'%(X(30),Y(78)-10))
o.append('<text x="%.0f" y="%d" fill="#ff8a8a" font-size="11.5" font-weight="700" text-anchor="middle">↓嫌がらせブレーキ（後続がヒヤッ）</text>'%(X(60),Y(42)+22))
# box
o.append('<rect x="40" y="500" width="930" height="50" rx="6" fill="#1b1f27" stroke="#3a4050"/>')
o.append('<text x="54" y="520" fill="#cfd3da" font-size="12">高回転型で<tspan fill="#e6e6e6" font-weight="700">性能を使う＝〈煽り〉加速で前に迫る＋〈嫌がらせブレーキ〉制限で急に緩める＝実質“暴走運転”</tspan>。使わなければ一定速度でOKだが性能はゼロ。</text>')
o.append('<text x="54" y="540" fill="#7fe39a" font-size="12">法規を守る思いやりの人は、この性能を一生使えない。低回転トルク型だけが一定速度のまま力を出せる＝<tspan font-weight="700">“流れを乱さず高性能”</tspan>。スペック表には載らない差だ。</text>')
o.append('</svg>')
open("/Users/uminomae/dev/pjdhiro/.claude/worktrees/develop/garage/assets/road-menace.svg","w").write("\n".join(o))
print("OK")
