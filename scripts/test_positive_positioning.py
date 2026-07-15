from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CANDIDATE_FILES = [
    ROOT / 'index.html',
    ROOT / 'resume.html',
    ROOT / 'cover-letter.html',
    ROOT / 'interview-brief.html',
    ROOT / '90-day-plan.html',
    ROOT / 'sources.html',
]

BANNED = [
    'the hard objection',
    'strongest hiring objection',
    'strongest concern',
    'do not blur the gap',
    'does not support claiming',
    'does not claim years',
    'no claim of prior production',
    'no power bi or microsoft fabric production ownership is claimed',
    'primary gap to test',
    'the credible case is adjacent',
    'test the adjacent evidence',
    'learning velocity rather than accept inflated wording',
    'platform overreach',
    'capability gaps',
]

combined = []
for path in CANDIDATE_FILES:
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    combined.append(f'[{path.name}] ' + ' '.join(soup.stripped_strings).lower())
text = '\n'.join(combined)

for phrase in BANNED:
    assert phrase not in text, f'self-disqualifying phrase remains: {phrase}'

required = [
    'microsoft analytics advantage',
    'platform fluency. product judgment. operating follow-through.',
    'microsoft analytics leadership',
    'accountable product leadership',
]
for phrase in required:
    assert phrase in text, f'positive positioning phrase missing: {phrase}'

print('Positive positioning tests passed')
