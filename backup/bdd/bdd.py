# Colin Phillips
# 11357836
# CS 350 - Spring 2017

from pyeda.inter import *

def buildBDD(path):
    infile = open(path, 'r')
    pairs = []

    # Parse the file to get an array of node pairs
    for line in infile:
        first = line[0]
        second = line[2]
        pairs.append((int(first), int(second)))

    print (pairs)

    print (f)
    f = expr2bdd(f)
    print (f)


def FiveStepReach(i, j):
    pass

try:
    buildBDD('graph.txt')
except Exception as e:
    print (str(e))
