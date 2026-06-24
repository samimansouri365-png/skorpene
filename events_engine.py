#!/usr/bin/env python3
"""
Intelligent event-from-news engine.

Responsibilities:
  1. classify(text)         -> (event_type, score)    pattern-based multilingual
  2. extract_location(text) -> (lat, lng, label)      gazetteer-first, robust
  3. dedup helpers          -> near_duplicate / dedup_key / token sets
  4. EVENT_TYPES taxonomy   -> ~100 event types w/ emoji + category

No external APIs, no LLM. Deterministic, fast, multilingual (EN/RU/ES/AR/FR/TR).
"""

from __future__ import annotations

import re
import time
import unicodedata
from typing import Optional, Tuple, Dict, List


# ---------------------------------------------------------------------------
# 1.  EVENT TAXONOMY  (id -> {icon, label, cat})
# ---------------------------------------------------------------------------

EVENT_TYPES: Dict[str, Dict[str, str]] = {
    # ---- Transport ----
    'transport_land':     {'icon': '🚗', 'label': 'Land transport',    'cat': 'transport'},
    'transport_rail':     {'icon': '🚆', 'label': 'Rail',              'cat': 'transport'},
    'transport_metro':    {'icon': '🚇', 'label': 'Metro',             'cat': 'transport'},
    'transport_air':      {'icon': '✈️', 'label': 'Air traffic',       'cat': 'transport'},
    'transport_airport':  {'icon': '🛫', 'label': 'Airport',           'cat': 'transport'},
    'transport_helicopter':{'icon':'🚁', 'label': 'Helicopter',        'cat': 'transport'},
    'transport_ship':     {'icon': '🚢', 'label': 'Ship / maritime',   'cat': 'transport'},
    'transport_port':     {'icon': '⚓', 'label': 'Port',              'cat': 'transport'},
    'transport_accident': {'icon': '💥', 'label': 'Accident',          'cat': 'transport'},

    # ---- Military ----
    'mil_strike':         {'icon': '💣', 'label': 'Airstrike / bombing','cat': 'military'},
    'mil_missile':        {'icon': '🚀', 'label': 'Missile attack',    'cat': 'military'},
    'mil_drone':          {'icon': '🛩', 'label': 'Drone / UAV',       'cat': 'military'},
    'mil_artillery':      {'icon': '🎯', 'label': 'Artillery / shelling','cat':'military'},
    'mil_airdefense':     {'icon': '🛡️', 'label': 'Air defense',       'cat': 'military'},
    'mil_troops':         {'icon': '🪖', 'label': 'Troop movement',    'cat': 'military'},
    'mil_tank':           {'icon': '🛻', 'label': 'Armor / tank',      'cat': 'military'},
    'mil_naval':          {'icon': '⚓', 'label': 'Naval operation',   'cat': 'military'},
    'mil_base':           {'icon': '🏯', 'label': 'Military base',     'cat': 'military'},
    'mil_casualties':     {'icon': '☠️', 'label': 'Casualties',         'cat': 'military'},
    'mil_pow':            {'icon': '🔒', 'label': 'POW / capture',     'cat': 'military'},
    'mil_ceasefire':      {'icon': '🕊️', 'label': 'Ceasefire / truce', 'cat': 'military'},
    'mil_exercise':       {'icon': '🎖️', 'label': 'Military exercise', 'cat': 'military'},

    # ---- Security / unrest ----
    'sec_explosion':      {'icon': '💥', 'label': 'Explosion',         'cat': 'security'},
    'sec_shooting':       {'icon': '🔫', 'label': 'Shooting',          'cat': 'security'},
    'sec_terror':         {'icon': '☣️', 'label': 'Terror attack',     'cat': 'security'},
    'sec_arrest':         {'icon': '🚔', 'label': 'Arrest / raid',     'cat': 'security'},
    'sec_hostage':        {'icon': '🆘', 'label': 'Hostage situation', 'cat': 'security'},
    'sec_border':         {'icon': '🚧', 'label': 'Border incident',   'cat': 'security'},
    'sec_cyber':          {'icon': '💻', 'label': 'Cyberattack',       'cat': 'security'},
    'sec_sanction':       {'icon': '🚫', 'label': 'Sanctions',         'cat': 'security'},
    'sec_protest':        {'icon': '✊', 'label': 'Protest / rally',   'cat': 'security'},
    'sec_riot':           {'icon': '🔥', 'label': 'Riot / clashes',    'cat': 'security'},
    'sec_coup':           {'icon': '⚔️', 'label': 'Coup / uprising',   'cat': 'security'},
    'sec_assassination':  {'icon': '🎯', 'label': 'Assassination',     'cat': 'security'},
    'sec_espionage':      {'icon': '🕵️', 'label': 'Espionage',         'cat': 'security'},
    'sec_smuggling':      {'icon': '📦', 'label': 'Smuggling / contraband','cat':'security'},

    # ---- Damage / fire ----
    'dmg_fire':           {'icon': '🔥', 'label': 'Fire',              'cat': 'damage'},
    'dmg_collapse':       {'icon': '🏚️', 'label': 'Collapse',          'cat': 'damage'},
    'dmg_building':       {'icon': '🏢', 'label': 'Building damage',   'cat': 'damage'},
    'dmg_infrastructure': {'icon': '⚙️', 'label': 'Infrastructure damage','cat':'damage'},

    # ---- Health / emergency ----
    'hlt_outbreak':       {'icon': '🦠', 'label': 'Disease outbreak',  'cat': 'health'},
    'hlt_hospital':       {'icon': '🏥', 'label': 'Hospital / medical','cat': 'health'},
    'hlt_chemical':       {'icon': '☢️', 'label': 'Chemical / nuclear','cat': 'health'},
    'hlt_ambulance':      {'icon': '🚑', 'label': 'Emergency medical', 'cat': 'health'},

    # ---- Nature / disaster ----
    'nat_earthquake':     {'icon': '🌐', 'label': 'Earthquake',        'cat': 'nature'},
    'nat_flood':          {'icon': '🌊', 'label': 'Flood',             'cat': 'nature'},
    'nat_storm':          {'icon': '🌀', 'label': 'Storm / hurricane', 'cat': 'nature'},
    'nat_wildfire':       {'icon': '🔥', 'label': 'Wildfire',          'cat': 'nature'},
    'nat_volcano':        {'icon': '🌋', 'label': 'Volcano',           'cat': 'nature'},
    'nat_drought':        {'icon': '🏜️', 'label': 'Drought',           'cat': 'nature'},
    'nat_avalanche':      {'icon': '🏔️', 'label': 'Avalanche / landslide','cat':'nature'},
    'nat_tsunami':        {'icon': '🌊', 'label': 'Tsunami',           'cat': 'nature'},
    'nat_weather':        {'icon': '🌩️', 'label': 'Severe weather',    'cat': 'nature'},

    # ---- Civil / society ----
    'civ_election':       {'icon': '🗳️', 'label': 'Election',          'cat': 'civil'},
    'civ_diplomacy':      {'icon': '🤝', 'label': 'Diplomacy',         'cat': 'civil'},
    'civ_summit':         {'icon': '🏛️', 'label': 'Summit / meeting',  'cat': 'civil'},
    'civ_treaty':         {'icon': '📜', 'label': 'Treaty / agreement','cat': 'civil'},
    'civ_refugees':       {'icon': '👥', 'label': 'Refugees / displacement','cat':'civil'},
    'civ_humanitarian':   {'icon': '🎗️', 'label': 'Humanitarian aid',  'cat': 'civil'},
    'civ_law':            {'icon': '⚖️', 'label': 'Law / court',       'cat': 'civil'},
    'civ_strike':         {'icon': '📢', 'label': 'Labor strike',      'cat': 'civil'},

    # ---- Infrastructure ----
    'inf_power':          {'icon': '⚡', 'label': 'Power / grid',      'cat': 'infrastructure'},
    'inf_water':          {'icon': '💧', 'label': 'Water supply',      'cat': 'infrastructure'},
    'inf_internet':       {'icon': '📡', 'label': 'Internet / comms',  'cat': 'infrastructure'},
    'inf_pipeline':       {'icon': '🛢️', 'label': 'Pipeline',          'cat': 'infrastructure'},
    'inf_bridge':         {'icon': '🌉', 'label': 'Bridge',            'cat': 'infrastructure'},
    'inf_road':           {'icon': '🛣️', 'label': 'Road / highway',    'cat': 'infrastructure'},
    'inf_dam':            {'icon': '💦', 'label': 'Dam / reservoir',   'cat': 'infrastructure'},

    # ---- Media ----
    'med_propaganda':     {'icon': '📣', 'label': 'Propaganda / info', 'cat': 'media'},
    'med_press':          {'icon': '📰', 'label': 'Press / media',     'cat': 'media'},
    'med_censorship':     {'icon': '🔇', 'label': 'Censorship',        'cat': 'media'},
    'med_social':         {'icon': '📱', 'label': 'Social media',      'cat': 'media'},

    # ---- Resources / economy ----
    'res_oil':            {'icon': '🛢️', 'label': 'Oil',               'cat': 'resources'},
    'res_gas':            {'icon': '🔥', 'label': 'Gas',               'cat': 'resources'},
    'res_food':           {'icon': '🌾', 'label': 'Food / grain',      'cat': 'resources'},
    'res_finance':        {'icon': '💰', 'label': 'Finance / markets', 'cat': 'resources'},
    'res_currency':       {'icon': '💱', 'label': 'Currency',          'cat': 'resources'},
    'res_mining':         {'icon': '⛏️', 'label': 'Mining',            'cat': 'resources'},
    'res_trade':          {'icon': '📦', 'label': 'Trade / shipping',  'cat': 'resources'},

    # ---- Tech ----
    'tec_ai':             {'icon': '🤖', 'label': 'AI / technology',   'cat': 'technology'},
    'tec_space':          {'icon': '🛰️', 'label': 'Space / satellite', 'cat': 'technology'},
    'tec_rocket':         {'icon': '🚀', 'label': 'Rocket launch',     'cat': 'technology'},
    'tec_science':        {'icon': '🔬', 'label': 'Science',           'cat': 'technology'},

    # ---- Animals / environment ----
    'ani_wildlife':       {'icon': '🐾', 'label': 'Wildlife',          'cat': 'animals'},
    'ani_agriculture':    {'icon': '🐄', 'label': 'Agriculture',       'cat': 'animals'},
    'ani_environmental':  {'icon': '🌿', 'label': 'Environmental',     'cat': 'animals'},

    # ---- Economic / market (more granular than res_finance) ----
    'eco_stockcrash':     {'icon': '📉', 'label': 'Stock market crash','cat': 'resources'},
    'eco_stocksurge':     {'icon': '📈', 'label': 'Stock market surge','cat': 'resources'},
    'eco_inflation':      {'icon': '🔺', 'label': 'Inflation spike',   'cat': 'resources'},
    'eco_rate':           {'icon': '🏦', 'label': 'Interest rate',     'cat': 'resources'},
    'eco_oil_spike':      {'icon': '⛽', 'label': 'Oil price spike',   'cat': 'resources'},
    'eco_default':        {'icon': '💸', 'label': 'Default / bankruptcy','cat': 'resources'},

    # ---- Additional crisis / civil ----
    'civ_famine':         {'icon': '🍚', 'label': 'Famine / food crisis','cat': 'civil'},
    'civ_migration':      {'icon': '🧳', 'label': 'Mass migration',    'cat': 'civil'},
    'civ_massacre':       {'icon': '⚠️', 'label': 'Massacre',          'cat': 'security'},

    # ---- Nuclear / WMD extras ----
    'mil_nuclear':        {'icon': '☢️', 'label': 'Nuclear incident',  'cat': 'military'},

    # ---- Fallback ----
    'generic_event':      {'icon': '📍', 'label': 'Event',             'cat': 'other'},
}


# ---------------------------------------------------------------------------
# 2.  KEYWORD PATTERNS (multilingual)
#     Each event_type maps to a list of lowercased keywords/phrases.
#     Priority: more specific events (missile, drone) before generic (explosion).
# ---------------------------------------------------------------------------

EVENT_KEYWORDS: Dict[str, List[str]] = {
    # Missile first (more specific than "strike")
    'mil_missile':        ['missile', 'ballistic', 'cruise missile', 'hypersonic', 'iskander',
                           'kinzhal', 'kalibr', 'tomahawk', 'icbm', 'ракет', 'баллистическ',
                           'misil', 'cohete', 'صاروخ', 'füze', 'كروز'],
    'mil_drone':          ['drone', 'uav', 'shahed', 'kamikaze drone', 'loitering munition',
                           'quadcopter', 'fpv', 'беспилотник', 'дрон', 'шахед',
                           'dron', 'طائرة مسيرة', 'مسيرة', 'iha', 'sİha'],
    'mil_airdefense':     ['air defense', 'air defence', 'anti-aircraft', 'patriot', 's-300',
                           's-400', 'iron dome', 'intercepted', 'shot down',
                           'пво', 'противовоздушн', 'сбит', 'defensa aérea', 'مضاد للطائرات'],
    'mil_artillery':      ['artillery', 'shelling', 'shelled', 'mortar', 'howitzer', 'grad',
                           'himars', 'multiple rocket', 'артиллер', 'обстрел', 'миномёт',
                           'artillería', 'مدفعية', 'قصف'],
    'mil_strike':         ['airstrike', 'air strike', 'bombing', 'bombed', 'strike on',
                           'struck', 'авиаудар', 'бомбард', 'удар по',
                           'ataque aéreo', 'bombardeo', 'غارة', 'قصف جوي'],
    'mil_tank':           ['tank ', 'armored column', 'armoured column', 'apc ', 'bmp',
                           'т-72', 'т-90', 'танк', 'tanque', 'دبابة'],
    'mil_naval':          ['warship', 'frigate', 'destroyer', 'submarine', 'aircraft carrier',
                           'naval', 'fleet', 'флот', 'эсминец', 'подводн', 'крейсер',
                           'buque de guerra', 'بحرية', 'أسطول'],
    'mil_troops':         ['troops', 'soldiers', 'infantry', 'brigade', 'battalion', 'offensive',
                           'солдат', 'войск', 'пехот', 'бригад', 'батальон',
                           'soldados', 'tropas', 'جنود', 'كتيبة'],
    'mil_base':           ['military base', 'army base', 'airbase', 'air base', 'barracks',
                           'военная база', 'база', 'base militar', 'قاعدة عسكرية'],
    'mil_casualties':     ['killed', 'dead', 'fatalities', 'casualties', 'wounded', 'injured',
                           'убит', 'погиб', 'ранен', 'жертв', 'muertos', 'heridos',
                           'قتل', 'جريح', 'ضحايا', 'شهيد'],
    'mil_pow':            ['prisoner of war', 'captured alive', 'surrendered', 'сдал', 'плен',
                           'prisionero de guerra', 'أسير حرب'],
    'mil_ceasefire':      ['ceasefire', 'truce', 'перемир', 'alto el fuego', 'هدنة', 'وقف إطلاق'],
    'mil_exercise':       ['military exercise', 'drills', 'wargame', 'manoeuvre', 'maneuver',
                           'учения', 'maniobras', 'مناورات'],
    'mil_helicopter':     [],  # handled by transport_helicopter

    # Transport
    'transport_helicopter':['helicopter', 'chopper', 'вертолёт', 'helicóptero', 'مروحية'],
    'transport_air':      ['flight diverted', 'flight cancelled', 'flight canceled', 'airspace closed',
                           'закрыт', 'vuelo cancelado', 'أجواء مغلقة'],
    'transport_airport':  ['airport', 'terminal', 'аэропорт', 'aeropuerto', 'مطار'],
    'transport_rail':     ['train', 'railway', 'railroad', 'locomotive', 'поезд', 'железн',
                           'tren', 'ferroviari', 'قطار'],
    'transport_metro':    ['metro', 'subway', 'метро', 'مترو'],
    'transport_ship':     ['cargo ship', 'tanker ', 'vessel', 'ship ', 'boat ', 'ferry',
                           'судно', 'танкер', 'buque', 'barco', 'سفينة', 'ناقلة'],
    'transport_port':     ['port ', 'seaport', 'harbour', 'harbor', 'порт', 'puerto', 'ميناء'],
    'transport_accident': ['crash', 'collision', 'car accident', 'road accident', 'derailment',
                           'авария', 'столкнов', 'accidente', 'حادث'],
    'transport_land':     ['bus ', 'truck ', 'convoy', 'traffic', 'автобус', 'грузовик',
                           'autobús', 'camión', 'شاحنة', 'حافلة'],

    # Security / unrest
    'sec_explosion':      ['explosion', 'blast', 'detonation', 'взрыв', 'explosión',
                           'انفجار'],
    'sec_shooting':       ['shooting', 'gunfire', 'shots fired', 'gunman', 'стрельб',
                           'tiroteo', 'disparos', 'إطلاق نار'],
    'sec_terror':         ['terror attack', 'terrorist attack', 'terrorism', 'suicide bomb',
                           'террорист', 'теракт', 'atentado', 'إرهاب', 'تفجير انتحاري'],
    'sec_arrest':         ['arrest', 'detained', 'raid', 'raids', 'police operation', 'арест',
                           'задержа', 'arresto', 'detenido', 'اعتقال', 'مداهمة'],
    'sec_hostage':        ['hostage', 'abducted', 'kidnapp', 'заложник', 'похищ',
                           'rehén', 'secuestr', 'رهينة', 'اختطاف'],
    'sec_border':         ['border crossing', 'border incident', 'border closed', 'border clash',
                           'границ', 'frontera', 'حدود'],
    'sec_cyber':          ['cyberattack', 'hack', 'hacked', 'ransomware', 'ddos', 'кибератак',
                           'взлом', 'ciberataque', 'هجوم إلكتروني'],
    'sec_sanction':       ['sanction', 'sanctioned', 'embargo', 'санкц', 'sanción',
                           'عقوبات'],
    'sec_protest':        ['protest', 'rally', 'demonstration', 'march', 'протест', 'митинг',
                           'protesta', 'manifestación', 'احتجاج', 'مظاهرة'],
    'sec_riot':           ['riot', 'clash', 'clashes', 'street battle', 'беспорядк', 'столкновен',
                           'disturbios', 'enfrentamientos', 'شغب', 'اشتباك'],
    'sec_coup':           ['coup', 'overthrow', 'uprising', 'переворот', 'golpe de estado',
                           'انقلاب'],
    'sec_assassination':  ['assassin', 'assassinated', 'targeted killing', 'убийство',
                           'asesinato', 'اغتيال'],
    'sec_espionage':      ['spy', 'espionage', 'шпион', 'espionaje', 'جاسوس'],
    'sec_smuggling':      ['smuggling', 'smuggled', 'contraband', 'контрабанд',
                           'contrabando', 'تهريب'],

    # Damage / fire
    'dmg_fire':           ['fire', 'blaze', 'ablaze', 'burned down', 'burn', 'burning', 'пожар', 'incendio', 'حريق'],
    'dmg_collapse':       ['collapse', 'collapsed', 'обруш', 'colapso', 'انهيار'],
    'dmg_building':       ['building damaged', 'destroyed building', 'здание разрушено',
                           'edificio destruido', 'مبنى مدمر'],
    'dmg_infrastructure': ['infrastructure damaged', 'critical infrastructure',
                           'инфраструктур', 'infraestructura', 'البنية التحتية'],

    # Health
    'hlt_outbreak':       ['outbreak', 'pandemic', 'epidemic', 'virus', 'вспышк', 'эпидеми',
                           'brote', 'epidemia', 'وباء', 'جائحة'],
    'hlt_hospital':       ['hospital', 'clinic', 'больниц', 'hospital', 'مستشفى'],
    'hlt_chemical':       ['chemical weapon', 'nuclear', 'radioactive', 'radiation', 'химическ',
                           'ядерн', 'arma química', 'nuclear', 'نووي', 'إشعاع'],
    'hlt_ambulance':      ['ambulance', 'paramedic', 'скорая', 'ambulancia', 'إسعاف'],

    # Nature
    'nat_earthquake':     ['earthquake', 'quake', 'tremor', 'seismic', 'землетрясен',
                           'terremoto', 'sismo', 'زلزال'],
    'nat_flood':          ['flood', 'flooding', 'наводнен', 'inundación', 'فيضان'],
    'nat_storm':          ['hurricane', 'typhoon', 'cyclone', 'tornado', 'ураган', 'шторм',
                           'huracán', 'tifón', 'إعصار'],
    'nat_wildfire':       ['wildfire', 'forest fire', 'bushfire', 'лесной пожар',
                           'incendio forestal', 'حريق غابات'],
    'nat_volcano':        ['volcano', 'eruption', 'вулкан', 'volcán', 'بركان'],
    'nat_drought':        ['drought', 'засух', 'sequía', 'جفاف'],
    'nat_avalanche':      ['avalanche', 'landslide', 'mudslide', 'лавина', 'оползень',
                           'avalancha', 'انهيار أرضي'],
    'nat_tsunami':        ['tsunami', 'цунами', 'تسونامي'],
    'nat_weather':        ['heatwave', 'cold snap', 'blizzard', 'snowstorm', 'жара', 'буран',
                           'ola de calor', 'موجة حر'],

    # Civil / society
    'civ_election':       ['election', 'vote', 'ballot', 'referendum', 'выборы',
                           'elección', 'elecciones', 'انتخابات', 'استفتاء'],
    'civ_diplomacy':      ['diplomatic', 'ambassador', 'embassy', 'посол', 'посольств',
                           'embajada', 'diplomát', 'سفارة', 'دبلوماسي'],
    'civ_summit':         ['summit', 'bilateral meeting', 'talks', 'саммит', 'переговор',
                           'cumbre', 'reunión', 'قمة'],
    'civ_treaty':         ['treaty', 'accord', 'agreement signed', 'pact', 'договор',
                           'tratado', 'acuerdo', 'اتفاقية'],
    'civ_refugees':       ['refugee', 'displaced', 'migrant', 'asylum', 'беженц',
                           'refugiado', 'desplazado', 'لاجئ', 'نازح'],
    'civ_humanitarian':   ['humanitarian', 'aid convoy', 'relief', 'гуманитарн',
                           'humanitario', 'إنساني'],
    'civ_law':            ['court ruling', 'trial', 'sentenced', 'indictment', 'суд ', 'приговор',
                           'tribunal', 'sentencia', 'محكمة'],
    'civ_strike':         ['labor strike', 'general strike', 'workers strike', 'забастовк',
                           'huelga', 'إضراب'],

    # Infrastructure
    'inf_power':          ['power outage', 'blackout', 'power plant', 'electricity grid',
                           'отключен', 'энергосистем', 'apagón', 'انقطاع الكهرباء'],
    'inf_water':          ['water supply', 'водоснабжен', 'suministro de agua', 'إمدادات المياه'],
    'inf_internet':       ['internet outage', 'telecom', 'cell service', 'связь отключ',
                           'conexión', 'اتصالات', 'إنترنت'],
    'inf_pipeline':       ['pipeline', 'nord stream', 'трубопровод', 'gasoducto', 'oleoducto',
                           'أنبوب'],
    'inf_bridge':         ['bridge', 'мост', 'puente', 'جسر'],
    'inf_road':           ['highway', 'motorway', 'шоссе', 'autopista', 'طريق سريع'],
    'inf_dam':            ['dam ', 'reservoir', 'плотин', 'presa', 'سد'],

    # Media
    'med_propaganda':     ['propaganda', 'disinformation', 'fake news', 'пропаганд',
                           'propaganda', 'دعاية'],
    'med_press':          ['journalist', 'reporter', 'press conference', 'журналист',
                           'periodista', 'صحفي'],
    'med_censorship':     ['censorship', 'banned', 'blocked', 'цензур',
                           'censura', 'رقابة'],
    'med_social':         ['twitter', 'telegram', 'tiktok', 'social media', 'соцсет',
                           'redes sociales', 'وسائل التواصل'],

    # Resources
    'res_oil':            ['crude oil', 'oil price', 'oil refin', 'нефть', 'petróleo',
                           'نفط'],
    'res_gas':            ['natural gas', 'lng', 'газ', 'gas natural', 'غاز طبيعي'],
    'res_food':           ['grain deal', 'wheat', 'famine', 'food shortage', 'зерн',
                           'trigo', 'hambruna', 'قمح', 'مجاعة'],
    'res_finance':        ['stock market', 'shares fell', 'wall street', 'биржа',
                           'bolsa', 'acciones', 'بورصة'],
    'res_currency':       ['ruble', 'dollar', 'euro', 'yuan', 'inflation', 'рубль',
                           'inflación', 'تضخم'],
    'res_mining':         ['mining', 'mine collapse', 'шахт', 'mina', 'منجم'],
    'res_trade':          ['trade deal', 'export', 'import tariff', 'торговля',
                           'comercio', 'تجارة'],

    # Tech
    'tec_ai':             ['artificial intelligence', 'chatgpt', 'ai model', 'искусственн интеллект',
                           'inteligencia artificial', 'ذكاء اصطناعي'],
    'tec_space':          ['satellite', 'space agency', 'спутник', 'satélite', 'قمر صناعي'],
    'tec_rocket':         ['spacex', 'launch pad', 'rocket launch', 'falcon 9', 'starship',
                           'запуск ракеты', 'lanzamiento', 'إطلاق صاروخ'],
    'tec_science':        ['scientists', 'research team', 'study finds', 'учёные',
                           'investigadores', 'علماء'],

    # Animals / environment
    'ani_wildlife':       ['wildlife', 'endangered species', 'животн', 'vida silvestre',
                           'حياة برية'],
    'ani_agriculture':    ['livestock', 'crops', 'harvest', 'урожай', 'ganado',
                           'حصاد', 'ماشية'],
    'ani_environmental':  ['pollution', 'climate change', 'oil spill', 'загрязнен',
                           'contaminación', 'تلوث'],

    # Economic extras
    'eco_stockcrash':     ['market crash', 'stocks plunge', 'stocks tumble', 'dow dropped',
                           'market rout', 'sell-off', 'bloodbath',
                           'обвал', 'crash bursátil', 'انهيار البورصة'],
    'eco_stocksurge':     ['stocks rally', 'stocks surge', 'record high', 'all-time high',
                           'рекорд биржи', 'récord bursátil', 'قفزة بورصة'],
    'eco_inflation':      ['inflation jumped', 'inflation spike', 'cpi rose', 'prices soar',
                           'инфляция выросла', 'inflación subió', 'ارتفاع التضخم'],
    'eco_rate':           ['rate hike', 'rate cut', 'interest rate', 'fed raised',
                           'повысил ставку', 'subió tasas', 'سعر الفائدة'],
    'eco_oil_spike':      ['oil spikes', 'brent surges', 'wti surges', 'oil price jump',
                           'нефть выросла', 'crudo sube', 'ارتفاع النفط'],
    'eco_default':        ['default on debt', 'bankruptcy filing', 'sovereign default',
                           'дефолт', 'quiebra', 'إفلاس'],

    # Civil extras
    'civ_famine':         ['famine', 'food crisis', 'mass starvation', 'голод',
                           'hambruna', 'مجاعة', 'أزمة غذاء'],
    'civ_migration':      ['migration wave', 'mass migration', 'caravan of',
                           'массовая миграция', 'migración masiva', 'هجرة جماعية'],
    'civ_massacre':       ['massacre', 'mass killing', 'genocide', 'резня',
                           'masacre', 'مجزرة', 'إبادة'],

    # Nuclear
    'mil_nuclear':        ['nuclear plant', 'reactor incident', 'radiation leak',
                           'zaporizhzhia npp', 'zaporizhzhya npp', 'chernobyl',
                           'ядерная станция', 'planta nuclear', 'محطة نووية'],
}

# Priority ranks resolve tie-breaks (higher beats lower).
EVENT_PRIORITY: Dict[str, int] = {
    # Military specifics dominate
    'mil_missile': 100, 'mil_drone': 98, 'mil_artillery': 96, 'mil_strike': 94,
    'mil_airdefense': 92, 'mil_tank': 88, 'mil_naval': 86, 'mil_troops': 84,
    'mil_base': 80, 'mil_casualties': 78, 'mil_pow': 76, 'mil_ceasefire': 90,
    'mil_exercise': 70,

    # Security specifics
    'sec_terror': 90, 'sec_assassination': 88, 'sec_hostage': 86, 'sec_coup': 85,
    'sec_shooting': 82, 'sec_explosion': 80, 'sec_riot': 74, 'sec_protest': 70,
    'sec_arrest': 68, 'sec_border': 66, 'sec_cyber': 72, 'sec_sanction': 64,
    'sec_espionage': 60, 'sec_smuggling': 58,

    # Nature strong signals
    'nat_earthquake': 92, 'nat_tsunami': 92, 'nat_volcano': 90, 'nat_wildfire': 82,
    'nat_flood': 80, 'nat_storm': 78, 'nat_avalanche': 74, 'nat_drought': 66,
    'nat_weather': 50,

    # Health
    'hlt_chemical': 88, 'hlt_outbreak': 78, 'hlt_ambulance': 56, 'hlt_hospital': 50,

    # Damage
    'dmg_fire': 70, 'dmg_collapse': 74, 'dmg_building': 55, 'dmg_infrastructure': 60,

    # Transport
    'transport_accident': 70, 'transport_helicopter': 68, 'transport_air': 60,
    'transport_airport': 55, 'transport_rail': 58, 'transport_metro': 54,
    'transport_ship': 58, 'transport_port': 52, 'transport_land': 40,

    # Infrastructure
    'inf_power': 65, 'inf_pipeline': 68, 'inf_bridge': 60, 'inf_dam': 64,
    'inf_road': 45, 'inf_water': 55, 'inf_internet': 58,

    # Civil
    'civ_election': 72, 'civ_summit': 62, 'civ_treaty': 64, 'civ_diplomacy': 58,
    'civ_refugees': 60, 'civ_humanitarian': 54, 'civ_law': 52, 'civ_strike': 50,

    # Resources
    'res_oil': 50, 'res_gas': 50, 'res_food': 54, 'res_finance': 40,
    'res_currency': 38, 'res_mining': 46, 'res_trade': 42,

    # Media
    'med_propaganda': 36, 'med_press': 34, 'med_censorship': 38, 'med_social': 30,

    # Tech
    'tec_rocket': 62, 'tec_space': 50, 'tec_ai': 34, 'tec_science': 32,

    # Animals
    'ani_wildlife': 30, 'ani_agriculture': 28, 'ani_environmental': 44,

    # Economic / market
    'eco_stockcrash': 60, 'eco_stocksurge': 48, 'eco_inflation': 55,
    'eco_rate': 50, 'eco_oil_spike': 52, 'eco_default': 62,

    # Civil extras
    'civ_famine': 72, 'civ_migration': 58, 'civ_massacre': 85,

    # Nuclear / WMD
    'mil_nuclear': 95,
}


# ---------------------------------------------------------------------------
# 3.  GAZETTEER  — hand-curated conflict-zone + major cities.
#     key (lowercased) -> (lat, lng, canonical_label)
# ---------------------------------------------------------------------------

GAZETTEER: Dict[str, Tuple[float, float, str]] = {
    # Ukraine / Russia theater
    'kyiv':        (50.4501,  30.5234, 'Kyiv'),
    'kiev':        (50.4501,  30.5234, 'Kyiv'),
    'kharkiv':     (49.9935,  36.2304, 'Kharkiv'),
    'kharkov':     (49.9935,  36.2304, 'Kharkiv'),
    'odesa':       (46.4825,  30.7233, 'Odesa'),
    'odessa':      (46.4825,  30.7233, 'Odesa'),
    'lviv':        (49.8397,  24.0297, 'Lviv'),
    'mykolaiv':    (46.9750,  31.9946, 'Mykolaiv'),
    'kherson':     (46.6354,  32.6169, 'Kherson'),
    'zaporizhzhia':(47.8388,  35.1396, 'Zaporizhzhia'),
    'dnipro':      (48.4647,  35.0462, 'Dnipro'),
    'mariupol':    (47.0971,  37.5434, 'Mariupol'),
    'donetsk':     (48.0159,  37.8029, 'Donetsk'),
    'luhansk':     (48.5740,  39.3078, 'Luhansk'),
    'bakhmut':     (48.5951,  38.0006, 'Bakhmut'),
    'avdiivka':    (48.1394,  37.7428, 'Avdiivka'),
    'kramatorsk':  (48.7389,  37.5848, 'Kramatorsk'),
    'sumy':        (50.9077,  34.7981, 'Sumy'),
    'chernihiv':   (51.4982,  31.2894, 'Chernihiv'),
    'crimea':      (45.0000,  34.0000, 'Crimea'),
    'sevastopol':  (44.6167,  33.5254, 'Sevastopol'),
    'simferopol':  (44.9521,  34.1024, 'Simferopol'),

    'moscow':      (55.7558,  37.6173, 'Moscow'),
    'москва':      (55.7558,  37.6173, 'Moscow'),
    'saint petersburg':(59.9343,30.3351,'Saint Petersburg'),
    'st petersburg':(59.9343, 30.3351, 'Saint Petersburg'),
    'belgorod':    (50.5955,  36.5873, 'Belgorod'),
    'kursk':       (51.7373,  36.1873, 'Kursk'),
    'voronezh':    (51.6754,  39.2088, 'Voronezh'),
    'rostov':      (47.2357,  39.7015, 'Rostov-on-Don'),
    'bryansk':     (53.2521,  34.3717, 'Bryansk'),
    'kazan':       (55.8304,  49.0661, 'Kazan'),
    'novorossiysk':(44.7239,  37.7708, 'Novorossiysk'),
    'sochi':       (43.5855,  39.7231, 'Sochi'),
    'kaliningrad': (54.7104,  20.4522, 'Kaliningrad'),

    'minsk':       (53.9006,  27.5590, 'Minsk'),
    'warsaw':      (52.2297,  21.0122, 'Warsaw'),
    'vilnius':     (54.6872,  25.2797, 'Vilnius'),
    'riga':        (56.9496,  24.1052, 'Riga'),
    'tallinn':     (59.4370,  24.7536, 'Tallinn'),
    'chisinau':    (47.0105,  28.8638, 'Chișinău'),
    'transnistria':(46.8419,  29.5067, 'Transnistria'),

    # Middle East
    'jerusalem':   (31.7683,  35.2137, 'Jerusalem'),
    'tel aviv':    (32.0853,  34.7818, 'Tel Aviv'),
    'haifa':       (32.7940,  34.9896, 'Haifa'),
    'gaza':        (31.5017,  34.4668, 'Gaza'),
    'gaza city':   (31.5017,  34.4668, 'Gaza City'),
    'rafah':       (31.2846,  34.2357, 'Rafah'),
    'khan yunis':  (31.3460,  34.3064, 'Khan Yunis'),
    'khan younis': (31.3460,  34.3064, 'Khan Younis'),
    'west bank':   (31.9466,  35.3027, 'West Bank'),
    'ramallah':    (31.9038,  35.2034, 'Ramallah'),
    'hebron':      (31.5326,  35.0998, 'Hebron'),
    'jenin':       (32.4611,  35.3000, 'Jenin'),
    'nablus':      (32.2226,  35.2620, 'Nablus'),
    'beirut':      (33.8938,  35.5018, 'Beirut'),
    'lebanon':     (33.8547,  35.8623, 'Lebanon'),
    'southern lebanon':(33.2721,35.2033,'Southern Lebanon'),
    'damascus':    (33.5138,  36.2765, 'Damascus'),
    'aleppo':      (36.2021,  37.1343, 'Aleppo'),
    'homs':        (34.7270,  36.7234, 'Homs'),
    'idlib':       (35.9306,  36.6339, 'Idlib'),
    'latakia':     (35.5317,  35.7916, 'Latakia'),
    'tartus':      (34.8956,  35.8867, 'Tartus'),
    'deir ez-zor': (35.3359,  40.1408, 'Deir ez-Zor'),
    'raqqa':       (35.9528,  39.0080, 'Raqqa'),
    'golan':       (33.0000,  35.7500, 'Golan Heights'),

    'baghdad':     (33.3152,  44.3661, 'Baghdad'),
    'mosul':       (36.3450,  43.1450, 'Mosul'),
    'basra':       (30.5085,  47.7804, 'Basra'),
    'erbil':       (36.1901,  44.0090, 'Erbil'),
    'kirkuk':      (35.4681,  44.3922, 'Kirkuk'),

    'tehran':      (35.6892,  51.3890, 'Tehran'),
    'isfahan':     (32.6546,  51.6680, 'Isfahan'),
    'bandar abbas':(27.1833,  56.2667, 'Bandar Abbas'),
    'bushehr':     (28.9684,  50.8385, 'Bushehr'),
    'natanz':      (33.7122,  51.9166, 'Natanz'),
    'fordow':      (34.8836,  50.9928, 'Fordow'),
    'hormuz':      (26.5670,  56.2480, 'Strait of Hormuz'),
    'strait of hormuz':(26.5670,56.2480,'Strait of Hormuz'),

    'sanaa':       (15.3694,  44.1910, 'Sanaa'),
    'aden':        (12.7855,  45.0187, 'Aden'),
    'hodeidah':    (14.7978,  42.9545, 'Hodeidah'),
    'red sea':     (20.2802,  38.5126, 'Red Sea'),
    'bab el-mandeb':(12.5826, 43.3273, 'Bab-el-Mandeb'),

    'riyadh':      (24.7136,  46.6753, 'Riyadh'),
    'jeddah':      (21.4858,  39.1925, 'Jeddah'),
    'dubai':       (25.2048,  55.2708, 'Dubai'),
    'abu dhabi':   (24.4539,  54.3773, 'Abu Dhabi'),
    'doha':        (25.2854,  51.5310, 'Doha'),
    'kuwait':      (29.3759,  47.9774, 'Kuwait City'),
    'manama':      (26.2285,  50.5860, 'Manama'),
    'muscat':      (23.5880,  58.3829, 'Muscat'),
    'amman':       (31.9454,  35.9284, 'Amman'),

    'cairo':       (30.0444,  31.2357, 'Cairo'),
    'alexandria':  (31.2001,  29.9187, 'Alexandria'),
    'suez':        (29.9668,  32.5498, 'Suez'),
    'sinai':       (29.5000,  33.8333, 'Sinai'),

    'ankara':      (39.9334,  32.8597, 'Ankara'),
    'istanbul':    (41.0082,  28.9784, 'Istanbul'),
    'izmir':       (38.4192,  27.1287, 'İzmir'),
    'gaziantep':   (37.0662,  37.3833, 'Gaziantep'),

    # Europe
    'london':      (51.5074,  -0.1278, 'London'),
    'paris':       (48.8566,   2.3522, 'Paris'),
    'berlin':      (52.5200,  13.4050, 'Berlin'),
    'brussels':    (50.8503,   4.3517, 'Brussels'),
    'madrid':      (40.4168,  -3.7038, 'Madrid'),
    'barcelona':   (41.3851,   2.1734, 'Barcelona'),
    'rome':        (41.9028,  12.4964, 'Rome'),
    'milan':       (45.4642,   9.1900, 'Milan'),
    'athens':      (37.9838,  23.7275, 'Athens'),
    'lisbon':      (38.7223,  -9.1393, 'Lisbon'),
    'dublin':      (53.3498,  -6.2603, 'Dublin'),
    'amsterdam':   (52.3676,   4.9041, 'Amsterdam'),
    'vienna':      (48.2082,  16.3738, 'Vienna'),
    'prague':      (50.0755,  14.4378, 'Prague'),
    'budapest':    (47.4979,  19.0402, 'Budapest'),
    'bucharest':   (44.4268,  26.1025, 'Bucharest'),
    'sofia':       (42.6977,  23.3219, 'Sofia'),
    'belgrade':    (44.7866,  20.4489, 'Belgrade'),
    'zagreb':      (45.8150,  15.9819, 'Zagreb'),
    'sarajevo':    (43.8563,  18.4131, 'Sarajevo'),
    'skopje':      (41.9981,  21.4254, 'Skopje'),
    'pristina':    (42.6629,  21.1655, 'Pristina'),

    # Caucasus & Central Asia
    'tbilisi':     (41.7151,  44.8271, 'Tbilisi'),
    'yerevan':     (40.1872,  44.5152, 'Yerevan'),
    'baku':        (40.4093,  49.8671, 'Baku'),
    'nagorno-karabakh':(39.8296,46.7525,'Nagorno-Karabakh'),
    'karabakh':    (39.8296,  46.7525, 'Nagorno-Karabakh'),
    'astana':      (51.1694,  71.4491, 'Astana'),
    'almaty':      (43.2220,  76.8512, 'Almaty'),
    'tashkent':    (41.2995,  69.2401, 'Tashkent'),
    'bishkek':     (42.8746,  74.5698, 'Bishkek'),
    'dushanbe':    (38.5598,  68.7870, 'Dushanbe'),
    'ashgabat':    (37.9601,  58.3261, 'Ashgabat'),

    # Asia
    'beijing':     (39.9042, 116.4074, 'Beijing'),
    'shanghai':    (31.2304, 121.4737, 'Shanghai'),
    'hong kong':   (22.3193, 114.1694, 'Hong Kong'),
    'taipei':      (25.0330, 121.5654, 'Taipei'),
    'taiwan strait':(24.0000,119.0000, 'Taiwan Strait'),
    'seoul':       (37.5665, 126.9780, 'Seoul'),
    'pyongyang':   (39.0392, 125.7625, 'Pyongyang'),
    'tokyo':       (35.6762, 139.6503, 'Tokyo'),
    'osaka':       (34.6937, 135.5023, 'Osaka'),
    'manila':      (14.5995, 120.9842, 'Manila'),
    'hanoi':       (21.0285, 105.8542, 'Hanoi'),
    'bangkok':     (13.7563, 100.5018, 'Bangkok'),
    'singapore':   ( 1.3521, 103.8198, 'Singapore'),
    'jakarta':     (-6.2088, 106.8456, 'Jakarta'),
    'kuala lumpur':( 3.1390, 101.6869, 'Kuala Lumpur'),
    'kabul':       (34.5553,  69.2075, 'Kabul'),
    'kandahar':    (31.6206,  65.7100, 'Kandahar'),
    'islamabad':   (33.6844,  73.0479, 'Islamabad'),
    'karachi':     (24.8607,  67.0011, 'Karachi'),
    'lahore':      (31.5204,  74.3587, 'Lahore'),
    'new delhi':   (28.6139,  77.2090, 'New Delhi'),
    'delhi':       (28.6139,  77.2090, 'Delhi'),
    'mumbai':      (19.0760,  72.8777, 'Mumbai'),
    'kashmir':     (34.0837,  74.7973, 'Kashmir'),

    # Africa
    'tripoli':     (32.8872,  13.1913, 'Tripoli'),
    'benghazi':    (32.1167,  20.0667, 'Benghazi'),
    'tunis':       (36.8065,  10.1815, 'Tunis'),
    'algiers':     (36.7538,   3.0588, 'Algiers'),
    'rabat':       (34.0209,  -6.8416, 'Rabat'),
    'casablanca':  (33.5731,  -7.5898, 'Casablanca'),
    'khartoum':    (15.5007,  32.5599, 'Khartoum'),
    'port sudan':  (19.6158,  37.2164, 'Port Sudan'),
    'addis ababa': ( 9.0192,  38.7525, 'Addis Ababa'),
    'nairobi':     (-1.2921,  36.8219, 'Nairobi'),
    'mogadishu':   ( 2.0469,  45.3182, 'Mogadishu'),
    'lagos':       ( 6.5244,   3.3792, 'Lagos'),
    'abuja':       ( 9.0765,   7.3986, 'Abuja'),
    'kinshasa':    (-4.4419,  15.2663, 'Kinshasa'),
    'johannesburg':(-26.2041,  28.0473, 'Johannesburg'),
    'cape town':   (-33.9249,  18.4241, 'Cape Town'),
    'bamako':      (12.6392,  -8.0029, 'Bamako'),
    'niamey':      (13.5137,   2.1098, 'Niamey'),
    'ouagadougou': (12.3714,  -1.5197, 'Ouagadougou'),

    # Americas
    'washington':  (38.9072, -77.0369, 'Washington'),
    'new york':    (40.7128, -74.0060, 'New York'),
    'los angeles': (34.0522,-118.2437, 'Los Angeles'),
    'chicago':     (41.8781, -87.6298, 'Chicago'),
    'miami':       (25.7617, -80.1918, 'Miami'),
    'ottawa':      (45.4215, -75.6972, 'Ottawa'),
    'toronto':     (43.6532, -79.3832, 'Toronto'),
    'mexico city': (19.4326, -99.1332, 'Mexico City'),
    'havana':      (23.1136, -82.3666, 'Havana'),
    'caracas':     (10.4806, -66.9036, 'Caracas'),
    'bogota':      ( 4.7110, -74.0721, 'Bogotá'),
    'lima':        (-12.0464, -77.0428, 'Lima'),
    'santiago':    (-33.4489, -70.6693, 'Santiago'),
    'buenos aires':(-34.6037, -58.3816, 'Buenos Aires'),
    'brasilia':    (-15.8267, -47.9218, 'Brasília'),
    'rio de janeiro':(-22.9068,-43.1729,'Rio de Janeiro'),
    'sao paulo':   (-23.5505, -46.6333, 'São Paulo'),

    # Oceania
    'canberra':    (-35.2809, 149.1300, 'Canberra'),
    'sydney':      (-33.8688, 151.2093, 'Sydney'),
    'wellington':  (-41.2865, 174.7762, 'Wellington'),

    # Countries as fallback centroids
    'ukraine':     (48.3794,  31.1656, 'Ukraine'),
    'russia':      (61.5240, 105.3188, 'Russia'),
    'syria':       (34.8021,  38.9968, 'Syria'),
    'iran':        (32.4279,  53.6880, 'Iran'),
    'iraq':        (33.2232,  43.6793, 'Iraq'),
    'israel':      (31.0461,  34.8516, 'Israel'),
    'palestine':   (31.9522,  35.2332, 'Palestine'),
    'yemen':       (15.5527,  48.5164, 'Yemen'),
    'turkey':      (38.9637,  35.2433, 'Türkiye'),
    'egypt':       (26.0975,  30.0444, 'Egypt'),
    'libya':       (26.3351,  17.2283, 'Libya'),
    'sudan':       (12.8628,  30.2176, 'Sudan'),
    'afghanistan': (33.9391,  67.7100, 'Afghanistan'),
    'pakistan':    (30.3753,  69.3451, 'Pakistan'),
    'india':       (20.5937,  78.9629, 'India'),
    'china':       (35.8617, 104.1954, 'China'),
    'taiwan':      (23.6978, 120.9605, 'Taiwan'),
    'north korea': (40.3399, 127.5101, 'North Korea'),
    'south korea': (35.9078, 127.7669, 'South Korea'),
    'japan':       (36.2048, 138.2529, 'Japan'),
    'philippines': (12.8797, 121.7740, 'Philippines'),
    'france':      (46.2276,   2.2137, 'France'),
    'germany':     (51.1657,  10.4515, 'Germany'),
    'poland':      (51.9194,  19.1451, 'Poland'),
    'romania':     (45.9432,  24.9668, 'Romania'),
    'serbia':      (44.0165,  21.0059, 'Serbia'),
    'kosovo':      (42.6026,  20.9030, 'Kosovo'),
    'moldova':     (47.4116,  28.3699, 'Moldova'),
    'belarus':     (53.7098,  27.9534, 'Belarus'),
    'georgia':     (42.3154,  43.3569, 'Georgia'),
    'armenia':     (40.0691,  45.0382, 'Armenia'),
    'azerbaijan':  (40.1431,  47.5769, 'Azerbaijan'),
    'usa':         (37.0902, -95.7129, 'United States'),
    'united states':(37.0902,-95.7129, 'United States'),
    'uk':          (55.3781,  -3.4360, 'United Kingdom'),
    'united kingdom':(55.3781,-3.4360, 'United Kingdom'),
    'venezuela':   ( 6.4238, -66.5897, 'Venezuela'),
    'cuba':        (21.5218, -77.7812, 'Cuba'),
    'mexico':      (23.6345,-102.5528, 'Mexico'),
    'brazil':      (-14.2350,-51.9253, 'Brazil'),
    'argentina':   (-38.4161,-63.6167, 'Argentina'),
}


# ---------------------------------------------------------------------------
# 4.  HELPERS
# ---------------------------------------------------------------------------

_WORD_RE = re.compile(r"[^\w\s]+", flags=re.UNICODE)
_SPACES_RE = re.compile(r"\s+")

def _strip_accents(s: str) -> str:
    """Drop diacritics for ASCII-ish matching; keep Cyrillic / Arabic as-is."""
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')

def _normalize(text: str) -> str:
    if not text:
        return ''
    t = text.lower()
    t = _strip_accents(t)
    t = _WORD_RE.sub(' ', t)
    t = _SPACES_RE.sub(' ', t).strip()
    return t

def _token_set(text: str):
    return set(t for t in _normalize(text).split(' ') if len(t) >= 3)


# ---------- Negation / context cues ----------
# These modify scoring: if the text is framed as denial, refusal, or failure of
# an event, we must NOT fire that event type. "Ceasefire rejected" is not a
# ceasefire event. "No casualties reported" is not a casualty event.
NEGATION_PHRASES = [
    'no ceasefire', 'ceasefire rejected', 'ceasefire collapsed', 'ceasefire denied',
    'peace talks failed', 'peace treaty rejected', 'rejected peace',
    'no casualties', 'no deaths', 'no injuries', 'no damage', 'no victims',
    'no strike', 'no attack', 'no explosion', 'no missile', 'no drone',
    'denies', 'denied', 'refuted', 'debunked', 'rumor', 'hoax',
    'не было', 'опровергает', 'niega', 'rechaz', 'نفى', 'ينفي',
]

# Content-context signals. If the post's dominant register is commentary/politics,
# we should down-weight "attack" words that might be quoted from a briefing.
ATTACK_CONTEXT_WORDS = {
    'airstrike', 'strike', 'bombing', 'bombed', 'struck', 'explosion',
    'missile', 'drone', 'shelling', 'attack', 'killed', 'wounded',
    'udar', 'udari', 'бомб', 'ракет', 'взрыв', 'قصف', 'ضرب', 'انفجار',
    'ataque', 'bomba', 'muerto',
}
COMMENTARY_CONTEXT_WORDS = {
    'statement', 'announced', 'declared', 'said', 'says', 'noted',
    'commented', 'tweeted', 'posted',
    'заявил', 'сказал', 'объявил',
    'declaró', 'afirmó', 'dijo',
    'قال', 'أعلن', 'صرح',
}

# Status markers: framing of the event as happening now, possible, confirmed, past.
STATUS_PATTERNS = {
    'ongoing':   [
        'breaking', 'ongoing', 'unfolding', 'in progress', 'currently under',
        'right now', 'happening now', 'live:', 'developing', 'under attack',
        'срочно', 'в данный момент', 'сейчас',
        'en curso', 'ahora mismo', 'desarrollando',
        'جاري', 'يحدث الآن',
    ],
    'possible':  [
        'possibly', 'possible', 'reportedly', 'alleged', 'allegedly',
        'unconfirmed', 'rumor', 'rumoured', 'rumored', 'claims', 'claimed',
        'appears to', 'may have', 'might have', 'suspected',
        'возможно', 'предположительно', 'якобы',
        'posible', 'presuntamente', 'al parecer',
        'محتمل', 'يُزعم', 'ربما',
    ],
    'confirmed': [
        'confirmed', 'verified', 'officially', 'official statement',
        'spokesperson confirmed', 'ministry confirmed',
        'подтвердил', 'официально',
        'confirmado', 'oficialmente', 'verificado',
        'تأكيد', 'رسمياً', 'مؤكد',
    ],
    'past':      [
        'yesterday', 'last night', 'last week', 'aftermath', 'hours after',
        'вчера', 'позавчера', 'ayer', 'anoche', 'البارحة', 'أمس',
    ],
}

def _has_any(text: str, phrases) -> bool:
    return any(p in text for p in phrases)

def _detect_status(text_lower: str) -> Optional[str]:
    # Priority: confirmed > ongoing > past > possible (confirmed beats rumor)
    for status in ('confirmed', 'ongoing', 'past', 'possible'):
        if _has_any(text_lower, STATUS_PATTERNS[status]):
            return status
    return None

def _detect_negation(text_lower: str, best_type: str) -> bool:
    """If the text explicitly denies an event of this type, drop it."""
    if not _has_any(text_lower, NEGATION_PHRASES):
        return False
    # Heuristic: if the event keyword is right next to a negation phrase,
    # the event is denied. Cheap proxy: both present within 60 chars.
    kws = EVENT_KEYWORDS.get(best_type, [])
    for n in NEGATION_PHRASES:
        if n not in text_lower:
            continue
        ni = text_lower.find(n)
        for kw in kws:
            kw = kw.lower().strip()
            if not kw:
                continue
            ki = text_lower.find(kw)
            if ki < 0:
                continue
            if abs(ki - ni) <= 80:  # close proximity ⇒ denial applies to this event
                return True
    return False


# ---------- Classification ----------
#
# The classifier uses **category-majority voting** on top of keyword hits.
# Instead of just picking the single event_type with the most keyword hits,
# we first aggregate hits PER CATEGORY (military, security, nature, …) and
# decide which category the text is most about. Within that dominant category
# we then pick the most specific event_type. This mimics how a human reader
# decides "this is a military story / this is an earthquake story" before
# drilling in on the specific sub-event.
#
# Scoring signals:
#   • primary_kw     — specific, high-signal words ("missile", "earthquake")
#   • secondary_kw   — supporting words scored at half weight
#   • category_bonus — +50% if ≥2 event_types within the same category fired
#   • commentary_penalty — halves resources/media/civil scores when the post
#                          is framed as commentary (statement/announced/…)
#   • attack_boost   — doubles weight on attack-family keywords when there
#                      are multiple co-occurring attack words (attack + killed
#                      + drone = strong signal, not one quoted word)
#   • negation_skip  — drops event types explicitly denied by the post
#
# The result reads like category-first majority voting: "what CATEGORY does
# this post talk about?" → "within it, what SPECIFIC event?".

# Secondary, low-weight context words that hint at a category without being
# specific event keywords. They raise confidence in the dominant category but
# never win on their own.
CATEGORY_CONTEXT_WORDS: Dict[str, List[str]] = {
    'military': ['war', 'frontline', 'combat', 'offensive', 'defensive',
                 'generals', 'military', 'armed forces', 'война', 'фронт',
                 'война', 'guerra', 'حرب', 'militar', 'armée'],
    'security': ['police', 'security forces', 'raid', 'intelligence service',
                 'полиц', 'спецслужб', 'policía', 'شرطة', 'أمن'],
    'nature':   ['magnitude', 'richter', 'epicenter', 'disaster', 'natural',
                 'балл', 'эпицентр', 'катастроф', 'desastre', 'كارثة'],
    'health':   ['doctor', 'nurse', 'patient', 'medicine', 'hospital',
                 'медиц', 'врач', 'paciente', 'طبيب', 'مريض'],
    'transport':['driver', 'passenger', 'vehicle', 'traffic',
                 'водитель', 'пассажир', 'conductor', 'حركة المرور'],
    'damage':   ['destroyed', 'damaged', 'in flames', 'razed', 'ruins',
                 'разрушен', 'поврежд', 'destruido', 'مدمر'],
    'civil':    ['parliament', 'president', 'minister', 'government', 'cabinet',
                 'парламент', 'президент', 'gobierno', 'وزير', 'رئيس'],
    'infrastructure':['electricity', 'power grid', 'water network', 'communications',
                      'электросет', 'red eléctrica', 'شبكة الكهرباء'],
    'media':    ['broadcast', 'news outlet', 'article', 'report',
                 'телеканал', 'medio', 'قناة'],
    'resources':['barrel', 'commodity', 'opec', 'reserve',
                 'баррел', 'barril', 'برميل'],
    'technology':['launch', 'prototype', 'experimental', 'beta',
                  'прототип', 'prototipo', 'نموذج'],
    'animals':  ['herd', 'livestock', 'population', 'reserve',
                 'стадо', 'поголовье', 'rebaño', 'قطيع'],
}


def _count_category_context(category: str, norm: str, native: str) -> int:
    """How many category-context words appear in the text?"""
    words = CATEGORY_CONTEXT_WORDS.get(category, [])
    return sum(1 for w in words if w in norm or w in native)


def _category_of(etype: str) -> str:
    return EVENT_TYPES.get(etype, {}).get('cat', 'other')


def classify(text: str) -> Tuple[str, float, Optional[str]]:
    """
    Return (event_type, score, status) using category-majority voting.

    1. Compute per-event_type keyword hits.
    2. Aggregate into per-CATEGORY totals (military, nature, …).
    3. Pick the dominant category by total score + category-context words.
    4. Within that category pick the specific event_type with the strongest
       signal, breaking ties by priority.
    5. Apply negation — skip denied events.
    6. Apply commentary penalty on "quote-heavy" posts for soft categories.
    """
    if not text:
        return 'generic_event', 0.0, None

    norm = _normalize(text)
    native = text.lower()
    combined = norm + ' ||| ' + native

    # Register-of-voice detection (commentary vs reporting).
    commentary_hits = sum(1 for w in COMMENTARY_CONTEXT_WORDS if w in combined)
    attack_hits = sum(1 for w in ATTACK_CONTEXT_WORDS if w in combined)
    commentary_weight = 1.0
    if commentary_hits >= 2 and attack_hits <= 1:
        commentary_weight = 0.45
    attack_boost = 1.0
    if attack_hits >= 3:
        attack_boost = 1.35   # multiple attack words = strong event, not a quote

    # --- PASS 1: per-event_type keyword hits ---
    per_type_score: Dict[str, float] = {}
    per_type_hits: Dict[str, int] = {}

    for etype, kwlist in EVENT_KEYWORDS.items():
        hits = 0
        for kw in kwlist:
            k = kw.lower().strip()
            if not k:
                continue
            if k in norm or k in native:
                hits += 1
        if hits == 0:
            continue
        prio = EVENT_PRIORITY.get(etype, 10)
        # Multi-hit bonus: 2+ matching keywords is the signal that separates
        # a real event from a passing mention in an unrelated article.
        multiplier = 1.0 + 0.3 * (hits - 1)
        score = hits * (prio / 100.0) * multiplier
        cat = _category_of(etype)
        if cat in ('civil', 'media', 'resources', 'technology', 'animals'):
            score *= commentary_weight
        if cat == 'military' or cat == 'security':
            score *= attack_boost
        per_type_score[etype] = score
        per_type_hits[etype] = hits

    if not per_type_score:
        return 'generic_event', 0.0, _detect_status(native)

    # --- PASS 2: aggregate by CATEGORY ---
    category_score: Dict[str, float] = {}
    category_event_count: Dict[str, int] = {}
    for etype, s in per_type_score.items():
        cat = _category_of(etype)
        category_score[cat] = category_score.get(cat, 0) + s
        category_event_count[cat] = category_event_count.get(cat, 0) + 1

    # Context-word bonus: text about "war/frontline/generals" boosts
    # the military category even without a specific kw hit on that category.
    for cat in list(category_score.keys()):
        ctx = _count_category_context(cat, norm, native)
        if ctx > 0:
            category_score[cat] *= (1.0 + 0.1 * ctx)
        # Multi-event reinforcement: if ≥2 different event_types within the
        # category fired, raise confidence — the post is *clearly* about that
        # category (e.g. "missile + drone + airstrike" = military story).
        if category_event_count.get(cat, 0) >= 2:
            category_score[cat] *= 1.5

    # --- PASS 3: pick dominant category, then best event in it ---
    dominant_cat = max(category_score.keys(), key=lambda c: category_score[c])

    # Candidates in the dominant category, sorted by (score, priority).
    in_cat = {t: s for t, s in per_type_score.items() if _category_of(t) == dominant_cat}

    # Apply negation filtering within the dominant category
    non_denied = {t: s for t, s in in_cat.items() if not _detect_negation(native, t)}
    if not non_denied:
        # Dominant category fully denied — fall back to second-best category
        remaining_cats = {c: s for c, s in category_score.items() if c != dominant_cat}
        if remaining_cats:
            dominant_cat = max(remaining_cats.keys(), key=lambda c: remaining_cats[c])
            in_cat = {t: s for t, s in per_type_score.items()
                      if _category_of(t) == dominant_cat}
            non_denied = {t: s for t, s in in_cat.items()
                          if not _detect_negation(native, t)}
            if not non_denied:
                return 'generic_event', 0.0, _detect_status(native)
        else:
            return 'generic_event', 0.0, _detect_status(native)

    best_type = max(non_denied.keys(),
                    key=lambda t: (non_denied[t], EVENT_PRIORITY.get(t, 10)))

    # Final score combines per-type score with the dominant-category score —
    # this is what makes confidence rise when the whole text is about the
    # same category ("all signals agreeing").
    final_score = non_denied[best_type] + 0.25 * category_score[dominant_cat]
    status = _detect_status(native)
    return best_type, min(1.0, final_score), status


# ---------- Location extraction ----------

# Pre-compile gazetteer keys sorted by length (longest first) to prefer
# "khan yunis" over "khan" and "new york" over "york".
_GAZ_KEYS_SORTED = sorted(GAZETTEER.keys(), key=len, reverse=True)

def extract_location(text: str) -> Optional[Tuple[float, float, str]]:
    """
    Find the first (longest-match) gazetteer hit in the text.
    Returns (lat, lng, canonical_label) or None.
    """
    if not text:
        return None
    norm = _normalize(text)
    native = text.lower()

    for key in _GAZ_KEYS_SORTED:
        # Word-boundary match in normalized ascii or in original lowercase (for cyrillic keys)
        if _match_word(norm, key) or _match_word(native, key):
            lat, lng, label = GAZETTEER[key]
            return lat, lng, label
    return None

def _match_word(haystack: str, needle: str) -> bool:
    if not needle:
        return False
    idx = haystack.find(needle)
    if idx < 0:
        return False
    before_ok = idx == 0 or not haystack[idx - 1].isalnum()
    end = idx + len(needle)
    after_ok = end >= len(haystack) or not haystack[end].isalnum()
    return before_ok and after_ok


# ---------- Deduplication ----------

_DEDUP_WINDOW_SEC = 2 * 3600  # 2 hours

def dedup_key(event_type: str, loc_label: Optional[str]) -> str:
    return f"{event_type}|{loc_label or '-'}"

def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def near_duplicate(text_a: str, text_b: str, thresh: float = 0.45) -> bool:
    """Jaccard over ≥3-char token sets."""
    return jaccard(_token_set(text_a), _token_set(text_b)) >= thresh


class EventDeduplicator:
    """
    Holds a rolling window of recent events and reports whether an incoming
    event is a duplicate of something already seen.
    """
    def __init__(self, window_sec: int = _DEDUP_WINDOW_SEC):
        self.window_sec = window_sec
        self._events: List[dict] = []

    def _prune(self, now_ts: float):
        cutoff = now_ts - self.window_sec
        self._events = [e for e in self._events if e['ts'] >= cutoff]

    def find_duplicate(self, event_type: str, loc_label: Optional[str],
                       text: str, now_ts: Optional[float] = None) -> Optional[dict]:
        if now_ts is None:
            now_ts = time.time()
        self._prune(now_ts)
        key = dedup_key(event_type, loc_label)
        cand_tokens = _token_set(text)
        for e in self._events:
            if e['key'] != key:
                continue
            if jaccard(cand_tokens, e['tokens']) >= 0.35:
                return e
            # Same type+location within a tight window → treat as same incident
            if (now_ts - e['ts']) <= 1800:
                return e
        return None

    def register(self, event_id: str, event_type: str, loc_label: Optional[str],
                 text: str, channel: str, ts: Optional[float] = None) -> dict:
        if ts is None:
            ts = time.time()
        rec = {
            'id': event_id,
            'key': dedup_key(event_type, loc_label),
            'tokens': _token_set(text),
            'channels': {channel},
            'ts': ts,
            'text': text,
        }
        self._events.append(rec)
        return rec

    def add_channel(self, record: dict, channel: str):
        record['channels'].add(channel)


# ---------------------------------------------------------------------------
# 5.  Convenience: end-to-end analysis
# ---------------------------------------------------------------------------

def analyze(text: str) -> dict:
    """Return enriched metadata for a piece of news."""
    etype, score, status = classify(text)
    meta = EVENT_TYPES.get(etype, EVENT_TYPES['generic_event'])
    loc = extract_location(text)
    out = {
        'event_type': etype,
        'event_label': meta['label'],
        'event_icon': meta['icon'],
        'event_cat': meta['cat'],
        'event_status': status,    # ongoing/possible/confirmed/past or None
        'score': round(score, 3),
    }
    if loc:
        out['lat'], out['lng'], out['location'] = loc
        # Geographic granularity tier: the gazetteer is sorted longest-first,
        # so a hit on "Rafah" beats "Gaza" beats "Palestine". This flag lets the
        # frontend know whether we have a precise city or just a country centroid.
        label_lower = loc[2].lower()
        country_labels = {'ukraine', 'russia', 'syria', 'iran', 'iraq', 'israel',
                          'palestine', 'yemen', 'türkiye', 'turkey', 'egypt',
                          'libya', 'sudan', 'afghanistan', 'pakistan', 'india',
                          'china', 'taiwan', 'north korea', 'south korea', 'japan',
                          'philippines', 'france', 'germany', 'poland', 'romania',
                          'serbia', 'kosovo', 'moldova', 'belarus', 'georgia',
                          'armenia', 'azerbaijan', 'united states', 'united kingdom',
                          'venezuela', 'cuba', 'mexico', 'brazil', 'argentina'}
        if label_lower in country_labels:
            out['loc_tier'] = 'country'
        elif any(w in label_lower for w in ('sea', 'strait', 'bay', 'gulf', 'ocean')):
            out['loc_tier'] = 'water'
        elif any(w in label_lower for w in ('bank', 'crimea', 'donbas', 'golan',
                                            'sinai', 'kashmir', 'karabakh')):
            out['loc_tier'] = 'region'
        else:
            out['loc_tier'] = 'city'
    else:
        out['lat'] = out['lng'] = None
        out['location'] = None
        out['loc_tier'] = None
    return out


if __name__ == '__main__':
    # Quick smoke test
    samples = [
        "BREAKING: Russian missile strike on Kyiv — several explosions reported",
        "Israeli airstrike hits Rafah, casualties reported",
        "7.2 magnitude earthquake strikes near Istanbul",
        "Shahed drones targeted Odesa overnight; air defense intercepted",
        "Protests continue in Tbilisi over new foreign agents law",
    ]
    for s in samples:
        print(s)
        print(' ->', analyze(s))
        print()
