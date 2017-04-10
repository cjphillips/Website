from pyeda.inter import *

n = None
k = None

class rcolors:
    TRUE = '\033[92m'
    FALSE = '\033[91m'
    ENDC = '\033[0m'

def fiveStepReach(i, j):
    ii = list(map(int, list('{0:010b}'.format(i))))
    jj = list(map(int, list('{0:010b}'.format(j))))

    x_vars = bddvars('x', k)
    y_vars = bddvars('y', k)
    z_vars = bddvars('z', k)

    y_to_z = {}
    x_to_z = {}
    for i in range(k):
        y_to_z[y_vars[i]] = z_vars[i]
        x_to_z[x_vars[i]] = z_vars[i]

    #five step reachability
    print ("Determining reachability WITHIN 5 steps ... ")
    hh=rr
    # WITHIN 5 steps
    for i in range(5):
        hh_new = hh.compose(y_to_z)
        hh_nxt = rr.compose(x_to_z)
        hh=(hh_new & hh_nxt).smoothing(set(z_vars)) | hh

    print ("Reachability Result: ", end='')
    #test node 3 can reach node 0 in two steps, which must be false
    if (hh.restrict({xx1:0, xx2:0, yy1:1, yy2:1})):
        print (rcolors.TRUE + "True." + rcolors.ENDC)
    else:
        print (rcolors.FALSE + "False." + rcolors.ENDC)

def getExpression(first, second):
    x_array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    y_array = ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't']

    i = 0
    exp = ""
    for char in first:
        if char == '0':
            exp += '~'
        exp += x_array[i] + ' & '
        i += 1
    i = 0
    for char in second:
        if char == '0':
            exp += '~'
        exp += y_array[i]
        if i != len(second) - 1:
            exp += ' & '
        i += 1

    print (exp)
    return exp

def getGraph():
    print ("Opening 'graph1.txt' to get edges ... ")
    infile = open('graph1.txt', 'r')
    nodes = set()
    graph = None

    for line in infile:
        parts = line.split()
        first = '{0:010b}'.format(int(parts[0]))
        second = '{0:010b}'.format(int(parts[1]))
        nodes.add(first)
        nodes.add(second)
        if graph == None:
            graph = expr2bdd(expr(getExpression(first, second)))
        else:
            graph |= expr2bdd(expr(getExpression(first, second)))

    n = len(nodes);
    print (" > Nr. Nodes: " + str(n))

    from math import log
    k = int(log(n, 2));
    print (" > Bits req.: " + str(k))

    return graph;


graph = getGraph()
fiveStepReach(0, 1)



exit(0)
