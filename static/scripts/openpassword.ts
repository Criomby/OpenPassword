/*
openpassword.ts

OpenPassword (openpassword.app)

Copyright (C) Philippe Braum (@Criomby)

TS script to generate various types of passwords

Available under the Apache 2.0 license
*/

// password generator class
class PassGen {
    passType: number;  // one of [1, 2, 3] (type 1: alphanumeric password, type 2: mnemonic passphrase, type 3: hexadecimal string)

    // traditional password
    readonly asciiLower: string = "abcdefghijklmnopqrstuvwqyz";
    readonly asciiUpper: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    readonly asciiPunct: string = String.raw`!"#$%&'()*+,-./:;<=>?@[\]^_\`{}~`; // excluded '¦' to make the passwords manually writable with any standard keyboard
    readonly asciiDigits: string = "0123456789";

    lengthChars: number;
    lower: boolean;
    upper: boolean;
    digits: boolean;
    punct: boolean;
    _all: boolean;

    // mnemonic
    lengthWords: number;
    // BIP0039 wordlist for mnemonic passphrases
    readonly BIP39: Array<string> = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century', 'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please', 'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem', 'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely', 'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk', 'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'];
    whitespace: boolean;

    // hex
    readonly hexChars: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    hexLen: number; // length of hex string in ["chars", "bytes"]
    hexLenType: string; // one of ["chars", "bytes"], defaults to "chars"
    hexIdent: boolean; // false: no prefix, true: "0x" prefix, defaults to 1
    
	// TODO #12: Refactor class
	constructor() {
	}

	/*
	// getter
	get password() {
		return this.genPass();
	}
	*/

	// generate password
	genPass() {
		this.updateValues();

		let password: string;

		if (this.passType == 1) {
			password = this.genAlphanum();
		}
		else if (this.passType == 2) {
			password = this.genMnemonic();
		}
		else if (this.passType == 3) {
			password = this.genHex();
		}
		else {
			password = "ERROR! Please contact site admin.";
		}
		return password;
	}

	protected genAlphanum(): string {
		let sequence: string = ""; // string
		let seqArr: Array<string> = []; // sequence array
		let passArr: Array<string> = []; // password as array of chars
		let password: string = ""; // final string password

		// check options
		// error if all false == no options selected
		if (this._all == false && this.lower == false && this.upper == false && this.digits == false && this.punct == false) {
			// return and send error to output field
			return "";
		}

		if (this._all == true) {
			sequence = sequence.concat(this.asciiLower, this.asciiUpper, this.asciiDigits, this.asciiPunct);
		}
		else {
			if (this.lower == true) {
				sequence = sequence.concat(this.asciiLower);
			}
			if (this.upper == true) {
				sequence = sequence.concat(this.asciiUpper);
			}
			if (this.digits == true) {
				sequence = sequence.concat(this.asciiDigits);
			}
			if (this.punct == true) {
				sequence = sequence.concat(this.asciiPunct);
			}
		}

		// convert sequence string to array
		seqArr = sequence.split("");

		// shuffle sequence
		//this.sequence = this.sequence.shuffle();
		seqArr = _.shuffle(seqArr);

		// create password
		for (let i = 0; i < this.lengthChars; i++) {
			passArr[i] = _.sample(seqArr);
		}
		// shuffle password
		passArr = _.shuffle(passArr);
		// convert to string
		password = passArr.join("");

		return password;
	}

	protected genMnemonic(): string {
		// TODO refactor method #20

		//let sequence = _.shuffle(this.BIP39);
		//let passArr = []; // password as array of words

		let password: string; // final string password

		let words: Array<string> = [];

		for (let i = 0; i < this.lengthWords; i++) {
			words[i] = _.sample(this.BIP39);
		}

		words = _.shuffle(words);

		if (this.whitespace == true) {
			password = words.join(" ");
		}
		else {
			password = words.join("");
		}
		return password
	}

	protected genHex(): string {
		let hexstring: string = "";

		let stringSize = this.hexLen;
		if (this.hexLenType == "bytes") {
			// one hex symbol (0-9, a-f) is 4 bits so two chars are one byte (8 bits), has to be twice the amount of chars therfore if length is given in bytes
			stringSize *= 2;
		}

		for (let i = 0; i < stringSize; i++) {
			hexstring += _.sample(this.hexChars);
		}

		if (this.hexIdent == true) {
			hexstring = "0x" + hexstring;
		}

		return hexstring;
	}

	// get checkbox values
	protected updateValues(): void {
		// check which tab is active
		if (btnTraditional.classList.contains("active")) {
			this.passType = 1;
		}
		else if (btnMnemonic.classList.contains("active")) {
			this.passType = 2;
		}
		else if (btnHexadecimal.classList.contains("active")) {
			this.passType = 3;
		}
		else {
			this.passType = 0;
		}
		
		// get length input for alphanum passwords
		this.lengthChars = parseInt(sliderLength.value);
		// get options
		this.lower = chkLower.checked;
		this.upper = chkUpper.checked;
		this.digits = chkDigits.checked;
		this.punct = chkPunct.checked;
		this._all = chkAll.checked;

		// get length input for mnemonic
		this.lengthWords = parseInt(sliderWords.value);
		this.whitespace = chkWhite.checked;

		// get length and options for hex
		this.hexLen = parseInt(sliderLenHex.value);
		if (chkHexLenType.checked == true) {
			this.hexLenType = "bytes";
		}
		else if (chkHexLenType.checked == false) {
			this.hexLenType = "chars";
		}
		this.hexIdent = chkHexIdent.checked;
	}

}

// tabs element
const tabs = document.getElementsByClassName("tablinks");
const btnTraditional = tabs[0];
const btnMnemonic = tabs[1];
const btnHexadecimal = tabs[2];

// "traditional" HTML elements
const sliderLength = <HTMLInputElement>document.getElementById("sliderLength");
const sliderValueLength = <HTMLInputElement>document.getElementById("sliderValueLength");
// checkboxes traditional
const chkAll = <HTMLInputElement>document.getElementById("chkAll");
const chkLower = <HTMLInputElement>document.getElementById("chkLower");
const chkUpper = <HTMLInputElement>document.getElementById("chkUpper");
const chkDigits = <HTMLInputElement>document.getElementById("chkDigits");
const chkPunct = <HTMLInputElement>document.getElementById("chkPunct");

// "mnemonic" HTML elements
// words range slider 
const sliderWords = <HTMLInputElement>document.getElementById("sliderWords");
const sliderValueWords = <HTMLOutputElement>document.getElementById("sliderValueWords");
const chkWhite = <HTMLInputElement>document.getElementById("chkWhite");
// length range slider
const sliderLenHex = <HTMLInputElement>document.getElementById("sliderLenHex");
const sliderValueLenHex = <HTMLOutputElement>document.getElementById("sliderValueLenHex");

// "hexadecimal" HTML elements
const chkHexLenType = <HTMLInputElement>document.getElementById("chkLenType");
const chkHexIdent = <HTMLInputElement>document.getElementById("chkIdent");

/* -----------------
   traditional password
   ----------------- */

// length range slider
sliderValueLength.innerHTML = (<HTMLInputElement>sliderLength).value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
sliderLength.oninput = function() {
  sliderValueLength.innerHTML = (<HTMLInputElement>this).value;
}

// checkboxes disabled
chkAll.addEventListener("change", function() {
	if (this.checked) {
		disableCheckboxes();
	}
	else {
		enableCheckboxes();
	}
});
chkLower.addEventListener("change", function() {
	if (this.checked) {
		disableCheckboxes();
	}
	else {
		enableCheckboxes();
	}
});
chkUpper.addEventListener("change", function() {
	if (this.checked) {
		disableCheckboxes();
	}
	else {
		enableCheckboxes();
	}
});
chkDigits.addEventListener("change", function() {
	if (this.checked) {
		disableCheckboxes();
	}
	else {
		enableCheckboxes();
	}
});
chkPunct.addEventListener("change", function() {
	if (this.checked) {
		disableCheckboxes();
	}
	else {
		enableCheckboxes();
	}
});

// disable other checkboxes
function disableCheckboxes() {
	if (chkAll.checked == true) {
		chkLower.setAttribute("disabled", ""); // set attribute to "true"
		chkUpper.setAttribute("disabled", "");
		chkDigits.setAttribute("disabled", "");
		chkPunct.setAttribute("disabled", "");
	}
	else if (chkLower.checked == true || chkUpper.checked == true || chkDigits.checked == true || chkPunct.checked == true) {
		chkAll.setAttribute("disabled", "");
	}
} 

// enable checkboxes again
function enableCheckboxes() {
	if (chkAll.checked == false && chkAll.disabled == false) {
		chkLower.removeAttribute("disabled");
		chkUpper.removeAttribute("disabled");
		chkDigits.removeAttribute("disabled");
		chkPunct.removeAttribute("disabled");
	}
	else if (chkLower.checked == false && chkUpper.checked == false && chkDigits.checked == false && chkPunct.checked == false) {
		chkAll.removeAttribute("disabled");
	}
}

/* -----------------
   mnemonic password
   ----------------- */

sliderValueWords.innerHTML = sliderWords.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
sliderWords.oninput = function() {
  sliderValueWords.innerHTML = (<HTMLInputElement>this).value;
}

chkWhite.click(); // activated by default

/* -----------------
   hex password
   ----------------- */

sliderValueLenHex.innerHTML = sliderLenHex.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
sliderLenHex.oninput = function() {
  sliderValueLenHex.innerHTML = (<HTMLInputElement>this).value;
}

chkHexIdent.click(); // activated by default (0x...)

// ---------------
// general buttons
// ---------------

// button reset
const btnReset = <HTMLButtonElement>document.getElementById("btnReset");
btnReset.addEventListener("click", reset);

// button generate
const btnGen = <HTMLButtonElement>document.getElementById("btn-passgen");
btnGen.addEventListener("click", generatePassword);

// button copy
const btnCopy = <HTMLButtonElement>document.getElementById("btn-copy");
btnCopy.addEventListener("click", copyPwdToClipboard);

// output
const outField = <HTMLInputElement>document.getElementById("outField");

// create PassGen object on site load
const passGen = new PassGen();

// button "generate" (password) clicked
// get password and update output field
function generatePassword() {
	// get password
	let password = passGen.genPass();
	// update password (output) field
	if (password == "") {
		// error: no option selected
		//outField.style.backgroundColor("red");
		outField.value = "Please select at least one option.";
	}
	else {
		//outField.style.backgroundColor("#EFEFEF");
		outField.value = password;
	}
}

// button "randomize" (only for traditional passwords)
const btnRand = <HTMLButtonElement>document.getElementById('btn-rand');

// get a random number between min & max, both inclusive
function getRandInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

btnRand.addEventListener('click', function() {
	// first reset everything
	btnReset.click();

	// set random slider number between 4 and 32
	sliderLength.value = getRandInt(4, 32).toString();
	sliderValueLength.innerHTML = sliderLength.value;

  // select "ALL" with (almost) 25% prob
  if (Math.random() < 0.2 ? true : false) {
    chkAll.click();
  }
  else {
    // determine which other options to activate with (almost) 50% prob
    if (Math.random() < 0.5 ? true : false) {
    	chkLower.click();
    }
    if (Math.random() < 0.5 ? true : false) {
    	chkUpper.click();
    }
    if (Math.random() < 0.5 ? true : false) {
    	chkDigits.click();
    }
    if (Math.random() < 0.5 ? true : false) {
    	chkPunct.click();
    }
  }
});

// button "reset"
function reset() {
	// reset range length slider
	sliderLength.value = "12";
	// also update output value
	sliderValueLength.innerHTML = sliderLength.value;
	// uncheck checkbox if checked
	if (chkAll.checked == true) {
		chkAll.click();
	}
	if (chkLower.checked == true) {
		chkLower.click();
	}
	if (chkUpper.checked == true) {
		chkUpper.click();
	}
	if (chkDigits.checked == true) {
		chkDigits.click();
	}
	if (chkPunct.checked == true) {
		chkPunct.click();
	}

	// reset words slider
	sliderWords.value = "3";
	sliderValueWords.innerHTML = sliderWords.value;
	// check box if unchecked
	if (chkWhite.checked == false) {
		chkWhite.click();
	}

	// hex
	// default length of 16 chars
	sliderLenHex.value = "16";
	sliderValueLenHex.innerHTML = sliderLenHex.value;
	// defaults to length given in chars (unchecked)
	if (chkHexLenType.checked == true) {
		chkHexLenType.click();
	}
	// defaults to prefix (checked)
	if (chkHexIdent.checked == false) {
		chkHexIdent.click();
	}

	// reset output field
	outField.value = "";
}

// copy generated password to clipboard
// from https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript
const copyToClipboard = (str: string) => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};
function copyPwdToClipboard() {
	// get password from outField
	let password = outField.value;
	// if content is not a password
	if (password == "" || password == "Please select at least one option." || password == "Generate a password first!") {
		outField.value = "Generate a password first!";
	}
	else {
		copyToClipboard(password);
		// show popper notification
		showPopper();
	}
}

// site tabs js

function openTab(evt: any, name: any) {
  // Declare all variables
  let i: number;
  let tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(name).style.display = "block";
  evt.currentTarget.className += " active";
}

// popper js

// const button = document.getElementById("btn-passgen"); // gets button above
const tooltip = document.getElementById("tooltip");

const popperInstance = Popper.createPopper(btnCopy, tooltip, {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ],
});

function showPopper() {
  // Make the tooltip visible
  tooltip.setAttribute('data-show', '');

  // Enable the event listeners
  popperInstance.setOptions((options: any) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: true },
    ],
  }));

  // Update its position
  // We need to tell Popper to update the tooltip position
  // after we show the tooltip, otherwise it will be incorrect
  popperInstance.update();
}

function hidePopper() {
  // Hide the tooltip
  tooltip.removeAttribute('data-show');

  // Disable the event listeners
  popperInstance.setOptions((options: any) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: false },
    ],
  }));
}

// const showEvents = ['focus'];
const hideEvents = ['blur'];

/*
showEvents.forEach((event) => {
  btnCopy.addEventListener(event, showPopper);
});
*/

hideEvents.forEach((event) => {
  btnCopy.addEventListener(event, hidePopper);
});

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();