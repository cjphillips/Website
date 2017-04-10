from pyeda.boolalg.bdd import (
    bddvar,  expr2bdd, bdd2expr
)

from pyeda.boolalg.expr import exprvar

class rcolors:
    TRUE = '\033[92m'
    FALSE = '\033[91m'
    ENDC = '\033[0m'

def getEdges():
    print ("Opening 'graph1.txt' to get edges ... ")
    infile = open('graph1.txt', 'r')
    nodes = set()
    edges = []

    for line in infile:
        first = bin(int(line[0]))[2:]
        second = bin(int(line[2]))[2:]
        nodes.add(first)
        nodes.add(second)
        edges.append((first, second))

    n = len(nodes);
    print (" > Nr. Nodes: " + str(n))

    from math import log
    k = int(log(n, 2));
    print (" > Bits req.: " + str(k))


    convertedEdges = []
    for edge in edges:
        one = edge[0]
        two = edge[1]
        if len(edge[0]) < k:
            builder = ""
            for i in range(k - len(edge[0])):
                builder += '0'
                one = builder + edge[0]
        if len(edge[1]) < k:
            builder = ""
            for i in range(k - len(edge[1])):
                builder += '0'
                two = builder + edge[1]
        convertedEdges.append((one, two))

    return convertedEdges


edges = getEdges()

print (edges);

print ("Mapping boolean variables ... ")
x1, x2, y1, y2, z1, z2 = map(exprvar, 'abcdef')

print ("Mapping BDD variables ... ")
xx1, xx2, yy1, yy2, zz1, zz2 = map(bddvar, 'abcdef')

#translating edges to bool formulas and bdds
print ("Translating edges to boolean formulas and BDDs ... ")
#first edge 0-->1, i.e., 00 --> 01
r= ~x1 & ~x2 & ~y1 & y2
rr= expr2bdd(r)

#second edge 1-->2; i.e., 01-->10
r= ( ~x1 & x2 & y1 & ~y2  )
rr= rr | expr2bdd(r)

#third edge  2-->3; i.e., 10-->11
r= ( x1 & ~x2 & y1 & y2  )
rr= rr | expr2bdd(r)

#fourth edge  3-->0; i.e., 11-->00
r= ( x1 & x2 & ~y1 & ~y2  )
rr= rr | expr2bdd(r)


#two step reachability
print ("Determining Reachability ... ")
hh=rr
for i in range(0):
    _hh = hh
    hh_new = _hh.compose({yy1:zz1, yy2:zz2})
    hh_nxt = rr.compose({yy1:yy1, yy2:yy2})
    hh=(hh_new & hh_nxt).smoothing({zz1,zz2}) | _hh

#hh=rr.compose({yy1:zz1, yy2:zz2}) & rr.compose({xx1:zz1, xx2:zz2})
#hh=hh.smoothing({zz1,zz2})

print ("Reachability Result: ", end='')
#test node 3 can reach node 0 in two steps, which must be false
try:
    assert hh.restrict({xx1:1, xx2:1, yy1:0, yy2:0})
    print (rcolors.TRUE + "True." + rcolors.ENDC)
except Exception as ex:
    print (rcolors.FALSE + "False." + rcolors.ENDC)



exit(0)
