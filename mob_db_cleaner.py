#!/usr/bin/python
# -*- coding: UTF-8 -*-

from __future__ import print_function
import argparse
import json
from collections import OrderedDict

STEAL_DB_SKIPS = (
    'SpriteName',
    'Lv',
    'Hp',
    'Sp',
    'Exp',
    'JExp',
    'AttackRange',
    'Attack',
    'Def',
    'Mdef',
    'Str', 'Agi', 'Vit', 'Int', 'Luk',
    'ViewRange',
    'ChaseRange',
    'Size',
    'Race',
    'Element',
    'MoveSpeed',
    'AttackDelay',
    'AttackMotion',
    'DamageMotion',
    'MvpExp',
    'Mode',
)

def mob_db_to_json(filename):
    mob_db = ''
    prev_line = ''
    skip_flag = False
    drops_flag = False
    with open(filename, 'r') as f:
        for line in f:
            # remove comments
            if line.startswith('//'):
                continue
            if line.startswith('/*'):
                skip_flag = True
            if line.endswith('*/\n'):
                skip_flag = False
                continue
            if line.startswith(('mob_db: (', ')', '\n')):
                continue

            if not skip_flag:
                # quote key
                data = line.split(':')
                if len(data) > 1:
                    if drops_flag:
                        line = '{"%s": %s}\n' % (data[0].strip(), data[1].strip())
                    else:
                        line = '"%s": %s\n' % (data[0].strip(), data[1].strip())
                # fix json
                if (not line.strip().startswith(('{', '}', '[', ']')) or drops_flag) and \
                   (not prev_line.endswith(('{\n', '[\n'))):
                    line = ',' + line.lstrip()
                # tuple fix
                #if 'Element' in line:
                line = line.replace('(', '[').replace(')', ']')
                # 'Drops' fix, should be a list of objects
                if '"Drops":' in line:
                    line = line.replace('{', '[')
                    drops_flag = True
                if drops_flag and line.strip() == ',}':
                    line = ']'
                    drops_flag = False
                mob_db += line.strip()
                prev_line = line
    if mob_db.endswith('},'):
        mob_db = mob_db[:-1]
    mob_db = '[%s]' % mob_db

    return json.loads(mob_db, object_pairs_hook=OrderedDict)

# https://stackoverflow.com/questions/10179033/
# fixed for OrderedDict
def remove_keys(obj, rubbish):
    if isinstance(obj, dict):
        obj = OrderedDict([
            (key, remove_keys(value, rubbish)) 
            for key, value in obj.iteritems()
            if key not in rubbish])
    elif isinstance(obj, list):
        obj = [remove_keys(item, rubbish)
                  for item in obj
                  if item not in rubbish]
    return obj


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='converts mob_db.conf to a proper json')
    parser.add_argument('filename', type=str, help='specify input mob_db.conf file')
    parser.add_argument('--steal', action='store_true', help='generate stripped steal_db')
    parser.add_argument('--dump', action='store_true', help='dump json result')
    args = parser.parse_args()
    
    mob_db = mob_db_to_json(args.filename)

    if args.steal:
        mob_db = remove_keys(mob_db, STEAL_DB_SKIPS)

    if args.dump:
        with open('mob_db.json', 'w') as f:
            f.write(json.dumps(mob_db))
    else:
        print(json.dumps(mob_db, indent=4))