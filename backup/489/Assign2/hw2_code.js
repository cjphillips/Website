// Student name: Colin Phillips
// Student ID: 11357836

function BST(comparer)
{
    this.m_root = null;
    
    /* Challenge */
    this.m_first = null;
    this.m_last = null;
        
    this.m_count = 0;
    
    /* Create a default comparing function if necessary */
    if (comparer === undefined || comparer == null)
    {
        comparer = function (a, b)
        {
            if (a < b) { return -1; }
            else if (a > b) { return 1; }
            return 0;
        }
    }
    
    this.m_compare = comparer;
};

/* Adds a value to the tree and inserts it into the insertion order list. 
    Returns true if the value was added; false otherwise. */
BST.prototype.add = function(val)
{
    if (val === undefined || val == null) 
    {
        // Don't attempt to add a null or undefined value
        return false;
    }
    if (this.m_root === undefined || this.m_root == null)
    {
        this.m_root = {
            value: val,
            left: null,
            right: null,
            parent: null,
            next: null,
            previous: null
        };
        
        this.m_first = this.m_last = this.m_root;
        this.m_count++;
        
        return true;
    }

    var cur = this.m_root;
    while(true)
    {
        var compareResult = this.m_compare(cur.value, val);
        
        if (compareResult > 0)
        {
            if (cur.left == null)
            {
                cur.left = {
                    value: val,
                    left: null,
                    right: null,
                    parent: cur,
                    next: null,
                    previous: this.m_last
                };
                
                this.m_last.next = cur.left;
                this.m_last = cur.left;

                break;
            }

            cur = cur.left;
        }
        else if(compareResult < 0)
        {
            if (cur.right == null)
            {
                cur.right = {
                    value: val,
                    left: null,
                    right: null,
                    parent: cur,
                    next: null,
                    previous: this.m_last
                };
                
                this.m_last.next = cur.right;
                this.m_last = cur.right;

                break;
            }

            cur = cur.right;
        }
        else
        {
            return false;
        }
    }
    
    this.m_count++;
    return true;
};

/* Removes a value from the tree as well as the insertion-order linked-list.
    Returns true if the value was removed; false otherwise. */
BST.prototype.remove = function(val, node)
{
    if (val === undefined || val == null)
    {
        return false;
    }
    
    if (node === undefined)
    {
        node = this.m_root;
    }
    
    if (node == null)
    {
        return false;
    }
    
    /* Find, remove, and return the disconnected node */
    var removed = this.retrieveAndRemove(val, node);
    
    /* If found, remove this node from its location within the linked-list */
    if (removed !== null)
    {
        var temp = removed.previous;
        if (temp)
        {
            temp.next = removed.next;
        }
        if (removed.next)
        {
            removed.next.previous = temp;
        }
        
        if (removed === this.m_first)
        {
            this.m_first = this.m_first.next;
        }
        if (removed === this.m_last)
        {
            this.m_last = this.m_last.previous;
        }
        /* NOTE: If the removed node was both the first AND last node in the list,
                 the above conditions will still properly update the list. */

        /* Decrement the number of nodes contained with in the tree / list */
        this.m_count--;
        
        return true;
    }
    
    return false; // No node containing the passed value was found
};

/* Utility function to remove a value from the tree.
    Returns the disconnected node from the tree; null otherwise. */
BST.prototype.retrieveAndRemove = function(val, node)
{
    if (node === null)
    {
        return null;
    }
    
    var compareResult = this.m_compare(node.value, val);
    if (compareResult > 0)
    {
        /* Recursively traverse the left subtree to look for the node */
        return this.retrieveAndRemove(val, node.left);
    }
    else if (compareResult < 0)
    {
        /* Recursively traverse the right subtree to look for the node */
        return this.retrieveAndRemove(val, node.right);
    }
    else
    {
        /* The node containing the value-to-delete has been found */
        var par = node.parent;
        
        if (node.left === null && node.right === null)
        {
            /* Removing a leaf node */
            if (node === this.m_root)
            {
                /* The tree only has a root node */
                this.m_root = this.m_first = this.m_last = null;
                return node;
            }
            else
            {
                if (par !== null)
                {
                    if (par.left === node)
                    {
                        par.left = null;
                    }
                    else
                    {
                        par.right = null;
                    }
                }
                
                node.par = null;
            }
        }
        else if (node.left === null)
        {
            /* Only RIGHT child is active on this node */
            var child = node.right;
            child.parent = par;
            
            if (par !== null)
            {
                if (par.left === node)
                {
                    par.left = child;
                }
                else
                {
                    par.right = child;
                }
            }
            else
            {
                /* Update the root if necessary (the node being deleted was the root) */
                this.m_root = child;
            }

            node.par = node.right = null;
        }
        else if (node.right === null)
        {
            /* Only LEFT child is active on this node */
            var child = node.left;
            child.parent = par;
            
            if (par !== null)
            {
                if (par.left === node)
                {
                    par.left = child;
                }
                else
                {
                    par.right = child;
                }
            }
            else
            {
                /* Update the root if necessary (the node being deleted was the root) */
                this.m_root = child;
            }
            
            node.par = node.left = null;
        }
        else
        {
            /* TWO children are active on this node */
            var res = this.getMax(node.left);   // Get the max value in the left subtree
            var replacement = this.retrieveAndRemove(res, node.left); // Recursively remove this max value and get its node
            
            /* Replace the max value node with the node that is being removed */
            replacement.left = node.left;
            replacement.right = node.right;
            replacement.parent = node.parent;
            if (node.parent !== null)
            {
                if (node.parent.left === node)
                {
                    node.parent.left = replacement;
                }
                else
                {
                    node.parent.right = replacement;
                }
            }
            if (node.left !== null)
            {
                replacement.left.parent = replacement;
            }
            if (node.right !== null)
            {
                replacement.right.parent = replacement;
            }
            
            /* Update the root if necessary */
            if (node === this.m_root)
            {
                this.m_root = replacement;
            }
            
            node.left = node.right = node.parent = null;
        }
    }
    
    return node;
}

/* Returns the maximum value in the tree. */
BST.prototype.getMax = function(node)
{
    if (node === undefined)
    {
        node = this.m_root;
    }
    
    if (node == null)
    {
        return undefined;
    }
    
    /* Traverse right as long as possible */
    if (node.right)
    {
        return this.getMax(node.right);
    }
    
    return node.value;
};

/* Returns the minimum value in the tree. */
BST.prototype.getMin = function(node)
{
    if (node === undefined)
    {
        node = this.m_root;
    }
    
    if (node == null)
    {
        return undefined;
    }
    
    /* Traverse left as long as possible */
    if (node.left)
    {
        return this.getMin(node.left);
    }
    
    return node.value;
};

/* Returns the zero-based level of a particular node in the tree. */
BST.prototype.getLevel = function(val, node)
{
    if (val === undefined || val == null)
    {
        return -1;
    }
    
    if (node === undefined)
    {
        node = this.m_root;
    }
    
    if (node == null)
    {
        return -1;
    }
    
    var compareResult = this.m_compare(node.value, val);
    if (compareResult > 0)
    {
        return this.getLevel(val, node.left) + 1;
    }
    else if (compareResult < 0)
    {
        return this.getLevel(val, node.right) + 1;
    }
    
    return 0;
};

/* Determines if the tree contains a particular value.
    Returns true if the value is found; false otherwise. */
BST.prototype.has = function(val)
{
    if (val === undefined || val == null)
    {
        return false;
    }
    
    var cur = this.m_root;
    while(cur)
    {
        var compareResult = this.m_compare(cur.value, val);
        if (compareResult > 0)
        {
            cur = cur.left;
        }
        else if (compareResult < 0)
        {
            cur = cur.right;
        }
        else
        {
            return true;
        }
    }
    
    return false;
};

/* Returns the total number of values in the tree / list. */
BST.prototype.count = function()
{
    return this.m_count;
}

/* Returns a string representation of the tree in ascending order that is delimited by a given value (or space otherwise). */
BST.prototype.toString = function(delim, node)
{
    if (delim === undefined || delim == null) delim = " ";
    
    if (node === undefined) node = this.m_root;
    
    if (node == null) return null;
    
    var builder = "";
    
    var fromChild = this.toString(delim, node.left);
    if (fromChild) 
    {
        builder = fromChild + delim;
    }
    
    builder += node.value;
    
    fromChild = this.toString(delim, node.right);
    if (fromChild)
    {
        builder = builder + delim + fromChild;
    }
    
    return builder;
};

/* Perform an operation on each value of the tree.
    The second parameter should be true if the insertion order (linked-list) should be used. */
BST.prototype.forEach = function(callback, useInsertionOrder)
{
    if (useInsertionOrder === undefined)
    {
        useInsertionOrder = false;
    }
    
    if (useInsertionOrder)
    {
        var cur = this.m_first;
        while(cur)
        {
            callback(cur.value, this);
            cur = cur.next;
        }
    }
    else
    {
        
    }
}