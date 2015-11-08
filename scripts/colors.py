# http://www.perbang.dk/rgbgradient/
# 1) pick colors
# 2) copy and paste into colors.txt
# 3) run this

import json
c = [o.strip() for o in open('colors.txt').readlines()]
c = filter(lambda o: len(o) > 3, c)
c = ['#' + o for o in c]
print json.dumps(c)
