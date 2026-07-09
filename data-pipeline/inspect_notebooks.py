import json, re

def clean(txt):
    return txt.replace('\n', ' ').strip()[:150]

# Read Phase 1
with open('server/public/notebooks/Phase1_EDA_FakeNewsDetection.ipynb', encoding='utf-8') as f:
    nb1 = json.load(f)

cells1 = nb1['cells']
print(f'=== Phase 1: {len(cells1)} cells ===')
for i, c in enumerate(cells1):
    src = ''.join(c['source'])
    if src.strip():
        print(f'  Cell {i} [{c["cell_type"]}]: {clean(src)}')

# Read Phase 2
with open('server/public/notebooks/Phase2_FeatureEngineering_BaselineModel.ipynb', encoding='utf-8') as f:
    nb2 = json.load(f)

cells2 = nb2['cells']
print(f'\n=== Phase 2: {len(cells2)} cells ===')
for i, c in enumerate(cells2):
    src = ''.join(c['source'])
    if src.strip():
        print(f'  Cell {i} [{c["cell_type"]}]: {clean(src)}')

# Read Phase 3
with open('server/public/notebooks/Phase3_AdvancedModeling_Optimization.ipynb', encoding='utf-8') as f:
    nb3 = json.load(f)

cells3 = nb3['cells']
print(f'\n=== Phase 3: {len(cells3)} cells ===')
for i, c in enumerate(cells3):
    src = ''.join(c['source'])
    if src.strip():
        print(f'  Cell {i} [{c["cell_type"]}]: {clean(src)}')
