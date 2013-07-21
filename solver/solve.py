#!/usr/bin/python
#Author : Rajeev S <rajeevs1992@gmail.com>

#Requires to install xdotools

import time, os

def solve():
    if os.system('xdotool key a 2>/dev/null'):
        print 'Install xdotool as sudo apt-get install xdotool'
        return
    print 'Open puzzle and click on browser window'
    solution = 'drrdllurruldrdlluurdldrurdlluu'
    mapping = {}
    mapping['r'] = 'Right'
    mapping['l'] = 'Left'
    mapping['u'] = 'Up'
    mapping['d'] = 'Down'
    time.sleep(5)
    for i in solution:
        os.system(' xdotool key %s' % (mapping[i]))
        time.sleep(.2)
solve()        
