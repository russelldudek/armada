from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
js = (root / 'app.js').read_text(encoding='utf-8')

assert 'class="signal"' not in html, 'decorative floating signal must not exist'
assert '.signal{' not in css, 'floating signal CSS must not exist'
assert 'nth-child(n+4){display:none}' not in css, 'mobile must not hide Delivery or Adoption'
assert css.count('{') == css.count('}'), 'CSS braces must remain balanced'

stages = re.findall(r'data-stage="(outcome|evidence|delivery|adoption)"', html)
assert stages == ['outcome', 'evidence', 'delivery', 'adoption'], stages
assert html.count('class="stage-score"') == 4
assert 'function getGateCount' in js
assert 'updateHero(decision, values)' in js
assert 'data-stage' in js

print('Routing source tests passed')
